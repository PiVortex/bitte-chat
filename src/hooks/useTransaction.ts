import { Account } from "near-api-js";
import {
  FinalExecutionOutcome,
  Transaction,
  Wallet,
} from "@near-wallet-selector/core";
import { SafeEncodedSignRequest } from "near-safe";

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
}

interface HandleTxnOptions {
  data: {
    transactions: Transaction[];
    evmData?: SafeEncodedSignRequest;
  };
  disableSuccess?: boolean;
}

export const useTransaction = ({ account, wallet }: UseTransactionProps) => {
  const handleTxn = async ({
    data,
    disableSuccess,
  }: HandleTxnOptions): Promise<SuccessInfo> => {
    const hasNoWalletOrAccount = !wallet && !account;
    if (hasNoWalletOrAccount) {
      throw new Error("No wallet or account provided");
    }

    const nearResult = account
      ? await executeWithAccount(data.transactions, account)
      : await executeWithWallet(data.transactions, wallet);

    return {
      near: {
        receipts: Array.isArray(nearResult) ? nearResult : [],
        transactions: data.transactions,
      },
      evm: null,
    };
  };

  return {
    handleTxn,
  };
};

export const executeWithAccount = async (
  transactions: Transaction[],
  account: Account,
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
            error,
          );
          return null;
        }
      }
      return null;
    }),
  );
  return results.filter(
    (result): result is FinalExecutionOutcome => result !== null,
  );
};

export const executeWithWallet = async (
  transactions: Transaction[],
  wallet: Wallet | undefined,
): Promise<void | FinalExecutionOutcome[]> => {
  if (!wallet) {
    throw new Error("Can't have undefined account and wallet");
  }
  return wallet.signAndSendTransactions({
    transactions: transactions,
  });
};
