import "dotenv/config";
import MetaplexWrapper from "./MetaplexWrapper";
import { BASE_URL, CLUSTER, RPC_ENDPOINT, SOME_ID } from "./config";
import { none, Pda, PublicKey, publicKey } from "@metaplex-foundation/umi";

import { secret as creatorWallet } from "./wallets/creator_EgrThSSjpXdEDKLtYjwHs7BV5YyVHKidPedvSKyhXbqf.json";
import * as leafOwner from "./wallets/leafOwner_9r9SpxK4sj79vRWJGCvbKYidTKCqU99Sf6aKRSKu8x97.json";
import * as leafDelegate from "./wallets/leafDelegate_3ZvPtJ7pJS4CePszMWmuVVpJDY23oGXQv54tju6dJPtm.json";
import * as merkleTreeWallet from "./wallets/merkleTree";
import { MetadataArgsArgs } from "@metaplex-foundation/mpl-bubblegum";

const mintCNFT = async (name: string, symbol: string, uri: string) : Promise<{ assetId: string, leafNonce: bigint, txSig: string }>=> {
  const metaplexWrapper = new MetaplexWrapper(RPC_ENDPOINT, creatorWallet);
  const creator = metaplexWrapper.getKeyPair(creatorWallet);
  const owner = metaplexWrapper.getKeyPair(leafOwner.secret);
  const delegate = metaplexWrapper.getKeyPair(leafDelegate.secret);
  const merkleTree = metaplexWrapper.getKeyPair(merkleTreeWallet.secret);

  console.table([
    ["merkleTree", merkleTree.publicKey],
    ["cNFT creator", creator.publicKey],
    ["cNFT owner", owner.publicKey],
    ["cNFT delegate", delegate.publicKey],
  ]);

  const metadata: MetadataArgsArgs = {
    name,
    symbol,
    uri,
    creators: [
      {
        address: creator.publicKey,
        share: 100,
        verified: true,
      },
    ],
    sellerFeeBasisPoints: 100,
    collection: none()
  };

  return await metaplexWrapper.mint(
    merkleTree.publicKey,
    owner.publicKey,
    delegate.publicKey,
    metadata,
  )
};

(async () => {
  
  // const MAX_MINTS = 12
  // for(let i = 0; i < MAX_MINTS; i++) {

  //   const { assetId, leafNonce, txSig } = await mintCNFT("Some CNFT", "XX", `${BASE_URL}/${SOME_ID}/${i}`)
  //   console.table([
  //     { name: "New mint", value: assetId },
  //     { name: "Leaf nonce", value: leafNonce }
  //   ])
  //   console.log(`tx https://explorer.solana.com/tx/${txSig}?cluster=${CLUSTER}`)
  // } 

  const { assetId, leafNonce, txSig } = await mintCNFT("Petrus 1985", "VIN", `https://api.npoint.io/353b0f14a1bc63a351cb`)
  console.table([
    { name: "New mint", value: assetId },
    { name: "Leaf nonce", value: leafNonce }
  ])
  console.log(`tx https://explorer.solana.com/tx/${txSig}?cluster=${CLUSTER}`)

  
  
})();
