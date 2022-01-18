import { dbcon } from "./db";
import { v4 as uuid } from 'uuid';

export async function getAllPlatforms(callback) {
    let records = [];
    dbcon.query("SELECT * FROM RFDATA.PLATFORMS", function (err, result, fields) {
        if (err)
            throw err;
        records = result.map((row) => [row.id, row.name]);
        callback(records);
    });
}

export async function getPlatform(id: string, callback) {
    dbcon.query(`SELECT * FROM RFDATA.PLATFORMS WHERE id = ?`, [id], function (err, result, fields) {
        console.log(result);

        let records = result.map((row) => [row.id, row.name]);
        callback(records);
    });
}

export async function addPlatform(data) {
    let ts = Date.now();
    let id = uuid();
    dbcon.query(
        `INSERT INTO RFDATA.PLATFORMS(id,name,created_on,updated_on) VALUES (?,?,FROM_UNIXTIME(? * 0.001),FROM_UNIXTIME(? * 0.001))`,
        [id, data["name"], ts, ts]
    );
    return { "id": id };
}

export async function updatePlatform(id: string, data) {
    let now = Date.now();
    dbcon.query(
        `UPDATE RFDATA.PLATFORMS SET name = ? ,updated_on = FROM_UNIXTIME(? * 0.001) WHERE id = ?`,
        [data["name"], now, id]
    );
    return { "id": id, "name": data["name"], "updated_on": now }
}

export async function deletePlatform(id: string) {
    dbcon.query(
        `DELETE FROM RFDATA.PLATFORMS WHERE id = ?`, [id]
    );
    return { "id": id }
}
