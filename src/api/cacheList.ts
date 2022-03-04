import { RowDataPacket } from 'mysql2';
import { dbcon } from "../models/db";


export const cacheList: { [key: string]: string } = {};


export async function cacheInit() {
    dbcon.query("SELECT address_id,symbol FROM RFDATA.TOKENS", function (err, result) {
        if (err)
            throw err;
        const rows = <RowDataPacket[]>result;
        rows.forEach((row: RowDataPacket) => {
            cacheList["_" + row.address_id] = row.symbol;
        });
    });
    dbcon.query("SELECT address_id, symbol FROM RFDATA.LPAIRS", function (err, result) {
        if (err)
            throw err;
        const rows = <RowDataPacket[]>result;
        rows.forEach((row: RowDataPacket) => {

            cacheList["_" + row.address_id] = row.symbol;
        });
    });
}