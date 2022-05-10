import { RowDataPacket } from 'mysql2'
import { dbcon } from "../models/db";
import { LPair, LPAsset, UserRole } from '../models/model'
import { cacheList } from '../api/cacheList'

function map_row_lpair(row: RowDataPacket): LPair {
    return {
        "address_id": row.lp_address_id,
        "symbol": row.lp_symbol,
        "page_url": row.lp_page_url,
        "pool_size": row.lp_pool_size,
        "platform_id": row.lp_platform_id,
        "platform_symbol": row.platform_symbol,
        "platform_name": row.lp_platform_name,
        "platform_site": row.lp_platform_site,
        "platform_icon": row.lp_platform_icon,
        "collateralization_ratio": row.lp_collateralization_ratio,
        "liquidation_ratio": row.lp_liquidation_ratio,
        "risk_rating": row.lp_risk_rating,
        "created_on": row.lp_created_on,
        "updated_on": row.lp_updated_on,
        "icon": row.icon,
        "vault_address_id": row.vault_address_id,
        "usdr_ceiling":row.usdr_ceiling,
        "status":row.status
    }
}

export async function getAllLPairs(role:UserRole,callback: (r: LPair[] | undefined) => void) {
    let where_str = "";
    if(role == UserRole.USER)
        where_str = ` WHERE lp.status="true"`;
    dbcon.query(`SELECT
                    lp.address_id lp_address_id,
                    lp.symbol lp_symbol,
                    lp.page_url lp_page_url,
                    lp.pool_size lp_pool_size,
                    lp.platform_id lp_platform_id,
                    lp.platform_symbol platform_symbol,
                    lp.icon icon,
                    lp.vault_address_id vault_address_id,
                    lp.usdr_ceiling,
                    lp.status,
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
                    lpa.pool_size token_pool_size,
                    lpr.reward_address_id
                FROM RFDATA.LPAIRS lp
                LEFT JOIN RFDATA.PLATFORMS plt ON plt.id = lp.platform_id
                LEFT JOIN RFDATA.LPASSETS lpa ON lp.address_id = lpa.lpair_address_id
                LEFT JOIN RFDATA.TOKENS tkn ON lpa.token_address_id = tkn.address_id
                LEFT JOIN RFDATA.LPAIRREWARD lpr ON lp.address_id = lpr.address_id${where_str}`
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

                    let lprewardtoken: string[] | undefined = record.lprewardtokens;
                    if (lprewardtoken == undefined)
                        lprewardtoken = [];
                    if (row.reward_address_id)
                        lprewardtoken.push(row.reward_address_id)
                    record["lprewardtokens"] = lprewardtoken;
                    result_obj[row.lp_address_id] = record;
                }
            }
            callback(Object.values(result_obj));
        });
}

export async function getLPair(role: UserRole,address_id: string, callback: (r: LPair | undefined) => void) {
    let where_str = "";
    if(role == UserRole.USER)
        where_str = ` AND lp.status="true"`;
    dbcon.query(`SELECT
                    lp.address_id lp_address_id,
                    lp.symbol lp_symbol,
                    lp.page_url lp_page_url,
                    lp.pool_size lp_pool_size,
                    lp.platform_id lp_platform_id,
                    lp.platform_symbol platform_symbol,
                    lp.icon icon,
                    lp.vault_address_id vault_address_id,
                    lp.usdr_ceiling,
                    lp.status,
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
                    lpa.pool_size token_pool_size,
                    lpr.reward_address_id
                FROM RFDATA.LPAIRS lp
                LEFT JOIN RFDATA.PLATFORMS plt ON plt.id = lp.platform_id
                LEFT JOIN RFDATA.LPASSETS lpa ON lp.address_id = lpa.lpair_address_id
                LEFT JOIN RFDATA.TOKENS tkn ON lpa.token_address_id = tkn.address_id
                LEFT JOIN RFDATA.LPAIRREWARD lpr ON lp.address_id = lpr.address_id
                WHERE lp.address_id = "${address_id}"${where_str}`, function (err, result) {
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

            let lprewardtoken: string[] = [];
            for (let row of rows) {
                if (row.reward_address_id)
                    lprewardtoken.push(row.reward_address_id)
            }
            record["lprewardtokens"] = lprewardtoken;
        }
        callback(record);
    });
}

