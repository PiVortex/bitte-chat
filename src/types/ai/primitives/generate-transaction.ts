/* import { nearPrice } from "@mintbase-js/data";
import { ftBalance, getBalance } from "@mintbase-js/rpc";
import { Transaction } from "@near-wallet-selector/core";
import BN from "bn.js";
import { formatUnits } from "viem";
import { z } from "zod";

import FTS_METADATA from "@/public/fts.json";
import { AccountTransaction, BitteTool } from "@/src/lib/ai/types";
import { walletConfig } from "@/src/lib/constants/config";
import { logAgentError, logAgentWarning } from "@/src/lib/logger";
import { UserToken } from "@/src/lib/types/token";
import { calculateUsd } from "@/src/lib/utils/calculate-usd";
import { errorString } from "@lib/utils/error";

const FINANCIAL_TRANSACTION_METHODS = ["ft_transfer"];
const WARNING_PRICE = 10;

// Zod schemas
const ActionSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("FunctionCall"),
    params: z.object({
      methodName: z.string(),
      args: z.record(z.unknown()),
      gas: z.string(),
      deposit: z.string(),
    }),
  }),
  z.object({
    type: z.literal("Transfer"),
    params: z.object({
      deposit: z.string(),
    }),
  }),
]);

const TransactionSchema = z.object({
  signerId: z.string(),
  receiverId: z.string(),
  actions: z.array(ActionSchema),
});

const TransactionSchemaWithWarnings = z
  .object({
    transaction: TransactionSchema,
    warnings: z.array(
      z.object({
        message: z.string(),
        final: z.boolean(), // if final, stop trying to generate the transaction, else just show warning message
      })
    ),
  })
  .transform(async (obj) => {
    const { transaction: txn, warnings } = obj;
    const { totalCost, totalFT, totalNear } =
      await calculateTransactionCosts(txn);
    if (totalCost > WARNING_PRICE) {
      logAgentWarning(
        "DEFAULT",
        `High transaction cost detected: $${totalCost.toFixed(2)}`
      );
      warnings.push({
        message: `High transaction cost detected: $${totalCost.toFixed(2)}`,
        final: false,
      });
    }
    if (totalNear) {
      const userNearBalance = await getBalance({
        accountId: txn.signerId,
        rpcUrl: walletConfig.networkConfig.nodeUrl,
      });
      if (userNearBalance.lt(new BN(totalNear.toString()))) {
        logAgentError(
          "DEFAULT",
          new Error(`User does not have enough near to complete the transaction:
Owned Near: ${userNearBalance}
Near Needed: ${totalNear}`),
          { txn, userNearBalance }
        );
        warnings.push({
          message: `Not enough near to complete transaction.`,
          final: true,
        });
      }
    }
    if (totalFT) {
      const userFTBalance = BigInt(
        await ftBalance({
          accountId: txn.signerId,
          contractId: txn.receiverId,
          rpcUrl: walletConfig.networkConfig.nodeUrl,
        })
      );
      if (userFTBalance < totalFT) {
        logAgentError(
          "DEFAULT",
          new Error(`User does not have enough balance to complete the transaction:
Owned amount: ${userFTBalance}
Amount Needed: ${totalFT}`),
          { txn, userFTBalance }
        );
        warnings.push({
          message: `Not enough balance to complete transaction.`,
          final: true,
        });
      }
    }
    return obj;
  });

const FtMetadataSchema = z.object({
  name: z.string(),
  symbol: z.string(),
  decimals: z.number(),
});

type GenerateTransactionParams = {
  transactions: AccountTransaction[];
  network?: "mainnet" | "testnet";
};

export const generateTransaction: BitteTool<
  GenerateTransactionParams,
  AccountTransaction[]
> = {
  toolSpec: {
    function: {
      name: "generate-transaction",
      description:
        "Render a Near transaction payload for the user to review and sign.",
      parameters: {
        type: "object",
        required: ["transactions"],
        properties: {
          transactions: {
            type: "array",
            description: "An array of standard Near transaction objects.",
            items: {
              type: "object",
              properties: {
                signerId: {
                  type: "string",
                  description: "The account ID of the transaction signer.",
                },
                receiverId: {
                  type: "string",
                  description:
                    "The account ID of the transaction receiver (usually a smart contract).",
                },
                actions: {
                  type: "array",
                  description:
                    "An array of actions to be included in the transaction. Only Transfer and FunctionCall actions are supported.",
                  items: {
                    type: "object",
                    required: ["type", "params"],
                    properties: {
                      type: {
                        type: "string",
                        enum: ["FunctionCall", "Transfer"],
                        description: "The type of action to be performed.",
                      },
                      params: {
                        type: "object",
                        description: "Parameters specific to each action type.",
                        oneOf: [
                          {
                            type: "object",
                            required: ["methodName", "args", "gas", "deposit"],
                            properties: {
                              methodName: {
                                type: "string",
                                description:
                                  "The name of the contract method to call.",
                              },
                              args: {
                                type: "object",
                                description:
                                  "Arguments to pass to the smart contract method.",
                                properties: {},
                              },
                              gas: {
                                type: "string",
                                description:
                                  "The maximum amount of gas that can be used by this action, specified in yoctoNEAR (1 NEAR = 1e24 yoctoNEAR).",
                              },
                              deposit: {
                                type: "string",
                                description:
                                  "The amount of NEAR to attach to this action, specified in yoctoNEAR (1 NEAR = 1e24 yoctoNEAR). For FunctionCall actions use `1` (yoctoNEAR) if no deposit is needed.",
                              },
                            },
                          },
                          {
                            type: "object",
                            required: ["deposit"],
                            properties: {
                              deposit: {
                                type: "string",
                                description:
                                  "The amount of NEAR to transfer, specified in yoctoNEAR (1 NEAR = 1e24 yoctoNEAR).",
                              },
                            },
                          },
                        ],
                      },
                    },
                  },
                },
              },
              required: ["signerId", "receiverId", "actions"],
            },
          },
        },
      },
    },
    type: "function",
  },
  execute: async ({ transactions, network = "mainnet" }) => {
    const validatedTransactions: z.infer<
      typeof TransactionSchemaWithWarnings
    >[] = [];

    try {
      if (network === "testnet") {
        return {
          data: transactions,
          warnings: [],
          error: null,
        };
      }

      // Validate transactions
      for (const transaction of transactions) {
        const validatedTransaction =
          await TransactionSchema.parseAsync(transaction);

        const transactionWithWarnings =
          await TransactionSchemaWithWarnings.parseAsync({
            transaction: validatedTransaction,
            warnings: [] as { message: string; final: boolean }[],
          });

        validatedTransactions.push(transactionWithWarnings);
      }

      return {
        data: validatedTransactions.map((t) => t.transaction),
        warnings: validatedTransactions.flatMap((t) => t.warnings),
        error: null,
      };
    } catch (error) {
      const customError = new Error(
        `Error generating transaction. ${errorString(error)}`
      );
      return { data: [], warnings: [], error: customError };
    }
  },
};

async function calculateTransactionCosts(
  transaction: Transaction
): Promise<{ totalCost: number; totalFT: bigint; totalNear: bigint }> {
  const { data: currentNearPrice } = await nearPrice();
  let totalNear = 0n;
  let totalFT = 0n;
  let totalCost = 0;

  for (const action of transaction.actions) {
    switch (action.type) {
      case "FunctionCall":
        if (FINANCIAL_TRANSACTION_METHODS.includes(action.params.methodName)) {
          const ftMetadata = FTS_METADATA.find(
            (ft) => transaction.receiverId === ft[walletConfig.network]
          );

          if (ftMetadata) {
            const validatedFtMetadata = FtMetadataSchema.parse(ftMetadata);
            totalFT += BigInt(
              "amount" in action.params.args
                ? String(action.params.args.amount)
                : "0"
            );
            const ftBalance: UserToken = {
              meta: {
                contractAddress: transaction.receiverId,
                symbol: validatedFtMetadata.symbol,
                tokenIcon: "",
                isSpam: false,
                decimals: validatedFtMetadata.decimals,
                name: validatedFtMetadata.name,
              },
              balances: {
                balance: parseFloat(
                  formatUnits(totalFT, validatedFtMetadata.decimals)
                ),
                usdBalance: 0,
              },
              chain: { chainName: "NEAR" },
            };

            const amountInUsd = calculateUsd(
              Number(currentNearPrice),
              ftBalance
            );
            console.log("amountInUsd", amountInUsd);
            totalCost += amountInUsd || 0;
          }
        }
        break;
      case "Transfer":
        totalNear += BigInt(action.params.deposit);
        const amountInUsd =
          (Number(currentNearPrice) * Number(action.params.deposit)) / 1e24; // deposit is in yocto so we divide by 1e24 (near decimals)

        totalCost += amountInUsd;
        break;
    }
  }
  return { totalCost, totalFT, totalNear };
}
 */