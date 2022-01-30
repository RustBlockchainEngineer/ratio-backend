import { RowDataPacket } from 'mysql2'
import { dbcon } from "../models/db";
import { LPair, LPAsset } from '../models/model'
import { cacheList } from '../api/cacheList'

function map_row_lpair(row: RowDataPacket): LPair {
    return {
        "address_id": row.lp_address_id,
        "symbol": row.lp_symbol,
        "page_url": row.lp_page_url,
        "pool_size": row.lp_pool_size,
        "platform_id": row.lp_platform_id,
        "platform_name": row.lp_platform_name,
        "platform_site": row.lp_platform_site,
        "platform_icon": row.lp_platform_icon,
        "collateralization_ratio": row.lp_collateralization_ratio,
        "liquidation_ratio": row.lp_liquidation_ratio,
        "risk_rating": row.lp_risk_rating,
        "created_on": row.lp_created_on,
        "updated_on": row.lp_updated_on,
    }
}

export async function getAllLPairs(callback: (r: LPair[] | undefined) => void) {
    dbcon.query(`SELECT
                    lp.address_id lp_address_id,
                    lp.symbol lp_symbol,
                    lp.page_url lp_page_url,
                    lp.pool_size lp_pool_size,
                    lp.platform_id lp_platform_id,
                    plt.name lp_platform_name,
                    plt.site lp_platform_site,
                    plt.icon lp_platform_icon,
                    lp.collateralization_ratio lp_collateralization_ratio,
                    lp.liquidation_ratio lp_liquidation_ratio,
                    lp.risk_rating lp_risk_rating,
                    lp.created_on lp_created_on,
                    lp.updated_on lp_updated_on,
                    tkn.symbol tkn_symbol,
                    tkn.icon tkn_icon,
                    lpa.token_address_id,
                    lpa.pool_size token_pool_size
                FROM RFDATA.LPAIRS lp
                JOIN RFDATA.PLATFORMS plt ON plt.id = lp.platform_id
                LEFT JOIN RFDATA.LPASSETS lpa ON lp.address_id = lpa.lpair_address_id
                JOIN RFDATA.TOKENS tkn ON lpa.token_address_id = tkn.address_id`
        , function (err, result) {
            if (err)
                throw err;
            const rows = <RowDataPacket[]>result;
            let result_obj: { [key: string]: LPair } = {};
            if (rows.length > 0) {
                for (let row of rows) {
                    let record = result_obj[row.lp_address_id];
                    if (record == undefined)
                        record = map_row_lpair(row);

                    let lpasset: LPAsset[] | undefined = record.lpasset;
                    if (lpasset == undefined)
                        lpasset = [];

                    if (row.token_address_id)
                        lpasset.push({
                            "token_address_id": row.token_address_id,
                            "token_symbole": row.tkn_symbol,
                            "token_pool_size": row.token_pool_size,
                            "token_icon": row.tkn_icon
                        })
                    record["lpasset"] = lpasset;
                    result_obj[row.lp_address_id] = record;
                }
            }
            callback(Object.values(result_obj));
        });
}

export async function getLPair(address_id: string, callback: (r: LPair | undefined) => void) {
    dbcon.query(`SELECT
                    lp.address_id lp_address_id,
                    lp.symbol lp_symbol,
                    lp.page_url lp_page_url,
                    lp.pool_size lp_pool_size,
                    lp.platform_id lp_platform_id,
                    plt.name lp_platform_name,
                    plt.site lp_platform_site,
                    plt.icon lp_platform_icon,
                    lp.collateralization_ratio lp_collateralization_ratio,
                    lp.liquidation_ratio lp_liquidation_ratio,
                    lp.risk_rating lp_risk_rating,
                    lp.created_on lp_created_on,
                    lp.updated_on lp_updated_on,
                    tkn.symbol tkn_symbol,
                    tkn.icon tkn_icon,
                    lpa.token_address_id,
                    lpa.pool_size token_pool_size
                FROM RFDATA.LPAIRS lp,
                JOIN RFDATA.PLATFORMS plt ON plt.id = lp.platform_id
                LEFT JOIN RFDATA.LPASSETS lpa ON lp.address_id = lpa.lpair_address_id
                JOIN RFDATA.TOKENS tkn ON lpa.token_address_id = tkn.address_id
                WHERE lp.address_id = "${address_id}"`, function (err, result) {
        const rows = <RowDataPacket[]>result;
        let record: LPair | undefined = undefined;
        if (rows.length > 0) {
            record = map_row_lpair(rows[0]);
            let lpasset: LPAsset[] = [];
            for (let row of rows) {
                if (row.token_address_id)
                    lpasset.push({
                        "token_address_id": row.token_address_id,
                        "token_symbole": row.tkn_symbol,
                        "token_pool_size": row.token_pool_size,
                        "token_icon": row.tkn_icon
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
        `DELETE FROM RFDATA.LPAIRS WHERE address_id = "${address_id}"`
    );
    dbcon.query(
        `DELETE FROM RFDATA.LPASSETS WHERE lpair_address_id = "${address_id}"`
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
        `DELETE FROM RFDATA.LPAIRS WHERE address_id = "${id}"`
    );
    dbcon.query(
        `DELETE FROM RFDATA.LPASSETS WHERE lpair_address_id = "${id}"`
    );
    dbcon.query(
        `DELETE FROM RFDATA.LPAIRPARAMS WHERE lpair_address_id = "${id}"`
    );
    dbcon.query(
        `DELETE FROM RFDATA.LPAIRAPRS WHERE lpair_address_id = "${id}"`
    );
    return { "address_id": id }
}
