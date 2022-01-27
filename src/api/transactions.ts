import { RowDataPacket } from 'mysql2'
import { dbcon } from "../models/db";
import { v4 as uuid } from 'uuid';
import { TRANSACTION } from '../models/model'
import { cacheList } from '../api/cacheList'

function map_row_vault(row: RowDataPacket): TRANSACTION {

    return {
        "transaction_id": row.transaction_id,
        "wallet_address_id": row.wallet_address_id,
        "address_id": row.address_id,
        "symbol": cacheList[row.address_id],
        "amount": row.amount,
        "transaction_type": row.transaction_type,
        "transaction_dt": row.transaction_dt,
        "sawp_group": row.sawp_group,
        "conversion_rate": row.conversion_rate,
        "base_address_id": cacheList[row.base_address_id] || ""
    }
}
export async function getDetailTransactions(wallet_address_id: string, address_id: string, callback: (r: TRANSACTION[]) => void) {
    dbcon.query(`SELECT
                    transaction_id,
                    address_id,
                    amount,
                    transaction_type,
                    transaction_dt,
                    sawp_group,
                    conversion_rate,
                    base_address_id
                FROM RFDATA.TRANSACTIONS WHERE wallet_address_id = ? AND address_id = ?`, [wallet_address_id, address_id], function (err, result) {
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
        FROM RFDATA.TRANSACTIONS WHERE wallet_address_id = ? GROUP BY address_id`, [wallet_address_id], function (err, result) {
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

export async function addDeposit(wallet_address_id: string, data: TRANSACTION): Promise<TRANSACTION> {
    let ts = Date.now();
    data["wallet_address_id"] = wallet_address_id;
    data["transaction_dt"] = ts;
    if (data["amount"] < 0)
        data["amount"] *= -1; // amount should be positive
    dbcon.query(
        `INSERT INTO RFDATA.TRANSACTIONS(transaction_id, 
            wallet_address_id,
            address_id,
            amount,
            transaction_type,
            transaction_dt) 
        VALUES (?,?,?,?,?,FROM_UNIXTIME(? * 0.001))`,
        [data["transaction_id"],
        data["wallet_address_id"],
        data["address_id"],
        data["amount"],
            'deposit',
        data["transaction_dt"]]
    );
    return data;
}
export async function addWithdraw(wallet_address_id: string, data: TRANSACTION) {
    let ts = Date.now();
    data["wallet_address_id"] = wallet_address_id;
    data["transaction_dt"] = ts;
    if (data["amount"] > 0)
        data["amount"] *= -1; // amount should be negative
    dbcon.query(
        `INSERT INTO RFDATA.TRANSACTIONS(transaction_id, 
            wallet_address_id,
            address_id,
            amount,
            transaction_type,
            transaction_dt) 
        VALUES (?,?,?,?,?,FROM_UNIXTIME(? * 0.001))`,
        [data["transaction_id"],
        data["wallet_address_id"],
        data["address_id"],
        data["amount"],
            'withdraw',
        data["transaction_dt"]]
    );
    return data;
}


export async function addBorrow(wallet_address_id: string, data: TRANSACTION) {
    let ts = Date.now();
    data["wallet_address_id"] = wallet_address_id;
    data["transaction_dt"] = ts;
    if (data["amount"] > 0)
        data["amount"] *= -1; // amount should be negative
    dbcon.query(
        `INSERT INTO RFDATA.TRANSACTIONS(transaction_id, 
            wallet_address_id,
            address_id,
            amount,
            transaction_type,
            transaction_dt) 
        VALUES (?,?,?,?,?,FROM_UNIXTIME(? * 0.001))`,
        [data["transaction_id"],
        data["wallet_address_id"],
        data["address_id"],
        data["amount"],
            'borrow',
        data["transaction_dt"]]
    );
    return data;
}
export async function addPayback(wallet_address_id: string, data: TRANSACTION) {
    let ts = Date.now();
    data["wallet_address_id"] = wallet_address_id;
    data["transaction_dt"] = ts;
    if (data["amount"] < 0)
        data["amount"] *= -1; // amount should be positive
    dbcon.query(
        `INSERT INTO RFDATA.TRANSACTIONS(transaction_id, 
            wallet_address_id,
            address_id,
            amount,
            transaction_type,
            transaction_dt) 
        VALUES (?,?,?,?,?,FROM_UNIXTIME(? * 0.001))`,
        [data["transaction_id"],
        data["wallet_address_id"],
        data["address_id"],
        data["amount"],
            'payback',
        data["transaction_dt"]]
    );
    return data;

}

export async function addStake(wallet_address_id: string, data: TRANSACTION) {
    let ts = Date.now();
    data["wallet_address_id"] = wallet_address_id;
    data["transaction_dt"] = ts;
    if (data["amount"] > 0)
        data["amount"] *= -1; // amount should be negative
    dbcon.query(
        `INSERT INTO RFDATA.TRANSACTIONS(transaction_id, 
            wallet_address_id,
            address_id,
            amount,
            transaction_type,
            transaction_dt) 
        VALUES (?,?,?,?,?,FROM_UNIXTIME(? * 0.001))`,
        [data["transaction_id"],
        data["wallet_address_id"],
        data["address_id"],
        data["amount"],
            'stake',
        data["transaction_dt"]]
    );
    return data;
}

export async function addSwap(wallet_address_id: string, data: TRANSACTION[]) {
    const ts = Date.now();
    const guuid = uuid();
    let move = 0
    for (let trans of data) {
        trans["wallet_address_id"] = wallet_address_id;
        trans["transaction_dt"] = ts;
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
            transaction_dt) 
        VALUES (?,?,?,?,?,FROM_UNIXTIME(? * 0.001))`,
            [trans["transaction_id"],
            trans["wallet_address_id"],
            trans["address_id"],
            trans["amount"],
                'swap',
                guuid,
            trans["conversion_rate"],
            trans["transaction_dt"]]
        );
    }
    return data;
}

export async function addReward(wallet_address_id: string, data: TRANSACTION) {
    let ts = Date.now();
    data["wallet_address_id"] = wallet_address_id;
    data["transaction_dt"] = ts;
    if (data["amount"] < 0)
        data["amount"] *= -1; // amount should be positive
    dbcon.query(
        `INSERT INTO RFDATA.TRANSACTIONS(transaction_id, 
            wallet_address_id,
            address_id,
            amount,
            transaction_type,
            base_id,
            transaction_dt) 
        VALUES (?,?,?,?,?,FROM_UNIXTIME(? * 0.001))`,
        [data["transaction_id"],
        data["wallet_address_id"],
        data["address_id"],
        data["amount"],
            'reward',
        data["base_address_id"],
        data["transaction_dt"]]
    );
    return data;
}
