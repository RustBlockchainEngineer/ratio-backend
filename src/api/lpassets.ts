import { dbcon } from "./db";
import { v4 as uuid } from 'uuid';

export async function getAllLPassets(lppair_id, callback) {
    let records = [];
    dbcon.query("SELECT * FROM RFDATA.LPASSETS WHERE lppair_id = ?", [lppair_id], function (err, result, fields) {
        if (err)
            throw err;
        records = result.map((row) => [row.id, row.symbol, row.pool_size, lppair_id]);
        callback(records);
    });
}

export async function getLPasset(id: string, callback) {
    dbcon.query(`SELECT * FROM RFDATA.LPASSETS WHERE id = ?`, [id], function (err, result, fields) {
        console.log(result);

        let records = result.map((row) => [id, row.symbol, row.pool_size, row.lppair_id]);
        callback(records);
    });
}

export async function addLPasset(data) {
    let ts = Date.now();
    let id = uuid();
    dbcon.query(
        `INSERT INTO RFDATA.LPASSETS(id,symbol,created_on,updated_on,pool_size,lppair_id) VALUES (?,?,FROM_UNIXTIME(? * 0.001),FROM_UNIXTIME(? * 0.001),?,?)`,
        [id, data["symbol"], ts, ts, data["pool_size"], data["lppair_id"]]
    );
    return { "id": id, ...data };
}

export async function updateLPasset(id: string, data) {
    let now = Date.now();
    dbcon.query(
        `UPDATE RFDATA.LPASSETS SET symbol = ? ,updated_on = FROM_UNIXTIME(? * 0.001),pool_size = ? WHERE id = ?`,
        [data["symbol"], now, data["pool_size"], id]
    );
    return { "id": id, ...data }
}

export async function deleteLPasset(id: string) {
    dbcon.query(
        `DELETE FROM RFDATA.LPASSETS WHERE id = ?`, [id]
    );
    return { "id": id }
}
