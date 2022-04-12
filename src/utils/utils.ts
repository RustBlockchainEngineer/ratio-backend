import { PARAM } from "../models/model";
import {Cluster, clusterApiUrl, Connection} from "@solana/web3.js";

export function isNotSafe(keyList: string[], obj: Object): boolean {

    for (let key of keyList) {
        if (!(key in obj))
            return true;
    }
    return false;
}

export const getConnection = async() => {
  return new Connection(
    clusterApiUrl(getClusterName()),
    'confirmed'
  );
  }
  
export const getClusterName = () => {
    const env = process.env.SOLANACLUSTER || "devnet"
    if(env == 'devnet' || env =='mainnet-beta'){
      return env;
    }else{
      return 'devnet'
    }
  }

export const mapClusterToNetworkName = (clusterName:string) => {
  switch(clusterName){
    case 'mainnet-beta': return 'mainnet';
    case 'devnet': return clusterName;
    default: return 'devnet';
  }
}