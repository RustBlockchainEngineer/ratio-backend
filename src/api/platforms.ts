
import { RowDataPacket } from 'mysql2'

import { dbcon } from "../models/db";
import { v4 as uuid } from 'uuid';
import { Platform } from '../models/model'

function map_row_platform(row: RowDataPacket): Platform {
    return {
        "id": row.id,
        "name": row.name,
        "created_on": row.created_on,
        "updated_on": row.updated_on
    }
}

export async function getAllPlatforms(callback: (r: Platform[]) => void) {
    let records: Platform[] = [];
    dbcon.query("SELECT id,name,updated_on,created_on FROM RFDATA.PLATFORMS", (err, result) => {
        if (err)
            throw err;

        const rows = <RowDataPacket[]>result;
        records = rows.map((row: RowDataPacket) => {
            return map_row_platform(row);
        });
        callback(records);
    });
}

export async function getPlatform(id: string, callback: (p: Platform) => void) {
    dbcon.query(`SELECT id,name FROM RFDATA.PLATFORMS WHERE id = ?`, [id], (err, result) => {
        const rows = <RowDataPacket>result;
        let record: Platform = map_row_platform(rows);
        callback(record);
    });
}

export async function addPlatform(data: Platform): Promise<Platform> {
    let ts = Date.now();
    let id = uuid();
    dbcon.query(
        `INSERT INTO RFDATA.PLATFORMS(id,name,created_on,updated_on) VALUES (?,?,FROM_UNIXTIME(? * 0.001),FROM_UNIXTIME(? * 0.001))`,
        [id, data["name"], ts, ts]
    );
    return { "id": id, "name": data["name"], "created_on": ts, "updated_on": ts };
}

export async function updatePlatform(id: string, data: Platform): Promise<Platform> {
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
