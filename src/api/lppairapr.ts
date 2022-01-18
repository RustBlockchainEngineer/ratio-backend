import { dbcon } from "./db";

export async function getAllLPpairAPRS(lppair_id, callback) {
    let records = [];
    dbcon.query("SELECT * FROM RFDATA.LPPAIR_APRS WHERE lppair_id = ? PRDER BY created_on", [lppair_id], function (err, result, fields) {
        if (err)
            throw err;
        records = result.map((row) => [row.lppair_id, row.arp]);
        callback(records);
    });
}

export async function addLPpairAPR(data) {
    let ts = Date.now();

    dbcon.query(
        `INSERT INTO RFDATA.LPPAIR_APRS(lppair_id,apr,created_on) VALUES (?,?,FROM_UNIXTIME(? * 0.001))`,
        [data["lppair_id"], data["apr"], ts]
    );
    return {
        "lppair_id": data["lppair_id"],
        "apr": data["apr"]
    };
}

export async function deleteAllLPpairAPR(id: string) {
    dbcon.query(
        `DELETE FROM RFDATA.LPPAIR_APRS WHERE lppair_id = ?`, [id]
    );
    return { "lppair_id": id }
}
