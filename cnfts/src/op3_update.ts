import "dotenv/config";
import MetaplexWrapper from "./MetaplexWrapper";
import { CLUSTER, RPC_ENDPOINT } from "./config";

import { secret as creatorWallet } from "./wallets/creator_EgrThSSjpXdEDKLtYjwHs7BV5YyVHKidPedvSKyhXbqf.json";
import * as leafOwner from "./wallets/leafOwner_9r9SpxK4sj79vRWJGCvbKYidTKCqU99Sf6aKRSKu8x97.json";
import * as leafDelegate from "./wallets/leafDelegate_3ZvPtJ7pJS4CePszMWmuVVpJDY23oGXQv54tju6dJPtm.json";
import * as merkleTreeWallet from "./wallets/merkleTree";
import { MetadataArgsArgs } from "@metaplex-foundation/mpl-bubblegum";

const editUri = async (assetId: string, newUri: string) : Promise<string> => {
  const metaplexWrapper = new MetaplexWrapper(RPC_ENDPOINT, creatorWallet);
  const owner = metaplexWrapper.getKeyPair(leafOwner.secret);
  return await metaplexWrapper.editUri(assetId, owner.publicKey, newUri);
};

(async () => {
  
  const leafId = "97hkTSuVoML7z1b4HnNxqiL4id2CqN9ye5xkqb4fzANP"
  const txSig = await editUri(leafId, "https://api.npoint.io/c5c2d268b44edee27e62")
  console.log(`tx https://explorer.solana.com/tx/${txSig}?cluster=${CLUSTER}`)
  
})();
