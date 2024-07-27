import * as anchor from "@coral-xyz/anchor";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import { Keypair } from "@solana/web3.js";
import { RPC_ENDPOINT } from "./config";

import ProgramIdl from "../target/idl/deployment_scripts.json";

export const init = (): {
  provider: anchor.Provider;
  wallet: anchor.Wallet;
  program: anchor.Program<anchor.Idl>;
} => {
  // Connection
  const connection = new anchor.web3.Connection(RPC_ENDPOINT);
  const wallet = getDefautlWallet();
  const provider = new anchor.AnchorProvider(
    connection,
    wallet,
    anchor.AnchorProvider.defaultOptions()
  );
  const program = new anchor.Program(ProgramIdl as anchor.Idl, provider);

  return { provider, wallet, program };
};

export const printInits = (i: {
  provider: anchor.Provider;
  wallet: anchor.Wallet;
  program: anchor.Program<anchor.Idl>;
}): void => {
  console.log("Provider:", i.provider.connection.rpcEndpoint);
  console.log("Wallet:", i.wallet.publicKey.toBase58());
  console.log("Program:", i.program.programId.toBase58());
};

const getDefautlWallet = (): anchor.Wallet => {
  // solana config set --keypair ~/.config/solana/id.json
  const idFile = path.join(os.homedir(), ".config", "solana", "id.json");
  const secretKey = Uint8Array.from(
    JSON.parse(fs.readFileSync(idFile, "utf-8"))
  );
  return new anchor.Wallet(Keypair.fromSecretKey(secretKey));
};
