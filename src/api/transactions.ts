import { RowDataPacket } from 'mysql2';
import { dbcon } from "../models/db";
import { TRANSACTION } from '../models/model';
import { cacheList } from '../api/cacheList';
import BigNumber from "bignumber.js";
import {
    Cluster,
    clusterApiUrl,
    Connection,
    Message,
    PublicKey,
    sendAndConfirmTransaction,
    SystemProgram,
    Transaction,
    TransactionError
} from '@solana/web3.js';

//import BigNumber from 'bignumber.js';
//import { Console } from 'console';

function map_row_vault(row: RowDataPacket): TRANSACTION {

    return {
        "transaction_id": row.transaction_id,
        "wallet_address_id": row.wallet_address_id,
        "address_id": row.address_id,
        "symbol": cacheList["_" + row.address_id],
        "amount": row.amount,
        "transaction_type": row.transaction_type,
        "slot": row.slot,
        "sawp_group": row.sawp_group,
        "conversion_rate": row.conversion_rate,
        "base_address_id": cacheList["_" + row.base_address_id] || "",
        "status": row.status
    }
}
export async function getDetailTransactions(wallet_address_id: string, address_id: string, callback: (r: TRANSACTION[]) => void) {
    dbcon.query(`SELECT
                    transaction_id,
                    address_id,
                    amount,
                    transaction_type,
                    slot,
                    sawp_group,
                    conversion_rate,
                    base_address_id,
                    status
                FROM RFDATA.TRANSACTIONS WHERE wallet_address_id = "${wallet_address_id}" AND address_id = "${address_id}"`, function (err, result) {
        if (err)
            throw err;
        const rows = <RowDataPacket[]>result;
        let records: TRANSACTION[] = rows.map((row: RowDataPacket) => {
            return map_row_vault(row);
        });
        callback(records);
    });
}


export async function getVault(wallet_address_id: string, callback: (r: Object[]) => void) {
    dbcon.query(`SELECT 
            address_id,
            sum(amount)
        FROM RFDATA.TRANSACTIONS WHERE wallet_address_id = "${wallet_address_id}" GROUP BY address_id`, function (err, result) {
        if (err)
            throw err;
        const rows = <RowDataPacket[]>result;
        let records: Object[] = rows.map((row: RowDataPacket) => {
            return {
                "address_id": row.address_id,
                "symbol": cacheList["_" + row.address_id],
                "amount": row.amount
            };
        });
        callback(records);
    });
}


export async function getTxStatus(wallet_address_id: string, signature: string, callback: (r: Object) => void) {

    const connection = new Connection(clusterApiUrl('devnet'));
    const user = new PublicKey(wallet_address_id);
    const signatures = await connection.getConfirmedSignaturesForAddress2(user);
    console.log(signatures);
    const tx = signatures.filter((ele) => { return ele.signature == signature })

    try {
        const txInfo = await connection.getTransaction(signature);

        const accounts = txInfo?.transaction.message.accountKeys;
        const err_status = txInfo?.meta?.err;

        const verified = accounts?.filter((ele) => { return "_" + ele.toString() in cacheList })

        if (verified)
            callback({
                "slot": tx[0].slot,
                "status": err_status,
                "signature": tx[0].signature
            });
        else
            callback({});
    } catch (error) {
        callback({ "status": `Failed to get transaction ${signature}` });
    }


}

export async function getTxsignatures(wallet_address_id: string, callback: (r: string[]) => void) {

    const connection = new Connection(clusterApiUrl('devnet'));
    const user = new PublicKey(wallet_address_id);
    const data = await connection.getConfirmedSignaturesForAddress2(user);

    const txs = data.filter(async (tx) => {
        const txInfo = await connection.getTransaction(tx.signature)
        let validTx = undefined;
        if (txInfo?.transaction?.message?.accountKeys)
            for (let acc of txInfo?.transaction?.message?.accountKeys) {
                validTx = cacheList["_" + acc.toString()];
                if (validTx)
                    break
            }
        return validTx != undefined
    });
    const signatures = txs.map((ele) => { return ele.signature });
    callback(signatures);
}


