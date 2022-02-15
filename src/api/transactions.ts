import { RowDataPacket } from 'mysql2'
import { dbcon } from "../models/db";
import { v4 as uuid } from 'uuid';
import { TRANSACTION } from '../models/model'
import { cacheList } from '../api/cacheList'
import {
    Cluster,
    clusterApiUrl,
    Connection,
    Message,
    PublicKey,
    sendAndConfirmTransaction,
    SystemProgram,
    Transaction,

} from '@solana/web3.js';

//import BigNumber from 'bignumber.js';
//import { Console } from 'console';

function map_row_vault(row: RowDataPacket): TRANSACTION {

    return {
        "transaction_id": row.transaction_id,
        "wallet_address_id": row.wallet_address_id,
        "address_id": row.address_id,
        "symbol": cacheList[row.address_id],
        "amount": row.amount,
        "transaction_type": row.transaction_type,
        "slot": row.slot,
        "sawp_group": row.sawp_group,
        "conversion_rate": row.conversion_rate,
        "base_address_id": cacheList[row.base_address_id] || "",
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
                    base_address_id
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
                "symbol": cacheList[row.address_id],
                "amount": row.amount
            };
        });
        callback(records);
    });
}


export async function parseTx(wallet_address_id: string, signature: string, callback: (r: Object) => void) {

    const connection = new Connection(clusterApiUrl('devnet'));
    //const user = new PublicKey(wallet_address_id);
    //const data = await connection.getConfirmedSignaturesForAddress2(user);
    // console.log('USER DATA TX');
    // console.log(data);
    // const tx = data.filter((ele) => { ele.signature === signature })
    // console.log('filter USER DATA TX');
    // console.log(tx);

    const txInfo = await connection.getTransaction(signature);
    // console.log('TX INFO');
    // console.log(txInfo);

    const meta: Object | undefined | null = txInfo?.meta;
    let status: Object | undefined = undefined;
    if (meta)
        if ("status" in meta) {
            status = meta["status"]
        }

    let validTx = undefined;
    if (txInfo?.transaction?.message?.accountKeys)
        for (let acc of txInfo?.transaction?.message?.accountKeys)
            validTx = cacheList[acc.toString()];

    if (validTx)
        callback({
            "timestamp": txInfo?.slot,
            "status": status,
            "signature": signature
        });
    else
        callback({});

    // console.log('--------- MESSAGE HEADER -------');
    // console.log(txInfo?.transaction?.message?.header);
    // console.log('--------- MESSAGE ACCOUNT KEYS -----');

    //console.log(txInfo?.transaction?.message?.accountKeys);

    // console.log('--------- MESSAGE INSTRUCTIONS ------');
    // console.log(txInfo?.transaction?.message?.instructions);

    // const tData = await connection.getParsedTransaction(data[data?.length - 3]?.signature);
    // console.log('--------- TDATA ----------');
    // console.log(tData);

    // console.log('-------------------------- MAPPED DATA --------------------------');
    // const txMapsx = data.map(async (tx) => {
    //     console.log('------- TX DATA ------------');
    //     const data = await connection.getParsedTransaction(tx?.signature);
    //     console.log(data);
    // });

    //callback(data);
}

export async function parseTxsignatures(wallet_address_id: string, callback: (r: string[]) => void) {

    const connection = new Connection(clusterApiUrl('devnet'));
    const user = new PublicKey(wallet_address_id);
    const data = await connection.getConfirmedSignaturesForAddress2(user);

    const txs = data.filter(async (tx) => {
        const txInfo = await connection.getTransaction(tx.signature)
        let validTx = undefined;
        if (txInfo?.transaction?.message?.accountKeys)
            for (let acc of txInfo?.transaction?.message?.accountKeys)
                validTx = cacheList[acc.toString()];
        return validTx != undefined
    });
    const signatures = txs.map((ele) => { return ele.signature });
    callback(signatures);
}


