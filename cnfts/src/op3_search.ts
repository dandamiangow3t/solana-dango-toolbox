import "dotenv/config";
import MetaplexWrapper from "./MetaplexWrapper";
import { BASE_URL, RPC_ENDPOINT } from "./config";


import * as leafOwner from "./wallets/leafOwner_9r9SpxK4sj79vRWJGCvbKYidTKCqU99Sf6aKRSKu8x97.json";

const getAssetsByOwner = async () => {
  const metaplexWrapper = new MetaplexWrapper(RPC_ENDPOINT, leafOwner.secret);
  const assets = await metaplexWrapper.getAssetsByOwner(
    metaplexWrapper.getKeyPair(leafOwner.secret).publicKey
  );
  console.log("Found %s assets", assets.total);
  assets.items
    .map((a, i) => console.log("Asset %s - id %s, leaf_id %s, seq %s, name %s, symbol %s, uri %s, token standard %s", i, 
      a.id, a.compression.leaf_id, a.compression.seq,
      a.content.metadata.name, a.content.metadata.symbol, a.content.json_uri, a.content.metadata.token_standard
    ));
};

const searchAssets = async (jsonUri: string) => {
  const metaplexWrapper = new MetaplexWrapper(RPC_ENDPOINT, leafOwner.secret);
  const assets = await metaplexWrapper.searchAssets(
    undefined,
    jsonUri
  );
  console.log("Found %s assets", assets.total);
  assets.items
    .map((a, i) => console.log("Asset %s - id %s, leaf_id %s, seq %s, name %s, symbol %s, uri %s, token standard %s", i, 
      a.id, a.compression.leaf_id, a.compression.seq,
      a.content.metadata.name, a.content.metadata.symbol, a.content.json_uri, a.content.metadata.token_standard
    ));
};

const searchAssetsInSeries = async (jsonBaseUri: string, maxInSeries: number  ) => {
  const metaplexWrapper = new MetaplexWrapper(RPC_ENDPOINT, leafOwner.secret);
  for(let i = 0; i < maxInSeries; i++) {
    let a = (await metaplexWrapper.searchAssets(
      undefined,
      `${jsonBaseUri}/${i}`
    )).items[0]
    console.log("Asset %s - id %s, leaf_id %s, seq %s, name %s, symbol %s, uri %s, token standard %s", i, 
        a.id, a.compression.leaf_id, a.compression.seq,
        a.content.metadata.name, a.content.metadata.symbol, a.content.json_uri, a.content.metadata.token_standard
    )
  }
  
  
};

(async () => {
  // await getAssetsByOwner()

  await searchAssets(`${BASE_URL}/FMtZ8Rdk3mwa5TZha9eZ3cfJzzoxJMUBWJHkEjiBVZa9`)
  
  let start = new Date().getTime()
  await searchAssetsInSeries(`${BASE_URL}/FMtZ8Rdk3mwa5TZha9eZ3cfJzzoxJMUBWJHkEjiBVZa9`, 12)
  console.log("took %s ms", new Date().getTime() - start)

})();