export async function addTransaction(wallet_address_id: string, data: { "tx_type": string, "signature": string }): Promise<Object> {

    const connection = new Connection(clusterApiUrl('devnet'));
    //const user = new PublicKey(wallet_address_id);
    //const data = await connection.getConfirmedSignaturesForAddress2(user);
    // console.log('USER DATA TX');
    // console.log(data);
    // const tx = data.filter((ele) => { ele.signature === signature })
    // console.log('filter USER DATA TX');
    // console.log(tx);

    const txInfo = await connection.getTransaction(data["signature"]);
    console.log('TX INFO');
    console.log(txInfo);

    const post_balance = txInfo?.meta?.postBalances;
    console.log('post_balance');
    console.log(post_balance);

    const pre_balance = txInfo?.meta?.preBalances;
    console.log('pre_balance');
    console.log(pre_balance);

    const tk_post_balance = txInfo?.meta?.postTokenBalances;
    console.log('tk_post_balance');
    console.log(tk_post_balance);

    const tk_pre_balance = txInfo?.meta?.preTokenBalances;
    console.log('tk_pre_balance');
    console.log(tk_pre_balance);

    const accounts = txInfo?.transaction.message.accountKeys;
    console.log('accounts');
    let v = 0;
    if (accounts)
        for (const iterator of accounts) {
            console.log(v, " : ", iterator.toString());
            v++;
        }
    const instractions = txInfo?.transaction.message.instructions;
    console.log("Instractions");
    if (instractions)
        for (const iterator of instractions) {
            console.log(iterator.toString());
        }
    console.log("----------------");
    let index = undefined;
    let rf_address_id = undefined;

    if (tk_pre_balance && accounts)
        for (const txs of tk_pre_balance) {
            rf_address_id = accounts[txs.accountIndex].toString();
            if (rf_address_id) {
                index = txs.accountIndex;
                rf_address_id = accounts[txs.accountIndex].toString();
                console.log('tk_pre_balance:rf_address_id');
                console.log(rf_address_id);
                console.log('tk_pre_balance:index');
                console.log(index);
            }
        }

    if (tk_post_balance && accounts)
        for (const txs of tk_post_balance) {
            rf_address_id = accounts[txs.accountIndex].toString();
            if (rf_address_id) {
                index = txs.accountIndex;
                rf_address_id = accounts[txs.accountIndex].toString();
                console.log('tk_post_balance:rf_address_id');
                console.log(rf_address_id);
                console.log('tk_post_balance:index');
                console.log(index);
            }
        }

    if (accounts)
        for (const { i, acc } of accounts.map((acc, i) => ({ i, acc }))) {
            rf_address_id = cacheList["_" + acc.toString()];
            if (rf_address_id) {
                index = i;
                rf_address_id = acc.toString();
                break;
            }
        }
    console.log('rf_address_id');
    console.log(rf_address_id);
    console.log('index');
    console.log(index);
    if (post_balance && pre_balance && index) {
        const amount = new BigNumber(post_balance[index]).minus(pre_balance[index]);
        const slot = txInfo?.slot;
        const status = txInfo?.meta?.err;
        console.log('amount');
        console.log(amount);
        console.log('slot');
        console.log(slot);
        console.log('status');
        console.log(status);
        // dbcon.query(
        //     `INSERT INTO RFDATA.TRANSACTIONS(
        //         transaction_id, 
        //         wallet_address_id,
        //         address_id,
        //         amount,
        //         transaction_type,
        //         slot,
        //         status) 
        //     VALUES (?,?,?,?,?,?,?)`,
        //     [
        //         data["signature"],
        //         wallet_address_id,
        //         rf_address_id,
        //         amount.toNumber(),
        //         data["tx_type"],
        //         slot,
        //         status]
        // );

    }

    return { "Status": "inprgress" }
}
