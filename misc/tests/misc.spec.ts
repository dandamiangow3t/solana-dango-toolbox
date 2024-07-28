import * as anchor from "@coral-xyz/anchor";
import { init, printInits } from "./init";
import { PublicKey, sendAndConfirmTransaction, Transaction } from "@solana/web3.js";
import { SEED, SEED_CONFIG } from "./constants"
import { fail } from "assert"

describe("misc", () => {
  
  const inits = init()
  printInits(inits)
  const { provider, program, wallet } = inits

  it("Init some config", async () => {
    
    const [someConfigPda, _] = PublicKey.findProgramAddressSync(
      [
        anchor.utils.bytes.utf8.encode(SEED),
        anchor.utils.bytes.utf8.encode(SEED_CONFIG),
        wallet.payer.publicKey.toBuffer()
      ],
      program.programId
    )

    let someConfigAccount = undefined 
    try {
      someConfigAccount = await program.account["someConfig"].fetch(someConfigPda)
    } catch (_) {}
    
    if (!someConfigAccount) {
      const txSig = await program.methods.initSomeConfig()
      .accounts({
        config: someConfigPda,
        signer: wallet.payer.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([wallet.payer])
      .rpc({commitment: "finalized"})
      
      console.log("txSig", txSig)
    } else {
      console.log("someConfigAccount", someConfigAccount)
    }
  });

  it("Should update account two ix, same tx", async () => {
    
    const [someConfigPda, _] = PublicKey.findProgramAddressSync(
      [
        anchor.utils.bytes.utf8.encode(SEED),
        anchor.utils.bytes.utf8.encode(SEED_CONFIG),
        wallet.payer.publicKey.toBuffer()
      ],
      program.programId
    )

    let someConfigAccount = await program.account["someConfig"].fetch(someConfigPda)
    if (!someConfigAccount) {
      fail("SomeConfig account doesn't exist")
    }

    const amount = Math.floor(Math.random() * 1000000 % 65535)
    console.log("amount", amount)

    const ixPartOne = await program.methods.doSomethingPartOne(amount)
    .accounts({
      config: someConfigPda,
      signer: wallet.payer.publicKey,
      systemProgram: anchor.web3.SystemProgram.programId,
    }).instruction()

    const ixPartTwo = await program.methods.doSomethingPartTwo()
    .accounts({
      config: someConfigPda,
      signer: wallet.payer.publicKey,
      systemProgram: anchor.web3.SystemProgram.programId,
    }).instruction()

    const tx = new Transaction()

    tx.add(ixPartOne)
    tx.add(ixPartTwo)

    tx.feePayer = wallet.payer.publicKey

    const txSig = await sendAndConfirmTransaction(provider.connection, tx, [wallet.payer], { commitment: "finalized"})
    console.log("txSig", txSig)

  });
});
