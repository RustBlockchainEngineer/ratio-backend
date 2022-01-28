import { RowDataPacket } from 'mysql2'
import { dbcon } from "../models/db";
import { Users } from "../models/model"

export async function getAllUsers(callback: (r: Users[]) => void) {
    let records = [];
    dbcon.query("SELECT wallet_address_id,name,role FROM RFDATA.USERS", function (err, result, fields) {
        if (err)
            throw err;
        const rows = <RowDataPacket[]>result;
        let records: Users[] = rows.map((row: RowDataPacket) => {
            return {
                "wallet_address_id": row.wallet_address_id, "name": row.name, "role": row.role
            };
        });
        callback(records);
    });
}

export async function getUser(wallet_address_id: string, callback: (r: Users | undefined) => void) {
    dbcon.query(`SELECT wallet_address_id,name,role FROM RFDATA.USERS WHERE LOWER(wallet_address_id) = LOWER(?)`, [wallet_address_id], function (err, result, fields) {
        if (err)
            throw err;
        const rows = <RowDataPacket[]>result;
        let record: Users | undefined;
        if (rows.length > 0)
            record = {
                "wallet_address_id": rows[0].wallet_address_id, "name": rows[0].name, "role": rows[0].role
            };
        else
            record = undefined
        callback(record);
    });
}

export async function getUserNonce(publicKey: string, callback: (r: Object | undefined) => void) {
    const user: Users | undefined = await getUserByPublicKey(publicKey);
    if (user)
        callback({ "nonce": user.nonce });
    else
        callback({ "nonce": -1 });
}

export async function getUserByPublicKey(publicKey: string): Promise<Users | undefined> {
    return new Promise((resolve, reject) => {
        dbcon.query(`SELECT * FROM RFDATA.USERS WHERE LOWER(wallet_address_id) = LOWER(?)`, [publicKey], function (err, result, fields) {
            if (err) {
                reject(err);
                return;
            }
            const rows = <RowDataPacket[]>result;
            let record: Users | undefined;
            if (rows.length > 0)
                record = {
                    "wallet_address_id": rows[0].wallet_address_id, "name": rows[0].name, "role": rows[0].role
                };
            else
                record = undefined
            resolve(record);
        });
    });
}

export async function addUser(data: Users) {
    let ts = Date.now();
    const nonce = Math.floor(Math.random() * 1000000);
    dbcon.query(
        `INSERT INTO RFDATA.USERS(wallet_address_id,name,role,nonce,created_on,updated_on) VALUES (?,?,?,?,FROM_UNIXTIME(? * 0.001),FROM_UNIXTIME(? * 0.001))`,
        [data["wallet_address_id"], data["name"], data["role"], nonce, ts, ts]
    );
    data["created_on"] = ts;
    data["updated_on"] = ts;
    return data;
}

export async function updateUserNonce(wallet_address_id: string) {
    let now = Date.now();
    const nonce = Math.floor(Math.random() * 1000000);
    dbcon.query(
        `UPDATE RFDATA.USERS SET nonce = ?,updated_on = FROM_UNIXTIME(? * 0.001) WHERE LOWER(wallet_address_id) = LOWER(?)`,
        [nonce, now, wallet_address_id]);
}

export async function updateUser(wallet_address_id: string, data: Users) {
    let now = Date.now();
    dbcon.query(
        `UPDATE RFDATA.USERS SET wallet_address_id = ?,name = ? ,role = ?,updated_on = FROM_UNIXTIME(? * 0.001) WHERE LOWER(wallet_address_id) = LOWER(?)`,
        [data["wallet_address_id"], data["name"], data["role"], now, wallet_address_id]
    );
    data["updated_on"] = now;
    return data;
}

export async function deleteUser(wallet_address_id: string) {
    dbcon.query(
        `DELETE FROM RFDATA.USERS WHERE LOWER(wallet_address_id) = LOWER(?)`, [wallet_address_id]
    );
    return { "wallet_address_id": wallet_address_id }
}
