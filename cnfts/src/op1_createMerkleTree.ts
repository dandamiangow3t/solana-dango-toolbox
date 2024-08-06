import "dotenv/config";
import MetaplexWrapper from "./MetaplexWrapper";
import { RPC_ENDPOINT } from "./config";

import { secret as creatorWallet } from "./wallets/creator_EgrThSSjpXdEDKLtYjwHs7BV5YyVHKidPedvSKyhXbqf.json";

const createTree = async () => {
  const metaplexWrapper = new MetaplexWrapper(RPC_ENDPOINT, creatorWallet);
  const merkletTree = await metaplexWrapper.initializeTree(1000000); // min 9000 (bellow 9000 will fail)
  console.log("merkletTree ", merkletTree);
};


(async () => {
 createTree()
})();
