/* import { BittePrimitiveName } from "../constants";
import { AnyBitteTool } from "../types";
import { BitteToolSpec } from "../types";
import transferFt from './transfer-ft'


export const bittePrimitives = {
  [BittePrimitiveName.TRANSFER_FT]: transferFt,
  [BittePrimitiveName.GENERATE_TRANSACTION]: generateTransaction,
  [BittePrimitiveName.GENERATE_EVM_TX]: generateEvmTx,
  [BittePrimitiveName.SUBMIT_QUERY]: submitQuery,
  [BittePrimitiveName.GENERATE_IMAGE]: generateImage,
  [BittePrimitiveName.CREATE_DROP]: createDrop,
  [BittePrimitiveName.GET_SWAP_TRANSACTIONS]: getSwapTransactions,
  [BittePrimitiveName.GET_TOKEN_METADATA]: getTokenMetadata,
} satisfies Record<BittePrimitiveName, AnyBitteTool>; // eslint-disable-line @typescript-eslint/no-explicit-any

export const bittePrimitiveSpecs = Object.fromEntries(
  Object.entries(bittePrimitives).map(([key, value]) => [key, value.toolSpec])
) as Record<BittePrimitiveName, BitteToolSpec>;

export const bittePrimitivesArray = Object.values(bittePrimitives);
export const bittePrimitivesSpecsArray = Object.values(bittePrimitiveSpecs);
 */