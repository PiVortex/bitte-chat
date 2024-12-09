import { Account } from "near-api-js";
import { Transaction, Wallet } from "@near-wallet-selector/core";
import { SafeEncodedSignRequest } from "near-safe";

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

export const useTransaction = ({
  account,
  wallet,
}: UseTransactionProps) => {

  const handleTxn = async ({ data, disableSuccess }: HandleTxnOptions) => {
    const hasNoWalletOrAccount = !wallet && !account;
    if (hasNoWalletOrAccount) {
      throw new Error("No wallet or account provided");
    }

    return account 
      ? await executeWithAccount(data.transactions, account) 
      : await executeWithWallet(data.transactions, wallet);
  };

  return {
    handleTxn
  };
};

export const executeWithAccount = async (transactions: Transaction[], account: Account ) => {
    return await Promise.all(
      transactions.map((txn) => {
        if(txn.actions.every(action => action.type === "FunctionCall")){
          return account.functionCall({
            contractId: txn.receiverId,
            methodName: txn.actions[0].params.methodName,
            args: txn.actions[0].params.args,
            attachedDeposit: BigInt(txn.actions[0].params.deposit),
            gas: BigInt(txn.actions[0].params.gas),
          });
        }
      })
    );
  };

  export const executeWithWallet = async (transactions: Transaction[], wallet: Wallet | undefined) => {
    if(!wallet){
        throw new Error("Can't have undefined account and wallet")
    }
    return wallet.signAndSendTransactions({
      transactions: transactions,
    });
  };