export async function saveLPair(address_id: string, data: LPair): Promise<boolean> {
    let ts = Date.now();
    if(!("status" in data))
        data["status"] = 'true';
    
    cacheList["_" + address_id] = data["symbol"];
    const ret = dbcon.query(
        `DELETE FROM RFDATA.LPASSETS WHERE lpair_address_id = "${address_id}"`
    );
    const ret1 = dbcon.query(
        `DELETE FROM RFDATA.LPAIRS WHERE address_id = "${address_id}"`
    );
    const ret2 = dbcon.query(
        `DELETE FROM RFDATA.LPAIRREWARD WHERE address_id = "${address_id}"`
    );
    
    dbcon.query(
        `INSERT INTO RFDATA.LPAIRS(
            address_id, 
            symbol,
            page_url,
            pool_size,
            platform_id,
            platform_symbol,
            collateralization_ratio,
            liquidation_ratio,
            risk_rating,
            icon,
            vault_address_id,
            usdr_ceiling,
            status,
            created_on,
            updated_on) 
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,FROM_UNIXTIME(? * 0.001),FROM_UNIXTIME(? * 0.001))`,
        [data["address_id"],
        data["symbol"],
        data["page_url"],
        data["pool_size"],
        data["platform_id"],
        data["platform_symbol"],
        data["collateralization_ratio"],
        data["liquidation_ratio"],
        data["risk_rating"],
        data["icon"],
        data["vault_address_id"],
        data["usdr_ceiling"],
        data["status"],
            ts, ts]
    );
    if (data["lpasset"])
        for (let row of data["lpasset"]) {
            dbcon.query(
                `INSERT INTO RFDATA.LPASSETS(lpair_address_id,token_address_id,pool_size) VALUES (?,?,?)`,
                [address_id, row["token_address_id"], row["token_pool_size"]]
            );
        }
    if (data["lprewardtokens"])
        for (let reward_address_id of data["lprewardtokens"]) {
            dbcon.query(
                `INSERT INTO RFDATA.LPAIRREWARD(address_id,reward_address_id,created_on) VALUES (?,?,?)`,
                [address_id, reward_address_id,ts]
            );
        }

    return true;
}

export async function addLPairRewardToken(address_id: string,reward_address_id: string){
    let ts = Date.now();
    dbcon.query(
        `INSERT INTO RFDATA.LPAIRREWARD(address_id,reward_address_id,created_on) VALUES (?,?,?)`,
                [address_id, reward_address_id,ts]
    );
    return { 
        "address_id": address_id,
        "reward_address_id":reward_address_id,
        "created_on":ts 
    }
}

export async function deleteRewardToken(id: string,rewardtoken_address: string){
    dbcon.query(
        `DELETE FROM RFDATA.LPAIRREWARD WHERE address_id = "${id} AND reward_address_id= ${rewardtoken_address}"`
    );
    return { "address_id": id }
}

export async function deleteLPair(id: string) {
    delete cacheList["_" + id];
    dbcon.query(
        `DELETE FROM RFDATA.LPAIRPARAMS WHERE lpair_address_id = "${id}"`
    );
    dbcon.query(
        `DELETE FROM RFDATA.LPAIRAPRS WHERE lpair_address_id = "${id}"`
    );
    dbcon.query(
        `DELETE FROM RFDATA.LPASSETS WHERE lpair_address_id = "${id}"`
    );
    dbcon.query(
        `DELETE FROM RFDATA.LPAIRREWARD WHERE address_id = "${id}"`
    );
    dbcon.query(
        `DELETE FROM RFDATA.LPAIRS WHERE address_id = "${id}"`
    );
    return { "address_id": id }
}
