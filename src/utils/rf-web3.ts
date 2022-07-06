import { Keypair, Commitment, Connection, PublicKey, Transaction, TransactionSignature } from '@solana/web3.js';

const commitment: Commitment = 'confirmed';

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
}

// transaction
export async function signAllTransaction(
  connection: Connection,
  wallet: any,
  transactions: Transaction[],
  signers: Array<Keypair> = []
): Promise<Transaction[]> {
  for (const transaction of transactions) {
    transaction.recentBlockhash = (await connection.getRecentBlockhash()).blockhash;
    transaction.setSigners(wallet.publicKey, ...signers.map((s) => s.publicKey));
    if (signers.length > 0) {
      transaction.partialSign(...signers);
    }
  }
  return await wallet.signAllTransactions(transactions);
}

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
}

export async function sendTransaction(
  connection: Connection,
  wallet: any,
  transaction: Transaction,
  signers: Array<Keypair> = []
) {
  if (wallet.isProgramWallet) {
    const programWalletTransaction = await covertToProgramWalletTransaction(connection, wallet, transaction, signers);
    return await wallet.signAndSendTransaction(programWalletTransaction);
  } else {
    const signedTransaction = await signTransaction(connection, wallet, transaction, signers);
    return await sendSignedTransaction(connection, signedTransaction);
  }
}

export async function sendAllTransaction(
  connection: Connection,
  wallet: any,
  transactions: Transaction[],
  signers: Array<Keypair> = []
) {
  const signedTransactions = await signAllTransaction(connection, wallet, transactions, signers);
  const txIds = [];
  for (const signedTransaction of signedTransactions) {
    txIds.push(await sendSignedTransaction(connection, signedTransaction));
  }
  return txIds;
}

export async function sendSignedTransaction(connection: Connection, signedTransaction: Transaction): Promise<string> {
  const rawTransaction = signedTransaction.serialize();

  const txid: TransactionSignature = await connection.sendRawTransaction(rawTransaction, {
    skipPreflight: true,
    preflightCommitment: commitment,
  });

  return txid;
}

// function mergeTransactions(transactions: (Transaction | undefined)[]) {
//   const transaction = new Transaction();
//   transactions
//     .filter((t): t is Transaction => t !== undefined)
//     .forEach((t) => {
//       transaction.add(t);
//     });
//   return transaction;
// }

async function getFilteredTokenAccountsByOwner(
  connection: Connection,
  programId: PublicKey,
  mint: PublicKey
): Promise<{ context: any; value: [] }> {
  const resp = await (connection as any)._rpcRequest('getTokenAccountsByOwner', [
    programId.toBase58(),
    {
      mint: mint.toBase58(),
    },
    {
      encoding: 'jsonParsed',
    },
  ]);
  if (resp.error) {
    throw new Error(resp.error.message);
  }
  return resp.result;
}

export async function getOneFilteredTokenAccountsByOwner(
  connection: Connection,
  owner: PublicKey,
  mint: PublicKey
): Promise<string> {
  try {
    const tokenAccountList1 = await getFilteredTokenAccountsByOwner(connection, owner, mint);
    const tokenAccountList: any = tokenAccountList1.value.map((item: any) => {
      return item.pubkey;
    });
    let tokenAccount = '';
    for (const item of tokenAccountList) {
      if (item !== null) {
        tokenAccount = item;
      }
    }
    return tokenAccount;
  } catch {
    return '';
  }
  return '';
}