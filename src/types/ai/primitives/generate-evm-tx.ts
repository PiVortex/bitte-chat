/* import { BitteTool } from "@/src/lib/ai/types";
import { encodeEvmTx } from "@/src/lib/mpc/server";
import { Transaction } from "@near-wallet-selector/core";
import { SafeEncodedSignRequest, SignRequestData } from "near-safe";
import { z } from "zod";
import { errorString } from "@lib/utils/error";

const AddressSchema = z
  .string()
  .regex(/^0x[a-fA-F0-9]{40}$/, "Invalid Ethereum address format")
  .transform((val): `0x${string}` => val as `0x${string}`);

const HexDataSchema = z
  .string()
  .regex(/^0x[a-fA-F0-9]*$/)
  .transform((val): `0x${string}` => val as `0x${string}`);

const MetaTransactionSchema = z.object({
  to: AddressSchema,
  data: HexDataSchema,
  value: HexDataSchema,
  from: AddressSchema,
});

const SignRequestParamsSchema = z.array(
  z.union([MetaTransactionSchema, z.string()])
);

const SignRequestSchema = z.object({
  method: z.literal("eth_sendTransaction"),
  chainId: z.number().int(),
  params: SignRequestParamsSchema,
});

export const generateEvmTx: BitteTool<
  { accountId: string } & SignRequestData,
  { transactions: Transaction[]; evmSignRequest: SafeEncodedSignRequest }
> = {
  toolSpec: {
    function: {
      name: "generate-evm-tx",
      description:
        "Generate or format an EVM transaction payload, will prompt the UI for the review transcation UI when given an object that follows the specified params",
      parameters: {
        type: "object",
        required: ["method", "chainId", "params", "accountId", "evmAddress"],
        properties: {
          accountId: {
            type: "string",
            description: "The NEAR account ID of the user",
          },
          evmAddress: {
            type: "string",
            description:
              "The wallet address for evm networks purely used to populate the from param field",
          },
          method: {
            type: "string",
            enum: ["eth_sendTransaction"],
          },
          chainId: {
            type: "integer",
          },
          params: {
            type: "array",
            items: {
              oneOf: [
                {
                  type: "object",
                  properties: {
                    to: {
                      type: "string",
                      pattern: "^0x[a-fA-F0-9]{40}$",
                    },
                    data: {
                      type: "string",
                      pattern: "^0x[a-fA-F0-9]*$",
                    },
                    value: {
                      type: "string",
                      pattern: "^0x[a-fA-F0-9]*$",
                    },
                    from: {
                      type: "string",
                      pattern: "^0x[a-fA-F0-9]{40}$",
                      description:
                        "The sender's address. Use the provided 'from' address if specified, otherwise default to using the evmAddress parameter. The evmAddress parameter will be used in most cases.",
                    },
                  },
                  required: ["to", "data", "value", "from"],
                },
                {
                  type: "string",
                },
              ],
            },
          },
        },
      },
    },
    type: "function",
  },
  execute: async ({ accountId, ...signRequest }) => {
    try {
      const validatedSignRequest = SignRequestSchema.parse(
        signRequest
      ) as SignRequestData;
      return {
        data: await getEvmTransactionData(validatedSignRequest, accountId),
        warnings: [],
        error: null,
      };
    } catch (error: unknown) {
      const msg = errorString(error);
      console.error(msg);
      return {
        data: null,
        warnings: [],
        error: new Error(msg),
      };
    }
  },
};

export const getEvmTransactionData = async (
  evmData: SignRequestData,
  accountId: string | undefined
): Promise<{
  transactions: Transaction[];
  evmSignRequest: SafeEncodedSignRequest;
}> => {
  if (!evmData || !accountId) {
    throw new Error("EVM transaction or accountId invalid");
  }

  try {
    const encodedTx = await encodeEvmTx(accountId, evmData);

    return {
      transactions: [encodedTx.nearPayload as Transaction],
      evmSignRequest: encodedTx.evmData,
    };
  } catch (e: unknown) {
    console.error("Error encoding EVM transaction:", errorString(e));
    throw e;
  }
};
 */