import { dbcon } from "./db";
import { v4 as uuid } from 'uuid';

export async function getAllTokens(callback) {
    let records = [];
    dbcon.query("SELECT * FROM RFDATA.TOKENS", function (err, result, fields) {
        if (err)
            throw err;
        records = result.map((row) => [row.id, row.name]);
        callback(records);
    });
}

export async function getToken(id: string, callback) {
    dbcon.query(`SELECT * FROM RFDATA.TOKENS WHERE id = ?`, [id], function (err, result, fields) {
        console.log(result);

        let records = result.map((row) => [row.id, row.symbol, row.icon]);
        callback(records);
    });
}

export async function addToken(data) {
    let ts = Date.now();
    let id = uuid();
    dbcon.query(
        `INSERT INTO RFDATA.TOKENS(id,symbol,created_on,updated_on,icon) VALUES (?,?,FROM_UNIXTIME(? * 0.001),FROM_UNIXTIME(? * 0.001),icon)`,
        [id, data["symbol"], ts, ts, data["icon"]]
    );
    return { "id": id, ...data };
}

export async function updateToken(id: string, data) {
    let now = Date.now();
    dbcon.query(
        `UPDATE RFDATA.TOKENS SET symbol = ? , icon = ?,updated_on = FROM_UNIXTIME(? * 0.001) WHERE id = ?`,
        [data["symbol"], data["icon"], now, id]
    );
    return { "id": id, ...data }
}

export async function deleteToken(id: string) {
    dbcon.query(
        `DELETE FROM RFDATA.TOKENS WHERE id = ?`, [id]
    );
    return { "id": id }
}
