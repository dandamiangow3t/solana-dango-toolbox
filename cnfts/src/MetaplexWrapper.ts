import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";
import {
  MetadataArgsArgs,
  UpdateArgsArgs,
  TreeConfig,
  createTree,
  fetchTreeConfigFromSeeds,
  mplBubblegum,
  mintV1,
  parseLeafFromMintV1Transaction,
  LeafSchema,
  getAssetWithProof,
  updateMetadata,
  burn,
  AssetWithProof,
} from "@metaplex-foundation/mpl-bubblegum";
import {
  DasApiAsset,
  DasApiAssetList,
  dasApi,
} from "@metaplex-foundation/digital-asset-standard-api";
import {
  ALL_DEPTH_SIZE_PAIRS,
  getConcurrentMerkleTreeAccountSize,
} from "@solana/spl-account-compression";
import {
  Keypair,
  KeypairSigner,
  Pda,
  PublicKey,
  TransactionWithMeta,
  Umi,
  createSignerFromKeypair,
  generateSigner,
  keypairIdentity,
  publicKey,
  some,
} from "@metaplex-foundation/umi";
import { LAMPORTS_PER_SOL, Transaction, PublicKey as Web3PublicKey } from "@solana/web3.js";
import { fromWeb3JsPublicKey } from "@metaplex-foundation/umi-web3js-adapters";
import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";

export default class MetaplexWrapper {
  private umi: Umi;

  constructor(rpcEndpoint: string, payerSecret: number[] | Uint8Array) {
    this.umi = createUmi(rpcEndpoint)
      .use(mplTokenMetadata())
      .use(mplBubblegum())
      .use(dasApi());

    const secret = payerSecret.length
      ? new Uint8Array(payerSecret)
      : (payerSecret as Uint8Array);
    const myKeypair = this.umi.eddsa.createKeypairFromSecretKey(secret);
    const wallet = createSignerFromKeypair(this.umi, myKeypair);
    this.umi.use(keypairIdentity(wallet));

    // console.log("new MetaplexWrapper");
    // console.log("  RPC PROVIDER", rpcEndpoint);
    // console.log("  Creator", wallet.publicKey);
  }

  public getKeyPair(secret: number[]): Keypair {
    return this.umi.eddsa.createKeypairFromSecretKey(new Uint8Array(secret));
  }

  private calculateDepthForNFTs(nftCount: number): number {
    let depth = 0;
    while (2 ** depth < nftCount) {
      depth++;
    }
    return depth;
  }

  private calcuateMaxBufferSize(nodes: number): number {
    let defaultDepthPair = ALL_DEPTH_SIZE_PAIRS[0];
    let maxDepth = defaultDepthPair.maxDepth;
    const allDepthSizes = ALL_DEPTH_SIZE_PAIRS.flatMap(
      (pair) => pair.maxDepth
    ).filter((item, pos, self) => self.indexOf(item) == pos);

    for (let i = 0; i <= allDepthSizes.length; i++) {
      if (Math.pow(2, allDepthSizes[i]) >= nodes) {
        maxDepth = allDepthSizes[i];
        break;
      }
    }
    return (
      ALL_DEPTH_SIZE_PAIRS.filter((pair) => pair.maxDepth == maxDepth)?.[0]
        ?.maxBufferSize ?? defaultDepthPair.maxBufferSize
    );
  }

