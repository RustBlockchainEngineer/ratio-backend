import { RowDataPacket } from 'mysql2'
import { dbcon } from "../models/db";
import { Platform, Price, Token, TokenIDS, TokenPriceSource } from '../models/model'
import { cacheList } from '../api/cacheList'
import { saveCoinGeckoPrices } from './coingecko';

export function map_row_token(row: RowDataPacket): Token {
    return {
        "address_id": row.address_id,
        "symbol": row.symbol,
        "icon": row.icon
    }
}
export async function getAllTokensInSimple() {
    const query = `SELECT tkn.address_id,
                        tkn.symbol, 
                        tkn.icon, 
                        tknid.source,
                        tknid.token_id
                    FROM RFDATA.TOKENS tkn 
                    LEFT JOIN RFDATA.TOKENIDS tknid ON tknid.token = tkn.symbol`;
    const [rows, fields] = await dbcon.promise().query(query);
    let tokens:any = {};

    if ((rows as any).length > 0) {
        for (let row of (rows as any)){
            let record = tokens[row.address_id];
            if (record == undefined)
            record = map_row_token(row);

            if(row.token_id && row.source == TokenPriceSource.COINGECKO)
            record["token_id"] = row.token_id;
            tokens[row.address_id] = record;
        }
    }
    return tokens;
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
                    plt.icon platform_icon,
                    tknid.source,
                    tknid.token_id
                FROM RFDATA.TOKENS tkn
                LEFT JOIN RFDATA.TOKENSPLATFORMS tp ON tkn.address_id = tp.token_address_id
                LEFT JOIN RFDATA.PLATFORMS plt ON tp.platform_address_id = plt.id
                LEFT JOIN RFDATA.TOKENIDS tknid ON tknid.token = tkn.symbol`, function (err, result) {
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
                let tokenids: TokenIDS[] | undefined = record.token_ids;
                if (platforms == undefined)
                platforms = [];
                if (tokenids == undefined)
                tokenids = [];
                if(row.token_id)
                    tokenids.push({
                        "source":row.source,
                        "token_id":row.token_id
                    })
                if (row.token_address_id)
                    platforms.push({
                        "id": row.platform_address_id,
                        "name":row.platform_name,
                        "site":row.platform_site,
                        "icon":row.platform_icon
                        })
                record["token_ids"] = tokenids;
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
                    plt.icon platform_icon,
                    tknid.source,
                    tknid.token_id                    
                FROM RFDATA.TOKENS tkn
                LEFT JOIN RFDATA.TOKENSPLATFORMS tp ON tkn.address_id = tp.token_address_id
                LEFT JOIN RFDATA.PLATFORMS plt ON tp.platform_address_id = plt.id
                LEFT JOIN RFDATA.TOKENIDS tknid ON tknid.token = tkn.symbol
                WHERE tkn.address_id = "${address_id}"`, function (err, result) {
        if (err)
            throw err;
        const rows = <RowDataPacket[]>result;
        let record: Token | undefined = undefined;
        if (rows.length > 0) {
            record = map_row_token(rows[0]);
            let platforms: Platform[] = [];
            let tokenids: TokenIDS[] = [];
            for (let row of rows) {
                if(row.token_id)
                    tokenids.push({
                        "source":row.source,
                        "token_id":row.token_id
                    })
                if (row.token_address_id)
                    platforms.push({
                        "id": row.platform_address_id,
                        "name":row.platform_name,
                        "site":row.platform_site,
                        "icon":row.platform_icon
                        })
            }
            record["token_ids"] = tokenids;
            record["platforms"] = platforms;
        }
        callback(record);
    });
}

export async function addToken(address_id: string,data: Token) {
    let ts = Date.now();
    cacheList["_" + address_id] = data["symbol"];

    await dbcon.promise().query(
        `DELETE FROM RFDATA.TOKENIDS WHERE token = "${data["symbol"]}"`
    );

    await dbcon.promise().query(
        `DELETE FROM RFDATA.TOKENSPLATFORMS WHERE token_address_id = "${address_id}"`
    );
    await dbcon.promise().query(
        `DELETE FROM RFDATA.TOKENS WHERE address_id = "${address_id}"`
    );

    await dbcon.promise().query(
        `INSERT INTO RFDATA.TOKENS(address_id,symbol,icon,created_on,updated_on) VALUES (?,?,?,FROM_UNIXTIME(? * 0.001),FROM_UNIXTIME(? * 0.001))`,
        [address_id, data["symbol"], data["icon"], ts, ts]
    );
    if (data["token_ids"])
        for (let row of data["token_ids"]) {
            await dbcon.promise().query(
                `INSERT INTO RFDATA.TOKENIDS(token,source,token_id) VALUES (?,?,?)`,
                [data["symbol"], row["source"],row["token_id"] ]
            );
        }

    if (data["platforms"])
        for (let row of data["platforms"]) {
            await dbcon.promise().query(
                `INSERT INTO RFDATA.TOKENSPLATFORMS(token_address_id,platform_address_id) VALUES (?,?)`,
                [address_id, row["id"], ]
            );
        }
    await saveCoinGeckoPrices();
    return data;
}

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
