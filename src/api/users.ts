import { dbcon } from "./db";
import { v4 as uuid } from 'uuid';

export async function getAllUsers(callback) {
    let records = [];
    dbcon.query("SELECT * FROM RFDATA.USERS", function (err, result, fields) {
        if (err)
            throw err;
        records = result.map((row) => [row.id, row.address, row.name, row.role]);
        callback(records);
    });
}

export async function getUser(id: string, callback) {
    dbcon.query(`SELECT * FROM RFDATA.USERS WHERE id = ?`, [id], function (err, result, fields) {
        if (err)
            throw err;
        let records = result.map((row) => [row.id, row.address, row.name, row.role]);
        callback(records);
    });
}

export async function getUserNonce(publicKey: string, callback) {
    const user = await getUserByPublicKey(publicKey);
    callback(user.nonce);
}

export async function getUserByPublicKey(publicKey: string): Promise<any> {
    return new Promise((resolve, reject)=> {
            dbcon.query(`SELECT * FROM RFDATA.USERS WHERE LOWER(wallet_address_id) = LOWER(?)`, [publicKey], function (err, result, fields) {
            if (err){
                reject(err);
                return;
            }
            let records = result.map((row) => {
                return {
                    nonce:row.nonce, 
                    name:row.name, 
                    role:row.role, 
                    wallet_address_id:row.wallet_address_id
                };
            });
            resolve(records[0]);
        });
    });
}

export async function addUser(data) {
    let ts = Date.now();
    let id = uuid();
    const { address, name, role } = data;
    dbcon.query(
        `INSERT INTO RFDATA.USERS(wallet_address_id,address,name,created_on,updated_on) VALUES (?,?,?,?,FROM_UNIXTIME(? * 0.001),FROM_UNIXTIME(? * 0.001))`,
        [id, address, name, role, ts, ts]
    );
    return { "id": id }
}

export async function updateUserNonce(id: string) {
    let now = Date.now();
    const nonce = Math.floor(Math.random() * 1000000);
    dbcon.query(
        `UPDATE RFDATA.USERS SET nonce = ?,updated_on = FROM_UNIXTIME(? * 0.001) WHERE wallet_address_id = ?`,
        [nonce, now, id]
    );
}

export async function updateUser(id: string, data) {
    let now = Date.now();
    const { address, name, role } = data;
    dbcon.query(
        `UPDATE RFDATA.USERS SET address = ?,name = ? ,role = ?,updated_on = FROM_UNIXTIME(? * 0.001) WHERE wallet_address_id = ?`,
        [address, name, role, now, id]
    );
    return { id, address, name, "updated_on": now }
}

export async function deleteUser(id: string) {
    dbcon.query(
        `DELETE FROM RFDATA.USERS WHERE wallet_address_id = ?`, [id]
    );
    return { "id": id }
}
