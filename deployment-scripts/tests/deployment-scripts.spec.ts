import * as anchor from "@coral-xyz/anchor";
import { init, printInits } from "./init";

describe("deployment-scripts", () => {
  
  const inits = init()
  printInits(inits)
  const { provider, program, wallet } = inits

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.methods.initialize().rpc();
    console.log("Your transaction signature", tx);
  });
});
