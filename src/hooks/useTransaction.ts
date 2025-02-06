import {
  FinalExecutionOutcome,
  Transaction,
  Wallet,
} from "@near-wallet-selector/core";
import { Account } from "near-api-js";
import { EthTransactionParams, SignRequestData } from "near-safe";
import { EVMWalletAdapter } from "../types";

export interface SuccessInfo {
  near: {
    receipts: FinalExecutionOutcome[];
    transactions: Transaction[];
    encodedTxn?: string;
  };
}

interface UseTransactionProps {
  account?: Account;
  wallet?: Wallet;
  evmWallet?: EVMWalletAdapter;
}

interface HandleTxnOptions {
  transactions?: Transaction[];
  evmData?: SignRequestData;
}

export const useTransaction = ({
  account,
  wallet,
  evmWallet,
}: UseTransactionProps) => {
  const handleTxn = async ({
    transactions,
    evmData,
  }: HandleTxnOptions): Promise<SuccessInfo> => {
    const hasNoWalletOrAccount = !wallet && !account && !evmWallet?.address;
    if (hasNoWalletOrAccount) {
      throw new Error("No wallet or account provided");
    }
    console.log(hasNoWalletOrAccount, account , 'hasNoWalletOrAccount')
    let nearResult;
    try {
      if (transactions) {
        nearResult = account
          ? await executeWithAccount(transactions, account)
          : await executeWithWallet(transactions, wallet);
      }
    } catch (error) {
      console.error("Error executing NEAR transaction:", error);
      throw error; // Re-throw or handle as needed
    }

    try {
      if (evmData && evmWallet) {
        const res = await executeWithEvmWallet(evmData, evmWallet);
        console.log(res, 'EVM transaction result');
      }
    } catch (error) {
      console.error("Error executing EVM transaction:", error);
      throw error; // Re-throw or handle as needed
    }


    console.log(nearResult, 'nearResult')

    return {
      near: {
        receipts: Array.isArray(nearResult) ? nearResult : [],
        transactions: transactions || [],
      },
    };
  };

  return {
    handleTxn,
  };
};

export const executeWithAccount = async (
  transactions: Transaction[],
  account: Account
): Promise<FinalExecutionOutcome[]> => {
  const results = await Promise.all(
    transactions.map(async (txn) => {
      if (txn.actions.every((action) => action.type === "FunctionCall")) {
        try {
          return await account.functionCall({
            contractId: txn.receiverId,
            methodName: txn.actions[0].params.methodName,
            args: txn.actions[0].params.args,
            attachedDeposit: BigInt(txn.actions[0].params.deposit),
            gas: BigInt(txn.actions[0].params.gas),
          });
        } catch (error) {
          console.error(
            `Transaction failed for contract ${txn.receiverId}, method ${txn.actions[0].params.methodName}:`,
            error
          );
          return null;
        }
      }
      return null;
    })
  );

  const filter = results.filter(
    (result): result is FinalExecutionOutcome => result !== null
  );

  console.log(filter, 'filter')

  return filter
};

export const executeWithWallet = async (
  transactions: Transaction[],
  wallet: Wallet | undefined
): Promise<void | FinalExecutionOutcome[]> => {
  if (!wallet) {
    throw new Error("Can't have undefined account and wallet");
  }

  const walletZ = wallet.signAndSendTransactions({
    transactions: transactions,
  });


  console.log(walletZ, 'walletZ')

  return walletZ
};

export const executeWithEvmWallet = async (
  evmData: SignRequestData,
  evmWallet: EVMWalletAdapter
): Promise<void> => {
  if (!Array.isArray(evmData.params)) {
    throw new Error("Invalid transaction parameters");
  }

  if (
    !evmData.params.every(
      (tx): tx is EthTransactionParams => typeof tx === "object" && "to" in tx
    )
  ) {
    throw new Error("Invalid transaction parameters");
  }

  try {
    const txPromises = evmData.params.map((tx) => {
      const rawTxParams = {
        to: tx.to,
        value: tx.value ? BigInt(tx.value) : BigInt(0),
        data: tx.data || "0x",
        from: tx.from,
        gas: tx.gas ? BigInt(tx.gas) : undefined,
      };

      return evmWallet.sendTransaction(rawTxParams);
    });

    const txnResults = await Promise.all(txPromises);
    console.log(txnResults, 'EVM transaction results');
  } catch (error) {
    console.error("Error executing EVM transactions:", error);
    throw error; // Re-throw or handle as needed
  }
};
