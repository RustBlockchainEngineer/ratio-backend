import { RowDataPacket } from 'mysql2'
import { dbcon } from "../models/db";
import { LPairAPR } from '../models/model'


export async function getAllLPairAPRS(lpair_address_id: string, callback: (r: LPairAPR[]) => void) {

    dbcon.query("SELECT apr,created_on FROM RFDATA.LPAIRAPRS WHERE lpair_address_id = ? ORDER BY created_on", [lpair_address_id], function (err, result) {
        if (err)
            throw err;
        const rows = <RowDataPacket[]>result;
        let records: LPairAPR[] = rows.map((row: RowDataPacket) => {
            return { "lpair_address_id": lpair_address_id, "apr": row.apr, "created_on": row.created_on };
        });
        callback(records);
    });
}

export async function getlatestLPairAPRS(lpair_address_id: string, callback: (r: LPairAPR | undefined) => void) {

    dbcon.query("SELECT apr,created_on FROM RFDATA.LPAIRAPRS WHERE lpair_address_id = ? ORDER BY created_on desc LIMIT 1", [lpair_address_id], function (err, result) {
        if (err)
            throw err;
        const rows = <RowDataPacket[]>result;
        let record: LPairAPR | undefined;
        if (rows)
            record = {
                "lpair_address_id": lpair_address_id,
                "apr": rows[0]["apr"],
                "created_on": rows[0]["created_on"]
            }
        else
            record = undefined;
        callback(record);
    });
}

export async function addLPairAPR(lpair_address_id: string, data: LPairAPR): Promise<LPairAPR> {
    let ts = Date.now();

    dbcon.query(
        `INSERT INTO RFDATA.LPAIRAPRS(lpair_id,apr,created_on) VALUES (?,?,FROM_UNIXTIME(? * 0.001))`,
        [lpair_address_id, data["apr"], ts]
    );
    return {
        "lpair_address_id": lpair_address_id,
        "apr": data["apr"]
    };
}

export async function deleteAllLPairAPR(id: string) {
    dbcon.query(
        `DELETE FROM RFDATA.LPAIRAPRS WHERE lpair_id = ?`, [id]
    );
    return { "lpair_id": id }
}
