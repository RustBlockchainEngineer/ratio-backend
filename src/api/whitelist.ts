import { dbcon } from "./db";
import { v4 as uuid } from 'uuid';

export async function getAllWhitelists(callback) {
    let records = [];
    dbcon.query("SELECT * FROM RFDATA.WHITELIST", function (err, result, fields) {
        if (err)
            throw err;
        records = result.map((row) => [row.id, row.address, row.name, row.role]);
        callback(records);
    });
}

export async function getWhitelist(id: string, callback) {
    dbcon.query(`SELECT * FROM RFDATA.WHITELIST WHERE id = ?`, [id], function (err, result, fields) {
        console.log(result);

        let records = result.map((row) => [row.id, row.address, row.name, row.role]);
        callback(records);
    });
}

export async function addWhitelist(data) {
    let ts = Date.now();
    let id = uuid();
    dbcon.query(
        `INSERT INTO RFDATA.WHITELIST(id,address,name,created_on,updated_on) VALUES (?,?,?,?,FROM_UNIXTIME(? * 0.001),FROM_UNIXTIME(? * 0.001))`,
        [id, data["address"], data["name"], data["role"], ts, ts]
    );
    return { "id": id }
}

export async function updateWhitelist(id: string, data) {
    let now = Date.now();
    dbcon.query(
        `UPDATE RFDATA.WHITELIST SET address = ?,name = ? ,role = ?,updated_on = FROM_UNIXTIME(? * 0.001) WHERE id = ?`,
        [data["address"], data["name"], data["role"], now, id]
    );
    return { "id": id, "address": data["address"], "name": data["name"], "updated_on": now }
}

export async function deleteWhitelist(id: string) {
    dbcon.query(
        `DELETE FROM RFDATA.WHITELIST WHERE id = ?`, [id]
    );
    return { "id": id }
}
