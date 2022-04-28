// anchor/solana imports
import { Program, web3, BN, Provider } from "@project-serum/anchor";
import {
  Connection,
  Keypair,
  PublicKey,
  SYSVAR_CLOCK_PUBKEY,
} from "@solana/web3.js";
// local
import { StablePool, IDL } from "./ratio-lending";
// interfaces
import { bs58 } from "@project-serum/anchor/dist/cjs/utils/bytes";
import NodeWallet from "@project-serum/anchor/dist/cjs/nodewallet";
import { dbcon } from "../models/db";
import { TokenPrice } from "../models/model";
import { RowDataPacket } from "mysql2";
import { RPC_ENDPOINT } from "../utils/config";

export const GLOBAL_STATE_SEED = "GLOBAL_STATE_SEED";
export const ORACLE_SEED = "ORACLE_SEED";
export const POOL_SEED = "POOL_SEED";
// init
let programStablePool: Program<StablePool> = null as any;

const REPORTER_PRIVATE_KEY = process.env.REPORTER_PRIVATE_KEY
  ? process.env.REPORTER_PRIVATE_KEY
  : "3mevMjzLfdFwtoMjzNoKtwwjhAbHKSb1GRdi7D1wSHV26dtxJKK6sK4UXnatcbVU2ycMBYpLVCdf39DVdVJ5aKzP";
const PID = "5msayy724PWnL9ZJLH3ygC3TvCvucs8aGLcgdiSLkRcZ";

const initProgram = () => {
  const SOLANA_CONNECTION = new Connection(RPC_ENDPOINT, {
    disableRetryOnRateLimit: true,
  });
  const reporter = Keypair.fromSecretKey(bs58.decode(REPORTER_PRIVATE_KEY));
  const reporterWallet = new NodeWallet(reporter);

  try {
    const provider = new Provider(
      SOLANA_CONNECTION,
      reporterWallet,
      Provider.defaultOptions()
    );

    // Generate the program client from IDL.
    programStablePool = new Program(
      IDL,
      new PublicKey(PID),
      provider
    ) as Program<StablePool>;
  } catch (e: any) {
    console.log(e);
  } finally {
    return programStablePool;
  }
};
initProgram();


function map_row_token_price(row: RowDataPacket): TokenPrice {
    return {
        "token": row.token,
        "price": row.price,
        "created_on": row.created_on
    }
}
export async function getTokenPrice(tokenMint: string) {
    dbcon.query(`SELECT
                    token,
                    price,
                    created_on
                FROM RFDATA.TOKENPRICES 
                WHERE token = '"${tokenMint}"'`, function (err, result) {
        const rows = <RowDataPacket[]>result;
        let record: TokenPrice | undefined = undefined;
        if (rows.length > 0) {
            record = map_row_token_price(rows[0]);
            return record.price
        }
        return -1;
    });
    return -1;
}

export const reportPriceToOracle = async (
  mint: PublicKey,
) => {
  // const all = await programStablePool.account.oracle.all()
  //       console.log("len=", all.length)
  //       for(let i=0;i<all.length;i++){
  //         console.log(all[i].account.mint.toBase58())
  //       }
   const newPrice = await getTokenPrice(mint.toBase58())
  const globalStateKey = await pda(
    [Buffer.from(GLOBAL_STATE_SEED)],
    programStablePool.programId
  );
  const oracleKey = await pda(
    [Buffer.from(ORACLE_SEED), mint.toBuffer()],
    programStablePool.programId
  );
  return await programStablePool.rpc.reportPriceToOracle(
    // price of token
    new BN(newPrice),
    {
      accounts: {
        authority: programStablePool.provider.wallet.publicKey,
        globalState: globalStateKey,
        oracle: oracleKey,
        mint: mint,
        clock: SYSVAR_CLOCK_PUBKEY,
      },
    }
  );
};

export const reportPriceToOracleByLp = async (
    mint: PublicKey,
  ) => {
      try{
        // const all = await programStablePool.account.pool.all()
        // console.log("len=", all.length)
        // for(let i=0;i<all.length;i++){
        //   console.log(all[i].publicKey.toBase58())
        // }
        const poolKey = await pda(
            [Buffer.from(POOL_SEED), mint.toBuffer()],
            programStablePool.programId
          );
          const poolData = await programStablePool.account.pool.fetch(poolKey)
          const mintA = poolData.swapMintA
          const mintB = poolData.swapMintB
          await reportPriceToOracle(mintA)
          await reportPriceToOracle(mintB)
      }
      catch(e){
        return false;
      }
      return true;
  };
export async function pda(
  seeds: (Buffer | Uint8Array)[],
  programId: web3.PublicKey
) {
  const [pdaKey] = await web3.PublicKey.findProgramAddress(seeds, programId);
  return pdaKey;
}
