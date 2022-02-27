import { RowDataPacket } from 'mysql2'
import { dbcon } from "../models/db";
import { UserParam } from '../models/model'


export async function getAllUserParam(wallet_address_id: string, callback: (r: UserParam[]) => void) {

    dbcon.query(`SELECT max_deposit,max_borrow,created_on FROM RFDATA.USERPARAMS WHERE wallet_address_id = "${wallet_address_id}" ORDER BY created_on`, function (err, result) {
        if (err)
            throw err;
        const rows = <RowDataPacket[]>result;
        let records: UserParam[] = rows.map((row: RowDataPacket) => {
            return { "wallet_address_id": wallet_address_id, "max_deposit": row.max_deposit, "max_borrow": row.max_borrow, "created_on": row.created_on };
        });
        callback(records);
    });
}

export async function getlatestUserParam(wallet_address_id: string, callback: (r: UserParam | undefined) => void) {

    dbcon.query(`SELECT max_deposit,max_borrow,created_on FROM RFDATA.USERPARAMS WHERE wallet_address_id = "${wallet_address_id}" ORDER BY created_on desc LIMIT 1`, function (err, result) {
        if (err)
            throw err;
        const rows = <RowDataPacket[]>result;
        let record: UserParam | undefined;
        if (rows)
            record = {
                "wallet_address_id": wallet_address_id,
                "max_deposit": rows[0]["max_deposit"],
                "max_borrow": rows[0]["max_borrow"],
                "created_on": rows[0]["created_on"]
            }
        else
            record = undefined;
        callback(record);
    });
}

export async function addUserParam(wallet_address_id: string, data: UserParam): Promise<UserParam> {
    let ts = Date.now();

    dbcon.query(
        `INSERT INTO RFDATA.USERPARAMS(lpair_address_id,max_deposit,max_borrow,created_on) VALUES (?,?,?,FROM_UNIXTIME(? * 0.001))`,
        [wallet_address_id, data["max_deposit"], data["max_deposit"], ts]
    );
    return {
        "wallet_address_id": wallet_address_id,
        "max_deposit": data["max_deposit"],
        "max_borrow": data["max_borrow"],
        "created_on": ts
    };
}

export async function deleteAllUserParam(wallet_address_id: string) {
    dbcon.query(`DELETE FROM RFDATA.USERPARAMS WHERE wallet_address_id = ${wallet_address_id}`);
    return { "wallet_address_id": wallet_address_id }
}
