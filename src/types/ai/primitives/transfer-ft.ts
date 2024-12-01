/* import { ftStorageBalance } from "@mintbase-js/rpc";
import { GAS_CONSTANTS, ONE_YOCTO } from "@mintbase-js/sdk";
import { FunctionCallAction } from "@near-wallet-selector/core";
import { parseUnits } from "viem";

import { generateTransaction } from "@/src/lib/ai/primitives/generate-transaction";
import { AccountTransaction, BitteTool } from "@/src/lib/ai/types";
import { searchToken } from "@/src/lib/ai/utils/search-token";
import { walletConfig } from "@/src/lib/constants/config";

type TransferFtParams = {
  signerId: string;
  receiverId: string;
  tokenIdentifier: string;
  amount: string;
  network?: "mainnet" | "testnet";
};

export const transferFt: BitteTool<TransferFtParams, AccountTransaction[]> = {
  toolSpec: {
    function: {
      name: "transfer-ft",
      description:
        "Transfer fungible tokens.  Automates the process of transferring fungible tokens and renders a Near transaction payload for the user to review and sign.",
      parameters: {
        type: "object",
        required: ["signerId", "receiverId", "tokenIdentifier", "amount"],
        properties: {
          signerId: {
            type: "string",
            description:
              "Address of the account sending the fungible token amount.",
          },
          receiverId: {
            type: "string",
            description:
              "Address of the account to receive the fungible token amount.",
          },
          tokenIdentifier: {
            type: "string",
            description:
              "Name, symbol, or contract ID of the fungible token being transferred.  This will be used in a fuzzy search to find the token.",
          },
          amount: {
            type: "string",
            description:
              "Amount of tokens to be transferred.  Example: '1' for 1 token, '0.001' for 0.001 tokens.",
          },
          network: {
            type: "string",
            description: "The NEAR network on which the transfer will occur.",
            enum: ["mainnet", "testnet"],
          },
        },
      },
    },
    type: "function",
  },
  execute: async ({
    signerId,
    receiverId,
    tokenIdentifier,
    amount,
    network = "mainnet",
  }) => {
    try {
      const transactionsToSend: AccountTransaction[] = [];
      const warningsToSend: { message: string; final: boolean }[] = [];

      const tokenInfo = searchToken(tokenIdentifier, network)?.[0];

      if (!tokenInfo) {
        return {
          data: null,
          warnings: [],
          error: new Error(
            `Token "${tokenIdentifier}" not found. Please check the token name and try again.`
          ),
        };
      }

      const contractId = tokenInfo.contractId;

      const args = {
        receiver_id: receiverId,
        amount: parseUnits(amount, tokenInfo.decimals).toString(),
        memo: null,
      };

      const isUserRegistered = await ftStorageBalance({
        contractId,
        accountId: receiverId,
        rpcUrl: walletConfig.networkConfig.nodeUrl,
      });

      // Check and build storage_deposit transaction if needed
      if (!isUserRegistered) {
        const storageDeposit: FunctionCallAction = {
          type: "FunctionCall",
          params: {
            methodName: "storage_deposit",
            args: { account_id: receiverId },
            deposit: ONE_YOCTO,
            gas: GAS_CONSTANTS.DEFAULT_GAS,
          },
        };

        const {
          data: storageDepositTransactions,
          warnings: storageDepositWarnings,
          error: storageDepositTransactionsError,
        } = await generateTransaction.execute({
          transactions: [
            {
              signerId,
              receiverId: contractId,
              actions: [storageDeposit],
            },
          ],
          network,
        });

        if (
          storageDepositTransactionsError ||
          !storageDepositTransactions ||
          storageDepositTransactions.length === 0
        ) {
          return {
            data: null,
            warnings: [],
            error:
              storageDepositTransactionsError instanceof Error
                ? storageDepositTransactionsError
                : new Error("Error generating storage deposit transaction"),
          };
        }

        transactionsToSend.push(...storageDepositTransactions);
        if (storageDepositWarnings) {
          warningsToSend.push(...storageDepositWarnings);
        }
      }

      // Build ft_transfer transaction
      const ftTransfer: FunctionCallAction = {
        type: "FunctionCall",
        params: {
          methodName: "ft_transfer",
          args,
          deposit: ONE_YOCTO,
          gas: GAS_CONSTANTS.FT_TRANSFER,
        },
      };
      const {
        data: ftTransferTransactions,
        warnings: ftTransferWarnings,
        error: ftTransferTransactionsError,
      } = await generateTransaction.execute({
        transactions: [
          {
            signerId,
            receiverId: contractId,
            actions: [ftTransfer],
          },
        ],
        network,
      });

      if (
        ftTransferTransactionsError ||
        !ftTransferTransactions ||
        ftTransferTransactions.length === 0
      ) {
        return {
          data: null,
          warnings: [],
          error:
            ftTransferTransactionsError instanceof Error
              ? ftTransferTransactionsError
              : new Error("Error generating ft_transfer transaction"),
        };
      }

      transactionsToSend.push(...ftTransferTransactions);
      if (ftTransferWarnings) {
        warningsToSend.push(...ftTransferWarnings);
      }

      return {
        data: transactionsToSend,
        warnings: warningsToSend,
        error: null,
      };
    } catch (error) {
      return {
        data: null,
        warnings: [],
        error:
          error instanceof Error
            ? error
            : new Error(
                `Unknown error occurred in transfer-ft: ${JSON.stringify(
                  error
                )}`
              ),
      };
    }
  },
};
 */