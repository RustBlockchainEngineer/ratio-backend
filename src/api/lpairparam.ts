import { RowDataPacket } from 'mysql2'
import { dbcon } from "../models/db";
import { LPairParam } from '../models/model'


export async function getAllLPairParam(lpair_address_id: string, callback: (r: LPairParam[]) => void) {

    dbcon.query("SELECT max_deposit,max_borrow,created_on FROM RFDATA.LPAIRPARAMS WHERE lpair_address_id = ? ORDER BY created_on", [lpair_address_id], function (err, result) {
        if (err)
            throw err;
        const rows = <RowDataPacket[]>result;
        let records: LPairParam[] = rows.map((row: RowDataPacket) => {
            return { "lpair_address_id": lpair_address_id, "max_deposit": row.max_deposit, "max_borrow": row.max_borrow, "created_on": row.created_on };
        });
        callback(records);
    });
}

export async function getlatestLPairParam(lpair_address_id: string, callback: (r: LPairParam | undefined) => void) {

    dbcon.query("SELECT max_deposit,max_borrow,created_on FROM RFDATA.LPAIRPARAMS WHERE lpair_address_id = ? ORDER BY created_on desc LIMIT 1", [lpair_address_id], function (err, result) {
        if (err)
            throw err;
        const rows = <RowDataPacket[]>result;
        let record: LPairParam | undefined;
        if (rows)
            record = {
                "lpair_address_id": lpair_address_id,
                "max_deposit": rows[0]["max_deposit"],
                "max_borrow": rows[0]["max_borrow"],
                "created_on": rows[0]["created_on"]
            }
        else
            record = undefined;
        callback(record);
    });
}

export async function addLPairParam(lpair_address_id: string, data: LPairParam): Promise<LPairParam> {
    let ts = Date.now();

    dbcon.query(
        `INSERT INTO RFDATA.LPAIRPARAMS(lpair_id,max_deposit,max_borrow,created_on) VALUES (?,?,?,FROM_UNIXTIME(? * 0.001))`,
        [lpair_address_id, data["max_deposit"], data["max_deposit"], ts]
    );
    return {
        "lpair_address_id": lpair_address_id,
        "max_deposit": data["max_deposit"],
        "max_borrow": data["max_borrow"],
        "created_on": ts
    };
}

export async function deleteAllLPairParam(lpair_address_id: string) {
    dbcon.query(
        `DELETE FROM RFDATA.LPAIRPARAMS WHERE lpair_address_id = ?`, [lpair_address_id]
    );
    return { "lpair_address_id": lpair_address_id }
}
