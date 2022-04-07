import { Connection, Keypair, PublicKey, SYSVAR_CLOCK_PUBKEY, Transaction, TransactionSignature, Commitment, SYSVAR_RENT_PUBKEY, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { userOracleReporterKeypair } from "./testUser-oracleReporter";
import { userSuperKeypair } from "./testUser-super";
import * as anchor from '@project-serum/anchor';
import idl from './ratio-lending-idl.json';
import { getConnection, getClusterName } from "../../utils/utils"
import { User } from "./user";
import BN from 'bn.js';
import {
  TOKEN_PROGRAM_ID
} from "@solana/spl-token";

const STABLE_POOL_IDL = idl;
const STABLE_POOL_PROGRAM_ID = new PublicKey('7dpY8SSjf7j1CvNs5DhYur8TZSizmZnYn1WRxjNuGWzD');

const ORACLE_SEED = 'ORACLE_SEED';
const GLOBAL_STATE_SEED = 'GLOBAL_STATE_SEED';

const commitment: Commitment = 'confirmed';


export function getProgramInstance(connection: Connection, wallet: any) {
  const provider = new anchor.Provider(connection, wallet, anchor.Provider.defaultOptions());
  // Read the generated IDL.
  const idl = STABLE_POOL_IDL as any;

  // Address of the deployed program.
  const programId = STABLE_POOL_PROGRAM_ID;

  // Generate the program client from IDL.
  const program = new (anchor as any).Program(idl, programId, provider);

  return program;
}

const getPda = (seeds: Buffer[], programId: PublicKey) => {
  return anchor.utils.publicKey.findProgramAddressSync(seeds, programId);
};

const getGlobalStatePDA = () => {
  const [pda] = getPda([Buffer.from(GLOBAL_STATE_SEED)], STABLE_POOL_PROGRAM_ID);
  return pda;
};

const getOraclePDA = (mint: string | PublicKey) => {
  const [pda] = getPda([Buffer.from(ORACLE_SEED), new PublicKey(mint).toBuffer()], STABLE_POOL_PROGRAM_ID);
  return pda;
};

async function covertToProgramWalletTransaction(
  connection: Connection,
  wallet: any,
  transaction: Transaction,
  signers: Array<Keypair> = []
) {
  transaction.recentBlockhash = (await connection.getRecentBlockhash(commitment)).blockhash;
  transaction.feePayer = wallet.publicKey;
  if (signers.length > 0) {
    transaction = await wallet.convertToProgramWalletTransaction(transaction);
    transaction.partialSign(...signers);
  }
  return transaction;
};

// transaction
async function signTransaction(
  connection: Connection,
  wallet: any,
  transaction: Transaction,
  signers: Array<Keypair> = []
) {
  transaction.recentBlockhash = (await connection.getRecentBlockhash()).blockhash;
  transaction.setSigners(wallet.publicKey, ...signers.map((s) => s.publicKey));
  if (signers.length > 0) {
    transaction.partialSign(...signers);
  }
  return await wallet.signTransaction(transaction);
};

async function sendTransaction(
  connection: Connection,
  wallet: any,
  transaction: Transaction,
  signers: Array<Keypair> = []
) {
  if (wallet.isProgramWallet) {
    console.log("Is program wallet");
    const programWalletTransaction = await covertToProgramWalletTransaction(connection, wallet, transaction, signers);
    return await wallet.signAndSendTransaction(programWalletTransaction);
  } else {
    const signedTransaction = await signTransaction(connection, wallet, transaction, signers);
    return await sendSignedTransaction(connection, signedTransaction);
  }
};

async function sendSignedTransaction(connection: Connection, signedTransaction: Transaction): Promise<string> {
  const rawTransaction = signedTransaction.serialize();

  const txid: TransactionSignature = await connection.sendRawTransaction(rawTransaction, {
    skipPreflight: true,
    preflightCommitment: commitment,
  });

  return txid;
};

async function reportPriceOracle(connection: Connection, wallet: any, mint: string | PublicKey, price: number) {
  try {
    const program = getProgramInstance(connection, wallet);
    const globalStateKey = getGlobalStatePDA();
    const oracle = getOraclePDA(mint);

    const transaction = new Transaction();
    const signers: Keypair[] = [];
    const ix = await program.instruction.reportPriceToOracle(
      // price of token
      new BN(price),
      {
        accounts: {
          authority: wallet.publicKey,
          globalState: globalStateKey,
          oracle: oracle,
          mint: mint,
          clock: SYSVAR_CLOCK_PUBKEY,
        },
      }
    );
    transaction.add(ix);
    const tx = await sendTransaction(connection, wallet, transaction, signers);
    console.log('tx id->', tx);
    const txResult = await connection.confirmTransaction(tx);
    if (txResult?.value?.err) {
      throw txResult.value.err;
    }
  } catch (error) {
    console.error('There was an error while reporting oracle price', error);
    throw error;
  }
}

async function createPriceOracle(connection: Connection, wallet: any, mint: string | PublicKey, price: number) {
  try {
    const program = getProgramInstance(connection, wallet);
    const globalStateKey = getGlobalStatePDA();
    const oracle = getOraclePDA(mint);

    const transaction = new Transaction();
    const signers: Keypair[] = [];
    const ix = await program.instruction.createOracle(
      // price of token
      new BN(price),
      {
        accounts: {
          authority: wallet.publicKey,
          globalState: globalStateKey,
          oracle: oracle,
          mint: mint,
          tokenProgram: TOKEN_PROGRAM_ID,
          clock: SYSVAR_CLOCK_PUBKEY,
          systemProgram: SystemProgram.programId,
          rent: SYSVAR_RENT_PUBKEY
        },
      }
    );
    transaction.add(ix);
    const tx = await sendTransaction(connection, wallet, transaction, signers);
    console.log('tx id->', tx);
    const txResult = await connection.confirmTransaction(tx);
    if (txResult?.value?.err) {
      throw txResult.value.err;
    }
  } catch (error) {
    console.error('There was an error while creating oracle', error);
    throw error;
  }
}

async function retrieveOracle(connection: Connection, wallet: any, mint: any) {
  const program = getProgramInstance(connection, wallet);
  const oracleKey = getOraclePDA(mint);
  const oracle = await program.account.oracle.fetchNullable(oracleKey);
  return { oracle, oracleKey };
}

// I am getting back a 6005 which i believe maps to NotAllowed, which maps to the userOracleReporterKeypair not being correct
// I believe this will all work correclty with the contract setup correctly
// the version of the contract that is currently being used is on devnet and has a different userOracleReporterKeypair set in the global state which is why the error is being raised
export async function setPriceOnOracle(mint:any, newPrice: any) {
  const connection = await getConnection();
  //this is the oracle report user
  const user = new User(userOracleReporterKeypair, connection);
  await user.init();
  //retrieve the oracle and output  
  const oracle = await retrieveOracle(user.provider.connection, user.wallet, mint);
  console.log(oracle);
  //report to oracle
  await reportPriceOracle(user.provider.connection, user.wallet, mint, newPrice);
  console.log("Reported price to oracle");
}

//I only created this function for the sake of testing
// this creates the oracle
export async function createOracle(mint:any, initPrice: number) {
  const connection = await getConnection();
  //this is the super user, i was attempting to create the oracle with this
  const userSuper = new User(userSuperKeypair, connection);
  await userSuper.init();
  //this is the address for usdc on devnet
  await createPriceOracle(userSuper.provider.connection, userSuper.wallet, mint, initPrice);
  console.log("Created oracle");
}

//this is just for testing that it works
//All that needs to get done once its confirmed that these work is the logic for when to call setPriceOnOracle in coingecko
export async function testSetPrice() {
  const usdcMint = new PublicKey("4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU");
  const newPrice = 100;
  setPriceOnOracle(usdcMint,newPrice);
}