  public async initializeTree(nftCount: number): Promise<KeypairSigner> {
    const merkleStructure = {
      maxDepth: this.calculateDepthForNFTs(nftCount),
      maxBufferSize: this.calcuateMaxBufferSize(nftCount),
      canopyDepth: 0,
    };

    const canopyDepth =
      merkleStructure.maxDepth > 20
        ? merkleStructure.maxDepth - 10
        : merkleStructure.maxDepth > 10
        ? 10
        : Math.floor(merkleStructure.maxDepth / 2);

    merkleStructure.canopyDepth = canopyDepth;

    console.log(`   Max Depth: ${merkleStructure.maxDepth}`);
    console.log(`   Max Buffer Size: ${merkleStructure.maxBufferSize}`);
    console.log(`   Canopy Depth: ${merkleStructure.canopyDepth}`);

    const requiredSpace = getConcurrentMerkleTreeAccountSize(
      merkleStructure.maxDepth,
      merkleStructure.maxBufferSize,
      merkleStructure.canopyDepth
    );
    console.log(`   Total size: ${requiredSpace.toLocaleString()} bytes.`);

    const { basisPoints } = await this.umi.rpc.getRent(requiredSpace);
    const storageCost = Number(basisPoints);

    const balance = await this.umi.rpc.getBalance(this.umi.payer.publicKey);
    console.log(
      `   Wallet Balance: ◎${(
        Number(balance.basisPoints) / LAMPORTS_PER_SOL
      ).toLocaleString()}`
    );
    console.log(
      `   Storage cost: ◎${(
        storageCost / LAMPORTS_PER_SOL
      ).toLocaleString()}`
    );
    

    if (Number(balance.basisPoints) < storageCost) {
      throw new Error(
        `Insufficient funds. Need at least ◎${(
          storageCost / LAMPORTS_PER_SOL
        ).toLocaleString(undefined)} for storage`
      );
    }

    // 1 - Create a Merkle Tree
    const merkleTree = generateSigner(this.umi);
    console.log(`   Creating Merkle Tree...${merkleTree.publicKey.toString()}`);

    const builder = await createTree(this.umi, {
      merkleTree,
      maxDepth: merkleStructure.maxDepth,
      maxBufferSize: merkleStructure.maxBufferSize,
      canopyDepth: merkleStructure.canopyDepth,
    });
    console.log(`   Sending request (this may take a few moments)...`);
    const { blockhash, lastValidBlockHeight } =
      await this.umi.rpc.getLatestBlockhash();
    await builder.sendAndConfirm(this.umi, {
      send: { commitment: "finalized" },
      confirm: {
        strategy: { type: "blockhash", blockhash, lastValidBlockHeight },
      },
    });

    const treeConfig = await this.getMerkleTree(merkleTree.publicKey);
    console.log(
      `🌲 Merkle Tree created: ${merkleTree.publicKey.toString()}. Config:`
    );
    this.printTreeDetails(treeConfig);

    return merkleTree;
  }

  public async getMerkleTree(publicKey: PublicKey | Web3PublicKey): Promise<TreeConfig> {
    if (publicKey instanceof Web3PublicKey) {
      publicKey = fromWeb3JsPublicKey(publicKey)
    }
    let treeFound = false;
    let treeConfig = undefined;
    while (!treeFound) {
      try {
        treeConfig = await fetchTreeConfigFromSeeds(this.umi, {
          merkleTree: publicKey,
        });
        treeFound = true;
      } catch (error) {
        await new Promise((resolve) => setTimeout(resolve, 5000));
      }
    }
    return treeConfig;
  }

  public printTreeDetails(treeConfig: TreeConfig) {
    console.log(`     - Tree config ${treeConfig.publicKey}`);
    console.log(`     - Tree creator ${treeConfig.treeCreator}`);
    console.log(`     - Tree delegate ${treeConfig.treeDelegate}`);
    console.log(
      `     - Total Mint Capacity ${Number(
        treeConfig.totalMintCapacity
      ).toLocaleString()}`
    );
    console.log(
      `     - Number Minted: ${Number(treeConfig.numMinted).toLocaleString()}`
    );
    console.log(`     - Is Public: ${treeConfig.isPublic}`);
    console.log(`     - Is Decompressible: ${treeConfig.isDecompressible}`);
  }

