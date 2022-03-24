import { RowDataPacket } from 'mysql2';
import { dbcon } from "../models/db";
import { TRANSACTION,TRANSACTION_TYPE } from '../models/model';
import { cacheList } from '../api/cacheList';
import BigNumber from "bignumber.js";

import {
    PublicKey,
} from '@solana/web3.js';

import { getConnection } from '../utils/utils';

function map_row_vault(row: RowDataPacket): TRANSACTION {

    return {
        "transaction_id": row.transaction_id,
        "wallet_address_id": row.wallet_address_id,
        "address_id": row.address_id,
        "symbol": cacheList["_" + row.address_id],
        "amount": row.amount,
        "transaction_type": row.transaction_type,
        "created_on": row.created_on,
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
                    created_on,
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


// export async function getVault(wallet_address_id: string, callback: (r: Object[]) => void) {
//     dbcon.query(`SELECT 
//             address_id,
//             sum(amount)
//         FROM RFDATA.TRANSACTIONS WHERE wallet_address_id = "${wallet_address_id}" GROUP BY address_id`, function (err, result) {
//         if (err)
//             throw err;
//         const rows = <RowDataPacket[]>result;
//         let records: Object[] = rows.map((row: RowDataPacket) => {
//             return {
//                 "address_id": row.address_id,
//                 "symbol": cacheList["_" + row.address_id],
//                 "amount": row.amount
//             };
//         });
//         callback(records);
//     });
// }


export async function getTxStatus(wallet_address_id: string, signature: string, callback: (r: Object) => void) {

    const connection = await getConnection();
    const user = new PublicKey(wallet_address_id);
    const signatures = await connection.getConfirmedSignaturesForAddress2(user);
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

    const connection = await getConnection();
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


export async function addTransaction(wallet_address_id: string, data: { "tx_type": string, "signature": string,"address_id":string }): Promise<Boolean> {
    if (!('address_id' in data))
        return false

    const connection = await getConnection();
    const txInfo = await connection.getTransaction(data["signature"]);
    //console.log('txInfo:',txInfo);
    // console.log('tk_post_balance');
    // console.log(txInfo?.meta?.postTokenBalances);
    // console.log('tk_pre_balance');
    // console.log(txInfo?.meta?.preTokenBalances);

    const tk_post_balance = txInfo?.meta?.postTokenBalances;
    const tk_pre_balance = txInfo?.meta?.preTokenBalances;
    const address_id = data.address_id;
    let pretx = undefined;
    let posttx = undefined;
    let amount = new BigNumber("0");
    let post_amount = new BigNumber("0");
    let pre_amount = new BigNumber("0");

    if(data.tx_type == TRANSACTION_TYPE.deposit){
        
        if(tk_post_balance){
            const post = tk_post_balance.filter((ele) => {return ele.owner == wallet_address_id && ele.mint == address_id}); 
            if (post)
                posttx = post[0];
            if(posttx)
                if (posttx.uiTokenAmount.uiAmount)
                    post_amount = new BigNumber(posttx.uiTokenAmount.uiAmount);
        }

        if(tk_pre_balance){
            const pre = tk_pre_balance.filter((ele) => {return ele.owner == wallet_address_id && ele.mint == address_id});   
            if(pre)
                pretx = pre[0];
            if(pretx)
                if (pretx.uiTokenAmount.uiAmount)
                    pre_amount = new BigNumber(pretx.uiTokenAmount.uiAmount);
        }

    }
    else if (data.tx_type == TRANSACTION_TYPE.withdraw){

        if(tk_post_balance){
            const post = tk_post_balance.filter((ele) => {return ele.owner == wallet_address_id && ele.mint == address_id}); 
            if (post)
                posttx = post[0];
            if(posttx)
                if (posttx.uiTokenAmount.uiAmount)
                    post_amount = new BigNumber(posttx.uiTokenAmount.uiAmount);
        }
        if(tk_pre_balance){
            const pre = tk_pre_balance.filter((ele) => {return ele.owner == wallet_address_id && ele.mint == address_id});   
            if(pre)
                pretx = pre[0];
            if(pretx)
                if (pretx.uiTokenAmount.uiAmount)
                    pre_amount = new BigNumber(pretx.uiTokenAmount.uiAmount);
        }
    }
    else if (data.tx_type == TRANSACTION_TYPE.borrow){
        if(tk_post_balance){
            const post = tk_post_balance.filter((ele) => {return ele.owner == wallet_address_id && ele.mint == address_id}); 
            if (post)
                posttx = post[0];
            if(posttx)
                if (posttx.uiTokenAmount.uiAmount)
                    post_amount = new BigNumber(posttx.uiTokenAmount.uiAmount);
        }

        if(tk_pre_balance){
            const pre = tk_pre_balance.filter((ele) => {return ele.owner == wallet_address_id && ele.mint == address_id});   
            if(pre)
                pretx = pre[0];
            if(pretx)
                if (pretx.uiTokenAmount.uiAmount)
                    pre_amount = new BigNumber(pretx.uiTokenAmount.uiAmount);
        }
    }
    else if (data.tx_type == TRANSACTION_TYPE.payback){
        if(tk_post_balance){
            const post = tk_post_balance.filter((ele) => {return ele.owner == wallet_address_id && ele.mint == address_id}); 
            if (post)
                posttx = post[0];
            if(posttx)
                if (posttx.uiTokenAmount.uiAmount)
                    post_amount = new BigNumber(posttx.uiTokenAmount.uiAmount);
        }

        if(tk_pre_balance){
            const pre = tk_pre_balance.filter((ele) => {return ele.owner == wallet_address_id && ele.mint == address_id});   
            if(pre)
                pretx = pre[0];
            if(pretx)
                if (pretx.uiTokenAmount.uiAmount)
                    pre_amount = new BigNumber(pretx.uiTokenAmount.uiAmount);
        }
    }
    else if (data.tx_type == TRANSACTION_TYPE.reward){

        if(tk_post_balance){
            const post = tk_post_balance.filter((ele) => {return ele.owner == wallet_address_id && ele.mint == address_id}); 
            if (post)
                posttx = post[0];
            if(posttx)
                if (posttx.uiTokenAmount.uiAmount)
                    post_amount = new BigNumber(posttx.uiTokenAmount.uiAmount);
        }

        if(tk_pre_balance){
            const pre = tk_pre_balance.filter((ele) => {return ele.owner == wallet_address_id && ele.mint == address_id});   
            if(pre)
                pretx = pre[0];
            if(pretx)
                if (pretx.uiTokenAmount.uiAmount)
                    pre_amount = new BigNumber(pretx.uiTokenAmount.uiAmount);
        }
    }

    amount = pre_amount.minus(post_amount);
    if(posttx && pretx){
    let ts = Date.now();
    dbcon.query(
        `INSERT INTO RFDATA.TRANSACTIONS(
            transaction_id, 
            wallet_address_id,
            address_id,
            amount,         
            transaction_type,
            description,
            status,
            created_on) 
        VALUES (?,?,?,?,?,?,?,FROM_UNIXTIME(? * 0.001))`,
        [data.signature,
        wallet_address_id,
        posttx.mint,
        amount.toString(),
        data.tx_type,
        "",
        "",
        ts]
    );
    return true;
    }
    return false;
    }


