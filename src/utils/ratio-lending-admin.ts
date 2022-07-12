import { IDL } from './ratio-lending-idl';
import { Connection, Keypair, PublicKey, Transaction } from '@solana/web3.js';
import * as anchor from '@project-serum/anchor';
import { BN, Program } from '@project-serum/anchor';

import { sendTransaction } from './rf-web3';
import { getGlobalStatePDA, getOraclePDA } from './ratio-pda';
import { getConnection } from './utils';
import base58 from 'bs58';
import NodeWallet from "@project-serum/anchor/dist/cjs/nodewallet";
import { syncBuiltinESMExports } from 'module';

export const USDR_MINT_DECIMALS = 6;
export const RATIO_LENDING_PROGRAM_ID = new PublicKey('RFLeGTwFXiXXETdJkZuu9iKgXNkYbywLpTu1TioDsDQ');
const MAX_IX_COUNT = 11;

// This command makes an Lottery
function getProgramInstance(connection: Connection, wallet: any) {

  const provider = new anchor.Provider(connection, wallet, anchor.Provider.defaultOptions());
  // Read the generated IDL.

  // Address of the deployed program.
  const programId = RATIO_LENDING_PROGRAM_ID;

  // Generate the program client from IDL.
  const program = new Program(IDL, programId, provider);

  return program;
}
export async function getAllOracleMints(){
  if (!process.env.REPORTER_PK) {
    console.log('env not defined ...');
    return [];
  }
  const connection = getConnection();
  const reporter_pk = Keypair.fromSecretKey(base58.decode(process.env.REPORTER_PK))
  const wallet = new NodeWallet(reporter_pk)

  const program = getProgramInstance(connection, wallet);
  const oracles = await program.account.oracle.all();
  const onChainOracleKeys = oracles.map((item)=>item.account.mint.toString());
  return onChainOracleKeys;
}
export async function reportAllPriceOracle(
  prices: {[key: string]: number}
) {
  if (!process.env.REPORTER_PK) {
    console.log('Skip price reporting ...');
    return;
  }
  const connection = await getConnection();
  const reporter_pk = Keypair.fromSecretKey(base58.decode(process.env.REPORTER_PK))
  const wallet = new NodeWallet(reporter_pk)

  const program = getProgramInstance(connection, wallet);

  const globalStateKey = getGlobalStatePDA();

  let tx = null;
  let ix_count = 0;

  const oracles = await program.account.oracle.all();
  const onChainOracleKeys = oracles.map((item)=>item.account.mint.toString());

  for(let mint in prices) {
    if (onChainOracleKeys.indexOf(mint) > -1) {
      const oracleKey = getOraclePDA(mint);
      const ix = program.instruction.reportPriceToOracle(
        new BN(prices[mint] * 10 ** USDR_MINT_DECIMALS),
        {
          accounts: {
            authority: wallet.publicKey,
            globalState: globalStateKey,
            oracle: oracleKey,
            mint,
          },
        }
      );
      if(tx == null) {
        tx = new Transaction();
      }
      tx.add(ix);
  
      ix_count ++;
      if (ix_count === MAX_IX_COUNT) {
        const txHash = await sendTransaction(connection, wallet, tx);
        console.log('Reporting price  tx = ', txHash);
        
        tx = null;
        ix_count = 0;
        
        await sleep(5000);
      }
    }
  };
  if (tx) {
    const txHash = await sendTransaction(connection, wallet, tx);
    console.log('Reporting Price  tx = ', txHash);
  }
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}