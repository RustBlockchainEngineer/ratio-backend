import { RowDataPacket } from 'mysql2'
import { dbcon } from "../models/db";
import { Price, Token } from '../models/model'
import { cacheList } from '../api/cacheList'


export async function getAllTokens(callback: (r: Token[]) => void) {
    dbcon.query("SELECT address_id,symbol,icon FROM RFDATA.TOKENS", function (err, result) {
        if (err)
            throw err;
        const rows = <RowDataPacket[]>result;
        let records: Token[] = rows.map((row: RowDataPacket) => {
            return {
                "address_id": row.address_id, "symbol": row.symbol, "icon": row.icon
            };
        });
        callback(records);
    });
}

export async function getToken(address_id: string, callback: (r: Token | undefined) => void) {
    dbcon.query(`SELECT address_id,symbol,icon FROM RFDATA.TOKENS WHERE address_id = ?`, [address_id], function (err, result) {
        if (err)
            throw err;
        const rows = <RowDataPacket[]>result;
        let record: Token = {
            "address_id": address_id,
            "symbol": rows[0].symbol,
            "icon": rows[0].icon
        }
        callback(record);
    });
}

export async function addToken(data: Token) {
    let ts = Date.now();
    cacheList[data["address_id"]] = data["symbol"];
    dbcon.query(
        `INSERT INTO RFDATA.TOKENS(address_id,symbol,icon,created_on,updated_on) VALUES (?,?,?,FROM_UNIXTIME(? * 0.001),FROM_UNIXTIME(? * 0.001))`,
        [data["address_id"], data["symbol"], data["icon"], ts, ts]
    );
    return data;
}

export async function addNewPriceToken(address_id: string, data: Price) {
    let ts = Date.now();
    dbcon.query(
        `INSERT INTO RFDATA.PRICES(token_address_id,price,confidence,created_on) VALUES (?,?,?,FROM_UNIXTIME(? * 0.001))`,
        [address_id, data["price"], data["confidence"], ts]
    );
    return data;
}

export async function getLatestTokenPrice(address_id: string, callback: (r: Price | undefined) => void) {

    dbcon.query("SELECT price,confidence,created_on FROM RFDATA.PRICES WHERE address_id = ? ORDER BY created_on desc LIMIT 1", [address_id], function (err, result) {
        if (err)
            throw err;
        const rows = <RowDataPacket[]>result;
        let record: Price | undefined;
        if (rows)
            record = {
                "token_address_id": address_id,
                "price": rows[0]["price"],
                "confidence": rows[0]["confidence"],
                "created_on": rows[0]["created_on"]
            }
        else
            record = undefined;
        callback(record);
    });

}

export async function updateToken(address_id: string, data: Token) {
    let now = Date.now();
    cacheList[address_id] = data["symbol"];
    dbcon.query(
        `UPDATE RFDATA.TOKENS SET symbol = ? , icon = ?,updated_on = FROM_UNIXTIME(? * 0.001) WHERE address_id = ?`,
        [data["symbol"], data["icon"], now, address_id]
    );
    return data;
}

export async function deleteToken(address_id: string) {
    delete cacheList[address_id];
    dbcon.query(
        `DELETE FROM RFDATA.TOKENS WHERE address_id = ?`, [address_id]
    );
    return { "address_id": address_id }
}
