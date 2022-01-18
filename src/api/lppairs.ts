import { dbcon } from "./db";
import { v4 as uuid } from 'uuid';

export async function getAllLPpairs(id, callback) {
    let records = [];
    dbcon.query("SELECT * FROM RFDATA.LPPAIRS WHERE platform_id = ?", [id], function (err, result, fields) {
        if (err)
            throw err;
        records = result.map((row) => [row.id, row.symbol, row.page_url, row.pool_size, row.platform_id]);
        callback(records);
    });
}

export async function getLPpair(id: string, callback) {
    dbcon.query(`SELECT * FROM RFDATA.LPPAIRS WHERE id = ?`, [id], function (err, result, fields) {
        console.log(result);

        let records = result.map((row) => [row.id, row.symbol, row.page_url, row.pool_size, row.platform_id]);
        callback(records);
    });
}

export async function addLPpair(data) {
    let ts = Date.now();
    let id = uuid();
    dbcon.query(
        `INSERT INTO RFDATA.LPPAIRS(id,symbol,created_on,updated_on,page_url,pool_size,platform_id) VALUES (?,?,FROM_UNIXTIME(? * 0.001),FROM_UNIXTIME(? * 0.001),?,?,?)`,
        [id, data["name"], ts, ts, data["page_url"], data["pool_size"], data["platform_id"]]
    );
    return { "id": id, ...data };
}

export async function updateLPpair(id: string, data) {
    let now = Date.now();
    dbcon.query(
        `UPDATE RFDATA.LPPAIRS SET symbol = ? ,updated_on = FROM_UNIXTIME(? * 0.001),page_url = ?,pool_size = ? WHERE id = ?`,
        [data["name"], now, data["page_url"], data["pool_size"], id]
    );
    return { "id": id, ...data }
}

export async function deleteLPpair(id: string) {
    dbcon.query(
        `DELETE FROM RFDATA.LPPAIRS WHERE id = ?`, [id]
    );
    return { "id": id }
}
