import { RowDataPacket } from 'mysql2'
import { dbcon } from "../models/db";


export async function getParamValues(param_name: string, callback: (r: Object[]) => void) {
    dbcon.query(`SELECT param_value,created_on FROM RFDATA.RATIOCONFIG WHERE param_type = "${param_name}" ORDER BY created_on`, function (err, result) {
        if (err)
            throw err;
        const rows = <RowDataPacket[]>result;
        let records = rows.map((row: RowDataPacket) => {
            return { [param_name]: row.param_value, "created_on": row.created_on * 1000 };
        });
        callback(records);
    });
}

export async function getlatestParamValue(param_list: string[], callback: (r: Object[]) => void) {
    let pl = param_list.map(function (a) { return "'" + a.replace("'", "''") + "'"; }).join();
    const sql_str = `SELECT DISTINCT param_type,
    LAST_VALUE(param_value) OVER (PARTITION BY param_type ORDER BY created_on) AS param_value,
    LAST_VALUE(created_on) OVER (PARTITION BY param_type ORDER BY created_on) AS created_on
FROM RFDATA.RATIOCONFIG WHERE param_type IN (${pl})`;
    console.log(sql_str);
    dbcon.query(sql_str, function (err, result) {
        if (err)
            throw err;
        const rows = <RowDataPacket[]>result;
        let records = rows.map((row: RowDataPacket) => {
            return { [row.param_type]: row.param_value, "created_on": row.created_on * 1000 };
        });
        callback(records);
    });
}

export async function getParamValue(param_name: string, callback: (r: Object[]) => void) {

    dbcon.query(`SELECT param_type,param_value,created_on
                FROM RFDATA.RATIOCONFIG WHERE param_type = "${param_name}" order by created_on desc LIMIT 1`, function (err, result) {
        if (err)
            throw err;
        const rows = <RowDataPacket[]>result;
        let records = rows.map((row: RowDataPacket) => {
            return { [row.param_type]: row.param_value, "created_on": row.created_on * 1000 };
        });
        callback(records);
    });
}

export async function getlatestGrrLastDate(callback: (r: number) => void) {
    dbcon.query(`SELECT MAX(created_on) FROM RFDATA.RATIOCONFIG WHERE param_type LIKE 'GRR:%'`, function (err, result) {
        if (err)
            throw err;
        const rows = <RowDataPacket[]>result;
        if (rows) {
            let lastdate = rows[0].created_on;
            callback(rows[0].created_on)
        }
        else
            callback(0);
    });
}

export async function getlatestGrrParamValue(callback: (r: Object[]) => void) {

    await getlatestGrrLastDate(function (lastDate: number) {
        if (lastDate == 0)
            callback([]);
        dbcon.query(`SELECT param_type,param_value FROM RFDATA.RATIOCONFIG WHERE param_type LIKE 'GRR:%' AND created_on=?`, [lastDate], function (err, result) {
            if (err)
                throw err;
            const rows = <RowDataPacket[]>result;
            let records = rows.map((row: RowDataPacket) => {
                let param_type = row.param_type.replace('GRR:', '');
                return { [param_type]: row.param_value, "created_on": lastDate * 1000 };
            });
            callback(records);
        });
    })

}

export async function getGrrParamList(callback: (r: string[]) => void) {

    await getlatestGrrLastDate(function (lastDate: number) {
        if (lastDate == 0)
            callback([]);
        dbcon.query(`SELECT param_type FROM RFDATA.RATIOCONFIG WHERE param_type LIKE 'GRR:%' AND created_on=?`, [lastDate], function (err, result) {
            if (err)
                throw err;
            const rows = <RowDataPacket[]>result;
            let records = rows.map((row: RowDataPacket) => {
                let param_type = row.param_type.replace('GRR:', '');
                return param_type;
            });
            callback(records);
        });
    })
}

export async function addParamValue(param_name: string, data: { [key: string]: number }) {
    let ts = Date.now();
    dbcon.query(
        `INSERT INTO RFDATA.RATIOCONFIG(param_type,param_value,created_on) VALUES (?,?,FROM_UNIXTIME(? * 0.001))`,
        [param_name, data["param_value"], ts]
    );
    data["created_on"] = ts;
    return data;
}

export async function addParamsValue(data: { [key: string]: number }) {
    let ts = Date.now();
    for (let row of Object.keys(data)) {
        dbcon.query(
            `INSERT INTO RFDATA.RATIOCONFIG(param_type,param_value,created_on) VALUES (?,?,FROM_UNIXTIME(? * 0.001))`,
            [row, data[row], ts]
        );
    }
    data["created_on"] = ts;
    return data;
}

export async function addGrrParamValue(data: { [key: string]: number }) {
    let ts = Date.now();
    for (let grr of Object.keys(data)) {
        dbcon.query(
            `INSERT INTO RFDATA.RATIOCONFIG(param_type,param_value,created_on) VALUES (?,?,FROM_UNIXTIME(? * 0.001))`,
            ["GRR:" + grr, data[grr], ts]
        );
    }
    data["created_on"] = ts;
    return data;
}

export async function resetParams(param_list: string[]) {
    let pl = param_list.map(function (a) { return "'" + a.replace("'", "''") + "'"; }).join();
    dbcon.query(
        `DELETE FROM RFDATA.RATIOCONFIG WHERE param_type IN (${pl})`,
    );
    return true;
}
export async function resetGrrParams() {
    dbcon.query("DELETE FROM RFDATA.RATIOCONFIG WHERE param_type LIKE 'GRR:%'");
    return true;
}
