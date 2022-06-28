export enum TRANSACTION_TYPE {
  "deposit" = "Deposit", //
  "payback" = "Payback",
  "harvest" = "Harvest", //
  "swap" = "Swap",
  "withdraw" = "Withdraw", //
  "borrow" = "Borrow",
  "stake" = "Stake",
}

export enum RISK_RATING {
  "AAA",
  "AA",
  "A",
  "BBB",
  "BB",
  "B",
  "CCC",
  "CC",
  "C",
  "D",
}

export enum UserRole {
  "USER" = "USER",
  "ADMIN" = "ADMIN",
}

export enum MainToken {
  "USDC" = "USDC",
  "USDT" = "USDT",
  "USDH" = "USDH",
  "UXD" = "UXD",
  "UST" = "UST",
}

export enum WhitelistMode {
  ADMIN_ONLY = "ADMIN_ONLY",
  REGISTERED_USERS = "REGISTERED_USERS",
  REGISTERED_USERS_AND_NFT = "REGISTERED_USERS_AND_NFT",
  DISABLED = "DISABLED",
}

export enum TokenPriceSource {
  "COINGECKO" = "coingecko",
}

export const CoinGeckoTokenList: { [key: string]: string } = {
  USDC: "usd-coin",
  UXD: "uxd-stablecoin",
  USDH: "usdh",
  USDT: "tether",
};

export interface Auth {
  name: string;
  publicAddress: string;
  challenge: string;
  signature: string;
  nonce: string;
}

export interface Platform {
  id?: string;
  name: string;
  site?: string;
  icon?: string;
  created_on?: number;
  updated_on?: number;
}

export interface LPair {
  address_id: string;
  symbol: string;
  page_url: string;
  pool_size: number;
  platform_id: string;
  platform_symbol: string;
  platform_name?: string;
  platform_site?: string;
  platform_icon?: string;
  collateralization_ratio: number;
  liquidation_ratio: number;
  risk_rating: RISK_RATING;
  created_on?: number;
  updated_on: number;
  icon: string;
  vault_address_id: string;
  usdr_ceiling: number;
  lpasset?: LPAsset[];
  lprewardtokens?: string[];
  status?: string;
}

export interface Users {
  wallet_address_id: string;
  name: string;
  role: UserRole;
  nonce?: number;
  created_on?: number;
  updated_on?: number;
}

export interface Token {
  address_id: string;
  symbol: string;
  icon: string;
  created_on?: number;
  updated_on?: number;
  platforms?: Platform[];
  token_ids?: TokenIDS[];
}

export interface TokenIDS {
  source: TokenPriceSource;
  token_id: string;
}
export interface TRANSACTION {
  transaction_id: string;
  wallet_address_id: string;
  address_id: string;
  symbol?: string;
  amount: string;
  fair_price: string;
  market_price: string;
  transaction_type: TRANSACTION_TYPE;
  created_on: number;
  sawp_group: string;
  conversion_rate: number;
  base_address_id: string;
  status?: string;
  fee?: string;
}
export interface LPAsset {
  token_address_id: string;
  token_symbole: string;
  token_pool_size: number;
  token_icon: string;
}
export interface Price {
  token_address_id: string;
  price: number;
  confidence: number;
  created_on: number;
}
export interface LPairParam {
  lpair_address_id: string;
  max_deposit: number;
  max_borrow: number;
  created_on: number;
}
export interface UserParam {
  wallet_address_id: string;
  max_deposit: number;
  max_borrow: number;
  created_on: number;
}

export interface LPairAPR {
  lpair_address_id: string;
  apr: number;
  created_on?: number;
}
export interface RatioConf {
  max_USD: number;
  max_USDr: number;
}
export interface PARAM {
  param_type: string;
  param_value: number;
  created_on?: number;
}

export const pricesSources: TokenPriceSource[] = [TokenPriceSource.COINGECKO];
export const COLLATERALRATIO = [
  "cr_aaa_ratio",
  "cr_aa_ratio",
  "cr_a_ratio",
  "cr_bbb_ratio",
  "cr_bb_ratio",
  "cr_b_ratio",
  "cr_ccc_ratio",
  "cr_cc_ratio",
  "cr_c_ratio",
  "cr_d_ratio",
];
export const MAXRISKRATING = [
  "max_usdr_aaa",
  "max_usdr_aa",
  "max_usdr_a",
  "max_usdr_bbb",
  "max_usdr_bb",
  "max_usdr_b",
  "max_usdr_ccc",
  "max_usdr_cc",
  "max_usdr_c",
  "max_usdr_d",
];
export const GLABALPARAMS = [
  "global_max_usdr",
  "user_max_usdr",
  "global_max_deposit",
  "price_interval",
];
export const TRANSACTIONFEE = [
  "deposit_fee",
  "withdraw_fee",
  "borrow_fee",
  "payback_fee",
  "swap_fee",
  "stake_fee",
  "harvest_fee",
];
