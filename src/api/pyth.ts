import {
    clusterApiUrl,
    Connection,
    Cluster
} from "@solana/web3.js";


import {
    PythConnection,
    getPythProgramKeyForCluster
} from "@pythnetwork/client";

import { ENV as ChainID } from "@solana/spl-token-registry";


export type ENV =
    | "mainnet-beta"
    | "testnet"
    | "devnet"
    | "localnet";

export const ENDPOINTS = [
    {
        name: "mainnet-beta" as ENV,
        endpoint: "https://solana-api.projectserum.com/",
        chainID: ChainID.MainnetBeta,
    },
    {
        name: "testnet" as ENV,
        endpoint: clusterApiUrl("testnet"),
        chainID: ChainID.Testnet,
    },
    {
        name: "devnet" as ENV,
        endpoint: clusterApiUrl("devnet"),
        chainID: ChainID.Devnet,
    },
    {
        name: "localnet" as ENV,
        endpoint: "http://127.0.0.1:8899",
        chainID: ChainID.Devnet,
    },
];


const spot_prices = {};

export function buildPriceChangeSpot(cluster: Cluster) {

    const connection = new Connection(clusterApiUrl(cluster));
    const pythPublicKey = getPythProgramKeyForCluster(cluster);
    const pythConnection = new PythConnection(connection, pythPublicKey);

    console.log("building spot market object");
    pythConnection.onPriceChange((product, price) => {
        if (product.asset_type == "Crypto")
            spot_prices[product.base] = { "price": price.price, "confidence": price.confidence, "timestamp": Date.now() }
    })
    pythConnection.start()
}


export async function getSpotPriceChange() {
    return spot_prices;
}

export async function getSpotPriceChangeC(currency: String) {
    return spot_prices[currency.toUpperCase()] || { "price": 0.0, "confidence": 0.0, "timestamp": Date.now() };
}


