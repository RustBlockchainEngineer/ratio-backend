import { RowDataPacket } from 'mysql2'
import { dbcon } from "../models/db";
import { LPair, LPAsset } from '../models/model'
import { cacheList } from '../api/cacheList'

function map_row_lpair(row: RowDataPacket): LPair {
    return {
        "address_id": row.address_id,
        "symbol": row.symbole,
        "page_url": row.page_url,
        "pool_size": row.pool_size,
        "platform_id": row.platform_id,
        "collateralization_ratio": row.collateralization_ratio,
        "liquidation_ratio": row.liquidation_ratio,
        "risk_rating": row.risk_rating,
        "created_on": row.created_on,
        "updated_on": row.updated_on,
    }
}

export async function getAllLPairs(callback: (r: LPair[]) => void) {
    dbcon.query(`SELECT 
                    address_id, 
                    symbol,
                    page_url,
                    pool_size,
                    platform_id,
                    collateralization_ratio,
                    liquidation_ratio,
                    risk_rating,
                    created_on,
                    updated_on 
                FROM RFDATA.LPAIRS`, function (err, result) {
        if (err)
            throw err;
        const rows = <RowDataPacket[]>result;
        let records: LPair[] = rows.map((row: RowDataPacket) => {
            return map_row_lpair(row);
        });
        callback(records);
    });
}

export async function getLPair(address_id: string, callback: (r: LPair | undefined) => void) {
    dbcon.query(`SELECT
                    lp.address_id,                      
                    lp.symbol,
                    lp.page_url,
                    lp.pool_size,
                    lp.platform_id,
                    lp.collateralization_ratio,
                    lp.liquidation_ratio,
                    lp.risk_rating,
                    lp.created_on,
                    lp.updated_on,                    
                    tkn.symbol,
                    tkn.icon,
                    lpa.token_address_id,
                    lpa.pool_size token_pool_size
                FROM RFDATA.LPAIRS lp
                JOIN RFDATA.LPASSETS lpa ON lp.address_id = lpa.lpair_address_id
                JOIN RFDATA.TOKENS tkn ON lpa.token_address_id = tkn.address_id
                WHERE address_id = ?`, [address_id], function (err, result) {
        const rows = <RowDataPacket[]>result;
        let record: LPair | undefined = undefined;
        if (rows) {
            let record: LPair = map_row_lpair(rows[0]);
            let lpasset: LPAsset[] = [];
            for (let row of rows) {
                lpasset.push({
                    "token_address_id": row.token_address_id,
                    "token_symbole": row.symbol,
                    "token_pool_size": row.token_pool_size,
                    "token_icon": row.icon
                })
            }
            record["lpasset"] = lpasset;
        }
        callback(record);
    });
}

export async function saveLPair(address_id: string, data: LPair): Promise<boolean> {
    let ts = Date.now();
    cacheList[address_id] = data["symbol"];
    dbcon.query(
        `DELETE FROM RFDATA.LPAIRS WHERE address_id = ?`, [address_id]
    );
    dbcon.query(
        `DELETE FROM RFDATA.LPASSETS WHERE lpair_address_id = ?`, [address_id]
    );

    dbcon.query(
        `INSERT INTO RFDATA.LPAIRS(address_id, 
            symbol,
            page_url,
            pool_size,
            platform_id,
            collateralization_ratio,
            liquidation_ratio,
            risk_rating,
            created_on,
            updated_on) 
        VALUES (?,?,?,?,?,?,?,?,FROM_UNIXTIME(? * 0.001),FROM_UNIXTIME(? * 0.001))`,
        [data["address_id"],
        data["symbol"],
        data["page_url"],
        data["pool_size"],
        data["platform_id"],
        data["collateralization_ratio"],
        data["liquidation_ratio"],
        data["risk_rating"],
            ts, ts]
    );
    if (data["lpasset"])
        for (let row of data["lpasset"]) {
            dbcon.query(
                `INSERT INTO RFDATA.LPASSETS(lpair_address_id,token_address_id,pool_size) VALUES (?,?,?)`,
                [address_id, row["token_address_id"], row["token_pool_size"]]
            );
        }
    return true;
}


export async function deleteLPair(id: string) {
    delete cacheList[id];
    dbcon.query(
        `DELETE FROM RFDATA.LPAIRS WHERE address_id = ?`, [id]
    );
    dbcon.query(
        `DELETE FROM RFDATA.LPASSETS WHERE lpair_address_id = ?`, [id]
    );
    dbcon.query(
        `DELETE FROM RFDATA.LPAIRPARAMS WHERE lpair_address_id = ?`, [id]
    );
    dbcon.query(
        `DELETE FROM RFDATA.LPAIRAPRS WHERE lpair_address_id = ?`, [id]
    );
    return { "address_id": id }
}
