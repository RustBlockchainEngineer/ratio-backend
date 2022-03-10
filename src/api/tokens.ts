import { RowDataPacket } from 'mysql2'
import { dbcon } from "../models/db";
import { Platform, Price, Token } from '../models/model'
import { cacheList } from '../api/cacheList'

function map_row_token(row: RowDataPacket): Token {
    return {
        "address_id": row.address_id,
        "symbol": row.symbol,
        "icon": row.icon
    }
}

export async function getAllTokens(callback: (r: Token[]) => void) {
    dbcon.query(`SELECT 
                    tkn.address_id,
                    tkn.symbol,
                    tkn.icon,
                    tp.token_address_id,
                    tp.platform_address_id,
                    plt.name platform_name,
                    plt.site platform_site,
                    plt.icon platform_icon
                FROM RFDATA.TOKENS tkn
                LEFT JOIN RFDATA.TOKENSPLATFORMS tp ON tkn.address_id = tp.token_address_id
                LEFT JOIN RFDATA.PLATFORMS plt ON tp.platform_address_id = plt.id`, function (err, result) {
        if (err)
            throw err;
        const rows = <RowDataPacket[]>result;
        let result_obj: { [key: string]: Token } = {};
        if (rows.length > 0) {
            for (let row of rows) {
                let record = result_obj[row.address_id];
                if (record == undefined)
                    record = map_row_token(row);

                let platforms: Platform[] | undefined = record.platforms;
                if (platforms == undefined)
                platforms = [];
                if (row.token_address_id)
                platforms.push({
                    "id": row.platform_address_id,
                    "name":row.platform_name,
                    "site":row.platform_site,
                    "icon":row.platform_icon
                    })
                record["platforms"] = platforms;
                result_obj[row.address_id] = record;
            }
        }
        callback(Object.values(result_obj));
    });
}

export async function getToken(address_id: string, callback: (r: Token | undefined) => void) {
    dbcon.query(`SELECT 
                    tkn.address_id,
                    tkn.symbol,
                    tkn.icon,
                    tp.token_address_id,
                    tp.platform_address_id,
                    plt.name platform_name,
                    plt.site platform_site,
                    plt.icon platform_icon
                FROM RFDATA.TOKENS tkn
                LEFT JOIN RFDATA.TOKENSPLATFORMS tp ON tkn.address_id = tp.token_address_id
                LEFT JOIN RFDATA.PLATFORMS plt ON tp.platform_address_id = plt.id
                WHERE tkn.address_id = "${address_id}"`, function (err, result) {
        if (err)
            throw err;
        const rows = <RowDataPacket[]>result;
        let record: Token | undefined = undefined;
        if (rows.length > 0) {
            record = map_row_token(rows[0]);
            let platforms: Platform[] = [];
            for (let row of rows) {
                if (row.token_address_id)
                platforms.push({
                    "id": row.platform_address_id,
                    "name":row.platform_name,
                    "site":row.platform_site,
                    "icon":row.platform_icon
                    })
            }
            record["platforms"] = platforms;
        }
        callback(record);
    });
}

export async function addToken(address_id: string,data: Token) {
    let ts = Date.now();
    cacheList["_" + address_id] = data["symbol"];

    const ret = dbcon.query(
        `DELETE FROM RFDATA.TOKENSPLATFORMS WHERE token_address_id = "${address_id}"`
    );
    const ret1 = dbcon.query(
        `DELETE FROM RFDATA.TOKENS WHERE address_id = "${address_id}"`
    );

    dbcon.query(
        `INSERT INTO RFDATA.TOKENS(address_id,symbol,icon,created_on,updated_on) VALUES (?,?,?,FROM_UNIXTIME(? * 0.001),FROM_UNIXTIME(? * 0.001))`,
        [address_id, data["symbol"], data["icon"], ts, ts]
    );
    if (data["platforms"])
        for (let row of data["platforms"]) {
            dbcon.query(
                `INSERT INTO RFDATA.TOKENSPLATFORMS(token_address_id,platform_address_id) VALUES (?,?)`,
                [address_id, row["id"], ]
            );
        }
    return data;
}

export async function addNewPriceToken(address_id: string, data: Price) {
    let ts = Date.now();
    dbcon.query(
        `INSERT INTO RFDATA.PRICES(token_address_id,price,confidence,created_on) VALUES (?,?,?,FROM_UNIXTIME(? * 0.001))`,
        [address_id, data["price"], data["confidence"], ts]
    );
    return data;
}

export async function getLatestTokenPrice(address_id: string, callback: (r: Price | undefined) => void) {

    dbcon.query(`SELECT price,confidence,created_on FROM RFDATA.PRICES WHERE address_id = "${address_id}" ORDER BY created_on desc LIMIT 1`, function (err, result) {
        if (err)
            throw err;
        const rows = <RowDataPacket[]>result;
        let record: Price | undefined;
        if (rows)
            record = {
                "token_address_id": address_id,
                "price": rows[0]["price"],
                "confidence": rows[0]["confidence"],
                "created_on": rows[0]["created_on"]
            }
        else
            record = undefined;
        callback(record);
    });

}

// export async function updateToken(address_id: string, data: Token) {
//     let now = Date.now();
//     cacheList["_" + address_id] = data["symbol"];
//     dbcon.query(
//         `UPDATE RFDATA.TOKENS SET symbol = ? , icon = ?,updated_on = FROM_UNIXTIME(? * 0.001) WHERE address_id = "${address_id}"`,
//         [data["symbol"], data["icon"], now, address_id]
//     );
//     return data;
// }

export async function deleteToken(address_id: string) {
    delete cacheList["_" + address_id];
    const ret = dbcon.query(
        `DELETE FROM RFDATA.TOKENSPLATFORMS WHERE token_address_id = "${address_id}"`
    );
    const ret1 = dbcon.query(
        `DELETE FROM RFDATA.TOKENS WHERE address_id = "${address_id}"`
    );
    return { "address_id": address_id }
}
