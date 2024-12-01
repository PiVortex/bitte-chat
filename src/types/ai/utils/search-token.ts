/* import { Network } from "@mintbase-js/sdk";
import Fuse, { IFuseOptions } from "fuse.js";

import fungibleTokens from "@/../public/fts.json";
import { AllowlistedToken } from "../types";

const mainnetTokens: AllowlistedToken[] = [];
const testnetTokens: AllowlistedToken[] = [];

for (const token of fungibleTokens) {
  const partialToken = {
    name: token.name,
    symbol: token.symbol,
    decimals: token.decimals,
    icon: token.icon,
  };

  if (token.mainnet) {
    mainnetTokens.push({
      ...partialToken,
      contractId: token.mainnet,
    });
  }

  if (token.testnet) {
    testnetTokens.push({
      ...partialToken,
      contractId: token.testnet,
    });
  }
}

const options: IFuseOptions<AllowlistedToken> = {
  keys: [
    { name: "name", weight: 0.5 },
    { name: "symbol", weight: 0.4 },
    { name: "contractId", weight: 0.1 },
  ],
  isCaseSensitive: false,
  threshold: 0.0,
};

const fuseMainnet = new Fuse(mainnetTokens, options);
const fuseTestnet = new Fuse(testnetTokens, options);

export const searchToken = (
  query: string,
  network: Network = "mainnet"
): AllowlistedToken[] | null => {
  const isMainnet = network === "mainnet";
  if (query.toLowerCase() === "near") {
    query = isMainnet ? "wrap.near" : "wrap.testnet"; // Special case for NEAR
  }
  const fuse = isMainnet ? fuseMainnet : fuseTestnet;

  const result = fuse.search(query);

  if (result.length === 0) {
    return null;
  }

  return result.map((item) => item.item);
};
 */