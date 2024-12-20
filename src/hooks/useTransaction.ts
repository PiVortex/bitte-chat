import { Account } from "near-api-js";
import {
  FinalExecutionOutcome,
  Transaction,
  Wallet,
} from "@near-wallet-selector/core";
import { DecodedTxData, SignRequestData } from "near-safe";
import { EVMWalletAdapter } from "../types";

export interface SuccessInfo {
  near: {
    receipts: FinalExecutionOutcome[];
    transactions: Transaction[];
    encodedTxn?: string;
  };
  evm?: any;
}

interface UseTransactionProps {
  account?: Account;
  wallet?: Wallet;
  evmWallet?: EVMWalletAdapter;
}

interface HandleTxnOptions {
  transactions?: Transaction[];
  evmData?: DecodedTxData;
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

    let nearResult;
    if (transactions) {
      nearResult = account
        ? await executeWithAccount(transactions, account)
        : await executeWithWallet(transactions, wallet);
    }

    let evmResult;
    if (evmData && evmWallet) {
      evmResult = await executeWithEvmWallet(evmData, evmWallet);
    }

    return {
      near: {
        receipts: Array.isArray(nearResult) ? nearResult : [],
        transactions: transactions || [],
      },
      evm: evmResult,
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
  return results.filter(
    (result): result is FinalExecutionOutcome => result !== null
  );
};

export const executeWithWallet = async (
  transactions: Transaction[],
  wallet: Wallet | undefined
): Promise<void | FinalExecutionOutcome[]> => {
  if (!wallet) {
    throw new Error("Can't have undefined account and wallet");
  }
  return wallet.signAndSendTransactions({
    transactions: transactions,
  });
};

export const executeWithEvmWallet = async (
  evmData: DecodedTxData,
  evmWallet: EVMWalletAdapter
) => {
  const { transactions: evmTransactions } = evmData;
  if (evmTransactions.length === 0) {
    return null;
  }

  const txPromises = evmTransactions.map((tx) => {
    const rawTxParams = {
      to: tx.to,
      value: BigInt(tx.value),
      data: tx.data,
    };
    return evmWallet.sendTransaction(rawTxParams);
  });

  return Promise.all(txPromises);
};