  public async getTx(signature: Uint8Array): Promise<TransactionWithMeta> {
    let txFound = false;
    while (!txFound) {
      try {
        const tx = await this.umi.rpc.getTransaction(signature);
        if (tx) return tx;
      } catch (error) {
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    }
  }

  public async mint(
    merkleTree: PublicKey,
    leafOwner: PublicKey,
    leafDelegate: PublicKey,
    metadata: MetadataArgsArgs,
  ): Promise<{ assetId: string; leafNonce: bigint, txSig: string }> {
    const txResponse = await mintV1(this.umi, {
      merkleTree,
      leafOwner,
      leafDelegate,
      metadata
    }).sendAndConfirm(this.umi);
    await this.getTx(txResponse.signature);
    const leaf: LeafSchema = await parseLeafFromMintV1Transaction(
      this.umi,
      txResponse.signature
    );
    return { assetId: leaf.id, leafNonce: leaf.nonce, txSig: bs58.encode(txResponse.signature) };
  }

  public async getAsset(
    assetId: PublicKey<string>,
    retries = 5,
    retryDelay = 5000
  ): Promise<DasApiAsset> {
    while (retries > 0) {
      try {
        const asset = await this.umi.rpc.getAsset(assetId);
        if (asset) return asset;
      } catch (e) {
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
        retries--;
      }
    }
  }

  public async getAssetWithProof(assetId: PublicKey): Promise<AssetWithProof> {
    return await getAssetWithProof(this.umi, assetId);
  }

  public async getAssetsByOwner(
    owner: PublicKey<string>,
    retries = 5,
    retryDelay = 5000
  ): Promise<DasApiAssetList> {
    while (retries > 0) {
      try {
        const assets = await this.umi.rpc.getAssetsByOwner({
          owner,
        });
        if (assets) return assets;
      } catch (e) {
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
        retries--;
      }
    }
  }

  public async searchAssets(
    owner: PublicKey<string>,
    jsonUri: string,
    retries = 5,
    retryDelay = 5000
  ): Promise<DasApiAssetList> {
    while (retries > 0) {
      try {
        const assets = await this.umi.rpc.searchAssets({
          owner,
          compressed: true,
          conditionType: "all",
          jsonUri
        });
        if (assets) return assets;
      } catch (e) {
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
        retries--;
      }
    }
  }

  public printAssetDetails(
    asset: DasApiAsset,
    showAttributes = true,
    showJson = false
  ): void {
    const {
      name,
      token_standard: standard,
      attributes,
    } = asset.content.metadata;
    const { compressed } = asset.compression;
    const { json_uri, files } = asset.content;

    const imgUrl = files?.find(
      (file) => file.mime === "image/png" || file.mime === "image/jpeg"
    )?.uri;
    const burnt = asset.burnt;
    console.table({
      name,
      standard,
      compressed,
      json_uri,
      imgUrl,
      burnt,
    });
    if (showAttributes && attributes) {
      console.table(attributes);
    }
    if (showJson) {
      console.log(JSON.stringify(asset, null, 2));
    }
  }

  public async editUri(assetId: string, leafOwner: PublicKey, newUri: string): Promise<string> {
    const assetWithProof = await getAssetWithProof(this.umi, publicKey(assetId));
    // Then we can use it to update metadata for the NFT.
    const updateArgs: UpdateArgsArgs = {
      name: "Petrus 2025"
      // uri: some(newUri),
    };

    const txResponse = await updateMetadata(this.umi, {
      ...assetWithProof,
      leafOwner,
      currentMetadata: assetWithProof.metadata,
      updateArgs,
    }).sendAndConfirm(this.umi)
    // console.log("txSig", bs58.encode(txResponse.signature))
    return bs58.encode(txResponse.signature)
  }

  public async burn(assetId: PublicKey, leafOwner: PublicKey) {
    const assetWithProof = await getAssetWithProof(this.umi, assetId);
    console.log("this.identity", this.umi.identity.publicKey);
    console.log("leafOwner", leafOwner);
    console.log("assetWithProof", assetWithProof);
    const txResponse = await burn(this.umi, {
      ...assetWithProof,
      leafOwner,
    }).sendAndConfirm(this.umi);
    console.log("txSig", bs58.encode(txResponse.signature))
  }
}
