import { clusterApiUrl, Connection } from "@solana/web3.js";

export const isNotSafe = (keyList: string[], obj: Object): boolean => {
  for (let key of keyList) {
    if (!(key in obj))
      return true;
  }
  return false;
}
export const findMissedFields = (keyList: string[], obj: Object): string[] => {
  const missingKeys = []
  for (let key of keyList) {
    if (!(key in obj)){
      missingKeys.push(key);
    }
  }
  return missingKeys;
}
export const getConnection = async () =>
  new Connection(
    // clusterApiUrl(getClusterName()),
    'https://stableswap.rpcpool.com/',
    'confirmed'
  );

export const getClusterName = () => {
  const env = requireEnv("SOLANACLUSTER", "devnet")
  if (env == 'devnet' || env == 'mainnet-beta') {
    return env;
  } else {
    return 'devnet'
  }
}

export const requireEnv = (name: string, defaultVal?: string): string => {
  const envValue = process.env[name];
  if (!envValue) {
    if (defaultVal !== undefined) return defaultVal;
    throw new Error(`Required env variable not set: ${name}`);
  }
  return envValue;
}

export const mapClusterToNetworkName = (clusterName:string) => {
  switch(clusterName){
    case 'mainnet-beta': return 'mainnet';
    case 'devnet': return clusterName;
    default: return 'devnet';
  }
}