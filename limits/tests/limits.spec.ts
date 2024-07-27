import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Limits } from "../target/types/limits";
import { init, printInits } from "./init";
import { Keypair, PublicKey } from "@solana/web3.js";
import { expect } from "chai";
import { fail } from "assert";

describe("limits", () => {

  const inits = init()
  printInits(inits)
  const { provider, program, wallet } = inits

  it("Should test ix account limit at 31", async () => {
    // Bear in mind that to this tx it adds at least
    // 1 Pubkey + 1 Sig for the fee payer 
    // The program itself
    const getRandomPubkey = (): PublicKey => {
      return Keypair.generate().publicKey
    }
    
    let accounts = {}
    let size = 11
    for(let i = 0; i < size; i++) {
      accounts[`account${i}`] = getRandomPubkey()
    }
    
    const tx = await program.methods
    .testIxAccountsLimitSuccess()
    .accounts(accounts)
    .rpc();
    console.log("tsSix", tx);
  });

  it("Should fail test ix account limit at 32", async () => {
    
    const getRandomPubkey = (): PublicKey => {
      return Keypair.generate().publicKey
    }
    
    let accounts = {}
    let size = 32
    for(let i = 0; i < size; i++) {
      accounts[`account${i}`] = getRandomPubkey()
    }
    try {
      const tx = await program.methods
      .testIxAccountsLimitFail()
      .accounts(accounts)
      .rpc()
      
      fail()
    } catch (err) {
      console.log(err)
    }
  });

  it("Should test ix account limit at 20 accounts and 3 signatures", async () => {
    
    const getRandomPubkey = (): PublicKey => {
      return Keypair.generate().publicKey
    }
    
    let accounts = {}
    const signer0 = Keypair.generate()
    const signer1 = Keypair.generate()
    const signer2 = Keypair.generate()
    accounts["signer0"] = signer0.publicKey
    accounts["signer1"] = signer1.publicKey
    accounts["signer2"] = signer2.publicKey
    
    let size = 20
    for(let i = 0; i < size; i++) {
      accounts[`account${i}`] = getRandomPubkey()
    }
    
    const tx = await program.methods
    .testIxAccountsAndSignatureLimitSuccess()
    .accounts(accounts)
    .signers([signer0, signer1, signer2])
    .rpc();
    console.log("tsSix", tx);
  });

  it.only("Should fail ix account limit at 21 accounts and 3 signatures", async () => {
    
    const getRandomPubkey = (): PublicKey => {
      return Keypair.generate().publicKey
    }
    
    let accounts = {}
    const signer0 = Keypair.generate()
    const signer1 = Keypair.generate()
    const signer2 = Keypair.generate()
    const signer3 = Keypair.generate()
    accounts["signer0"] = signer0.publicKey
    accounts["signer1"] = signer1.publicKey
    // accounts["signer2"] = signer2.publicKey
    // accounts["signer3"] = signer3.publicKey
    
    let size = 20
    for(let i = 0; i < size; i++) {
      accounts[`account${i}`] = getRandomPubkey()
    }
    try {
      const tx = await program.methods
      .testIxAccountsAndSignatureLimitFail()
      .accounts(accounts)
      .signers([signer0, signer1])
      .rpc()
    } catch(err)  {
      console.log(err)
    }
    
  });
});