export async function addDeposit(wallet_address_id: string, data: TRANSACTION): Promise<TRANSACTION> {
    data["wallet_address_id"] = wallet_address_id;
    if (data["amount"] < 0)
        data["amount"] *= -1; // amount should be positive
    dbcon.query(
        `INSERT INTO RFDATA.TRANSACTIONS(transaction_id, 
            wallet_address_id,
            address_id,
            amount,
            transaction_type,
            status,
            slot) 
        VALUES (?,?,?,?,?,FROM_UNIXTIME(? * 0.001))`,
        [data["transaction_id"],
        data["wallet_address_id"],
        data["address_id"],
        data["amount"],
            'deposit',
        data["status"],
        data["slot"]]
    );
    return data;
}
export async function addWithdraw(wallet_address_id: string, data: TRANSACTION) {
    data["wallet_address_id"] = wallet_address_id;
    if (data["amount"] > 0)
        data["amount"] *= -1; // amount should be negative
    dbcon.query(
        `INSERT INTO RFDATA.TRANSACTIONS(transaction_id, 
            wallet_address_id,
            address_id,
            amount,
            transaction_type,
            status,
            slot) 
        VALUES (?,?,?,?,?,FROM_UNIXTIME(? * 0.001))`,
        [data["transaction_id"],
        data["wallet_address_id"],
        data["address_id"],
        data["amount"],
            'withdraw',
        data["status"],
        data["slot"]]
    );
    return data;
}


export async function addBorrow(wallet_address_id: string, data: TRANSACTION) {
    data["wallet_address_id"] = wallet_address_id;
    if (data["amount"] > 0)
        data["amount"] *= -1; // amount should be negative
    dbcon.query(
        `INSERT INTO RFDATA.TRANSACTIONS(transaction_id, 
            wallet_address_id,
            address_id,
            amount,
            transaction_type,
            status,
            slot) 
        VALUES (?,?,?,?,?,FROM_UNIXTIME(? * 0.001))`,
        [data["transaction_id"],
        data["wallet_address_id"],
        data["address_id"],
        data["amount"],
            'borrow',
        data["status"],
        data["slot"]]
    );
    return data;
}
export async function addPayback(wallet_address_id: string, data: TRANSACTION) {
    data["wallet_address_id"] = wallet_address_id;
    if (data["amount"] < 0)
        data["amount"] *= -1; // amount should be positive
    dbcon.query(
        `INSERT INTO RFDATA.TRANSACTIONS(transaction_id, 
            wallet_address_id,
            address_id,
            amount,
            transaction_type,
            status,
            slot) 
        VALUES (?,?,?,?,?,FROM_UNIXTIME(? * 0.001))`,
        [data["transaction_id"],
        data["wallet_address_id"],
        data["address_id"],
        data["amount"],
            'payback',
        data["status"],
        data["slot"]]
    );
    return data;

}

export async function addStake(wallet_address_id: string, data: TRANSACTION) {
    data["wallet_address_id"] = wallet_address_id;
    if (data["amount"] > 0)
        data["amount"] *= -1; // amount should be negative
    dbcon.query(
        `INSERT INTO RFDATA.TRANSACTIONS(transaction_id, 
            wallet_address_id,
            address_id,
            amount,
            transaction_type,
            status,
            slot) 
        VALUES (?,?,?,?,?,FROM_UNIXTIME(? * 0.001))`,
        [data["transaction_id"],
        data["wallet_address_id"],
        data["address_id"],
        data["amount"],
            'stake',
        data["status"],
        data["slot"]]
    );
    return data;
}

export async function addSwap(wallet_address_id: string, data: TRANSACTION[]) {
    const guuid = uuid();
    let move = 0
    for (let trans of data) {
        trans["wallet_address_id"] = wallet_address_id;

        if (move == 0)
            if (trans["amount"] > 0)
                trans["amount"] *= -1; // amount should be negative
            else
                if (trans["amount"] < 0)
                    trans["amount"] *= -1; // amount should be positive
        move += 1;
        dbcon.query(
            `INSERT INTO RFDATA.TRANSACTIONS(transaction_id, 
            wallet_address_id,
            address_id,
            amount,
            transaction_type,
            sawp_group,
            conversion_rate,
            status,
            slot) 
        VALUES (?,?,?,?,?,FROM_UNIXTIME(? * 0.001))`,
            [trans["transaction_id"],
            trans["wallet_address_id"],
            trans["address_id"],
            trans["amount"],
                'swap',
                guuid,
            trans["conversion_rate"],
            trans["status"],
            trans["slot"]]
        );
    }
    return data;
}

export async function addReward(wallet_address_id: string, data: TRANSACTION) {
    data["wallet_address_id"] = wallet_address_id;
    if (data["amount"] < 0)
        data["amount"] *= -1; // amount should be positive
    dbcon.query(
        `INSERT INTO RFDATA.TRANSACTIONS(transaction_id, 
            wallet_address_id,
            address_id,
            amount,
            transaction_type,
            base_id,
            status,
            slot) 
        VALUES (?,?,?,?,?,FROM_UNIXTIME(? * 0.001))`,
        [data["transaction_id"],
        data["wallet_address_id"],
        data["address_id"],
        data["amount"],
            'reward',
        data["base_address_id"],
        data["status"],
        data["slot"]]
    );
    return data;
}
