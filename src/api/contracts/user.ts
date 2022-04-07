// anchor/solana
import { web3, Program, Provider, Wallet, workspace } from "@project-serum/anchor";
import { Connection, Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js";

export const connection_env =   {
  name: 'devnet',
  endpoint: 'https://psytrbhymqlkfrhudd.dev.genesysgo.net:8899/',
  // endpoint: clusterApiUrl('devnet'),
};

export const airdropSol = async (
  provider: Provider,
  target: web3.PublicKey,
  lamps: number
): Promise<string> => {
  const sig: string = await provider.connection.requestAirdrop(target, lamps);
  await provider.connection.confirmTransaction(sig);
  return sig;
};

export class User {
  wallet: Wallet;
  connection: Connection;
  provider: Provider;
  miner?: any;
 constructor(keypair: Keypair,connection: Connection) {
    this.wallet = new Wallet(keypair);
    this.connection = connection;
    this.provider = new Provider(
      this.connection,
      this.wallet,
      {
        skipPreflight: true,
        commitment: "confirmed",
        preflightCommitment: "confirmed",
      }
    );
  }
  public async init() {
    await airdropSol(
      this.provider,
      this.wallet.publicKey,
      0.5 * LAMPORTS_PER_SOL
    );
  }
}
