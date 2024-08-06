import "dotenv/config";
import MetaplexWrapper from "./src/MetaplexWrapper";
import { RPC_ENDPOINT } from "../config";
import { none, Pda, PublicKey, publicKey } from "@metaplex-foundation/umi";

import { secret as creatorWallet } from "./src/wallets/creator.json";
import * as ownerWallet from "./src/wallets/owner.json";
import * as custodianWallet from "./src/wallets/custodian";
import * as merkleTreeWallet from "./src/wallets/merkleTree";
import { MetadataArgsArgs } from "@metaplex-foundation/mpl-bubblegum";
import { min } from "bn.js";

const createTree = async () => {
  const metaplexWrapper = new MetaplexWrapper(RPC_ENDPOINT, creatorWallet);
  const merkletTree = await metaplexWrapper.initializeTree(1000000); // min 9000 (bellow 9000 will fail)
  console.log("merkletTree ", merkletTree);
  const treeConfig = await metaplexWrapper.getMerkleTree(merkletTree.publicKey);
  metaplexWrapper.printTreeDetails(treeConfig);
};

const mintDC = async (name: string, symbol: string, uri: string) : Promise<{ assetId: Pda, leafIndex: bigint, txSig: string }>=> {
  const metaplexWrapper = new MetaplexWrapper(RPC_ENDPOINT, creatorWallet);
  const creator = metaplexWrapper.getKeyPair(creatorWallet);
  const owner = metaplexWrapper.getKeyPair(ownerWallet.secret);
  const leafDelegate = metaplexWrapper.getKeyPair(custodianWallet.secret); // leafDelegate
  const merkleTree = metaplexWrapper.getKeyPair(merkleTreeWallet.secret);

  console.table([
    ["creator", creator.publicKey],
    ["owner", owner.publicKey],
    ["leafDelegate", leafDelegate.publicKey],
    ["merkleTree", merkleTree.publicKey],
  ]);

  const dc: MetadataArgsArgs = {
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

  const mintResult = await metaplexWrapper.mint(
    owner.publicKey,
    merkleTree.publicKey,
    dc,
    leafDelegate.publicKey
  );
  // console.log("assetId", assetId);
  return mintResult
};

const mintTT = async (name: string, symbol: string, uri: string) : Promise<{ assetId: string, leafNonce: bigint, txSig: string }>=> {
  const metaplexWrapper = new MetaplexWrapper(RPC_ENDPOINT, creatorWallet);
  const creator = metaplexWrapper.getKeyPair(creatorWallet);
  const owner = metaplexWrapper.getKeyPair(ownerWallet.secret);
  const leafDelegate = metaplexWrapper.getKeyPair(custodianWallet.secret); // leafDelegate
  const merkleTree = metaplexWrapper.getKeyPair(merkleTreeWallet.secret);

  console.table([
    ["creator", creator.publicKey],
    ["owner", owner.publicKey],
    ["leafDelegate", leafDelegate.publicKey],
    ["merkleTree", merkleTree.publicKey],
  ]);

  const dc: MetadataArgsArgs = {
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

  const mintResult = await metaplexWrapper.mint(
    owner.publicKey,
    merkleTree.publicKey,
    dc,
    leafDelegate.publicKey
  );
  return mintResult
};

const getDC = async (assetId: PublicKey<string>) => {
  const metaplexWrapper = new MetaplexWrapper(RPC_ENDPOINT, creatorWallet);
  const asset = await metaplexWrapper.getAsset(assetId);
  metaplexWrapper.printAssetDetails(asset);
};

const getDCWithProof = async (assetId: PublicKey<string>) => {
  const metaplexWrapper = new MetaplexWrapper(RPC_ENDPOINT, creatorWallet);
  const asset = await metaplexWrapper.getAssetWithProof(assetId);
  console.log("assetWithProof", asset);
};

const editDCUri = async (assetId: PublicKey<string>, newUri: string) : Promise<string> => {
  const metaplexWrapper = new MetaplexWrapper(RPC_ENDPOINT, creatorWallet);
  const owner = metaplexWrapper.getKeyPair(ownerWallet.secret);
  return await metaplexWrapper.editUri(assetId, owner.publicKey, newUri);
};

const burnDC = async (assetId: PublicKey<string>) => {
  const metaplexWrapper = new MetaplexWrapper(RPC_ENDPOINT, ownerWallet.secret);
  const owner = metaplexWrapper.getKeyPair(ownerWallet.secret);
  metaplexWrapper.burn(assetId, owner.publicKey);
};

const getAssetsByOwner = async () => {
  const metaplexWrapper = new MetaplexWrapper(RPC_ENDPOINT, ownerWallet.secret);
  const assets = await metaplexWrapper.getAssetsByOwner(
    metaplexWrapper.getKeyPair(ownerWallet.secret).publicKey
  );
  console.log("Found %s assets", assets.total);
  assets.items
    .filter((a) => a.id == "DdLRzFf3QVmsjH1g3iMAURjjexKBCzgpishD1NGD7umh")
    .map((a) => console.log("Asset ", a));
};

(async () => {
  // const { assetId, leafIndex, txSig } = await mintDC("Petrush 2000", "PP", "https://api.npoint.io/5d5d0d708951c71739d9")
  // console.table([
  //   { name: "New mint", value: assetId },
  //   { name: "Leaf index", value: leafIndex },
  //   { name: "Tx sig", value: txSig }
  // ])

  const { assetId, leafIndex, txSig } = await mintTT("TT Petrush 2000", "PP", "https://api.npoint.io/5d5d0d708951c71739d9")
  console.table([
    { name: "New mint", value: assetId },
    { name: "Leaf index", value: leafIndex },
    { name: "Tx sig", value: txSig }
  ])



  // New mint 93YkCGVefZJXstUSpFzsftNoMPHtbhYNF1rUJMKDYZwi
  // Tx sig 4EW357oxz8WNg4Yr52Xb4w3GzagTzbEVrjmZrL5qcpWV9KD7HeJPKe6qQy1DpjFG3CZoKASpEqDKavEzs1FnPFvF


  // await createTree()
  // for(let i = 0; i < 20; i++) {
  //   await mintDC()
  //   await new Promise((resolve) => setTimeout(resolve, 1000))
  // }

  // await getDC(publicKey("D38YzqMQVBRUhEqbDsUB8soQ3kTUVbMREhrumpkLnQ3d"))
  
  // const txSig = await editDCUri(publicKey("HdJq9aPyBbuMB1M5V9Y9EQvmtXe6ZYAz6r6E8QvW5F3C"), "https://bit.ly/3WP9xNV")
  // console.log("edit DC Uri, Tx Sig", txSig)
  
  // await burnDC(publicKey("HdJq9aPyBbuMB1M5V9Y9EQvmtXe6ZYAz6r6E8QvW5F3C"));
  // await getDCWithProof(publicKey("6rbqtozhBMe74nBpVQD2FB3UBaBdHJBHripnm2AsyB2S"))
  // await getAssetsByOwner()
})();
