export enum TRANSACTION_TYPE {
    'deposit', // +  
    'payback',   // +
    'reward',  // +  2.5 %
    'swap', //  +-
    'withdraw',// -
    'borrow',  // -
    'stake'// -  
}

export enum RISK_RATING {
    'AAA',
    'AA',
    'A',
    'BBB',
    'BB',
    'B',
    'CCC',
    'CC',
    'C',
    'D'
}

<<<<<<< HEAD
export enum UserRole {
    'USER' = 'USER',
    'ADMIN' = 'ADMIN',
}

export interface Auth {
    name: string,
    publicAddress: string,
    challenge: string,
    signature: string,
    nonce: string
}

=======
export enum USERTYPE {
    'user',
    'User + Whitelist',
    'Admin',
}

>>>>>>> 8c620df (all the backend enpoints)
export interface Platform {
    id?: string,
    name: string,
    site?: string,
    icon?: string,
    created_on?: number,
    updated_on?: number
}

export interface LPair {
    address_id: string,
    symbol: string,
    page_url: string,
    pool_size: number,
    platform_id: string,
    platform_symbol: string,
    platform_name?: string,
    platform_site?: string,
    platform_icon?: string,
    collateralization_ratio: number,
    liquidation_ratio: number,
    risk_rating: RISK_RATING,
    created_on?: number,
    updated_on: number,
    icon: string,
    lpasset?: LPAsset[]
}

export interface Users {
    wallet_address_id: string,
    name: string,
<<<<<<< HEAD
    role: UserRole,
    nonce?: number,
    created_on?: number,
    updated_on?: number
=======
    role: USERTYPE,
    nonce: number,
    created_on: number,
    updated_on: number
>>>>>>> 8c620df (all the backend enpoints)
}

export interface Token {
    address_id: string,
    symbol: string,
    icon: string,
    created_on?: number,
    updated_on?: number
}

export interface TRANSACTION {
    transaction_id: string,
    wallet_address_id: string,
    address_id?: string,
    symbol?: string,
    amount: number,
    transaction_type: TRANSACTION_TYPE
    slot: number
    sawp_group: string,
    conversion_rate: number,
    base_address_id: string,
    status: string
}
export interface LPAsset {
    token_address_id: string,
    token_symbole: string,
    token_pool_size: number,
    token_icon: string
}
export interface Price {
    token_address_id: string,
    price: number,
    confidence: number,
    created_on: number
}
export interface LPairParam {
    lpair_address_id: string,
    max_deposit: number,
    max_borrow: number,
    created_on: number
}
export interface UserParam {
    wallet_address_id: string,
    max_deposit: number,
    max_borrow: number,
    created_on: number
}

export interface LPairAPR {
    lpair_address_id: string,
    apr: number,
    created_on?: number
}
export interface RatioConf {
    max_USD: number,
    max_USDr: number
}
export interface PARAM {
    param_type: string,
    param_value: number,
    created_on?: number
}

export const COLLATERALRATIO = ['cr_aaa_ratio', 'cr_aa_ratio', 'cr_a_ratio', 'cr_bbb_ratio', 'cr_bb_ratio', 'cr_b_ratio', 'cr_ccc_ratio', 'cr_cc_ratio', 'cr_c_ratio', 'cr_d_ratio'];
export const MAXRISKRATING = ['max_usdr_aaa', 'max_usdr_aa', 'max_usdr_a', 'max_usdr_bbb', 'max_usdr_bb', 'max_usdr_b', 'max_usdr_ccc', 'max_usdr_cc', 'max_usdr_c', 'max_usdr_d'];
export const GLABALPARAMS = ['global_max_usdr', 'user_max_usdr', 'global_max_deposit', 'price_interval'];
export const TRANSACTIONFEE = ['deposit_fee', 'withdraw_fee', 'borrow_fee', 'payback_fee', 'reward_fee', 'swap_fee', 'stake_fee', 'harvest_fee'];
