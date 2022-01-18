import {
    clusterApiUrl,
    Connection,
    Cluster
} from "@solana/web3.js";


import {
    PythConnection,
    getPythProgramKeyForCluster
} from "@pythnetwork/client";


import { dbcon } from "./db";


const spot_prices = {};

function save_spot_todatabase() {

    Object.keys(spot_prices).forEach(key => {
        let value = spot_prices[key];
        dbcon.query(
            `INSERT INTO RFDATA.PRICES(product,price,cf,ts) VALUES (?,?,?,FROM_UNIXTIME(?) * 0.001)`,
            [key, value["price"], value["confidence"], value["timestamp"]]
        );
    });
}

function load_history_every(interval: number) {
    setInterval(save_spot_todatabase, interval * 60 * 1000);
}

export function buildPriceChangeSpot(cluster: Cluster) {

    const connection = new Connection(clusterApiUrl(cluster));
    const pythPublicKey = getPythProgramKeyForCluster(cluster);
    const pythConnection = new PythConnection(connection, pythPublicKey);

    console.log("building spot market object");
    pythConnection.onPriceChange((product, price) => {
        if (product.asset_type == "Crypto") {
            spot_prices[product.base] = { "price": price.price, "confidence": price.confidence, "timestamp": Date.now() }
        }
    })
    pythConnection.start()
    load_history_every(60); // set the interval to 60 minutes to save the history
}


export async function getSpotPriceChange() {
    return spot_prices;
}

export async function getSpotPriceChangeC(currency: String) {
    return spot_prices[currency.toUpperCase()] || { "price": 0.0, "confidence": 0.0, "timestamp": Date.now() };
}


