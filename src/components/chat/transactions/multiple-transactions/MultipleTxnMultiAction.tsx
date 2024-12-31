import { formatCosts } from "@/src/lib/state/price.state";
import { TxnDetailWrapperProps } from "@/src/lib/types/transaction";
import { FunctionCallAction, Transaction } from "@near-wallet-selector/core";
import { TxnDetailMultipleAction } from "../single-txn/TxnDetailMultipleAction";

export const MultipleTxnMultiActionDetails = ({
  transaction,
  modifiedUrl,
  showDetails,
  showTxnDetail,
  costs,
  gasPrice,
}: TxnDetailWrapperProps): JSX.Element => {
  return (
    <>
      {transaction.map((txn: Transaction, txnIdx: number) => {
        const txnData = {
          // TODO: Ensure that the actions are always FunctionCallAction.
          transaction: txn,
          showDetails,
          modifiedUrl,
          gasPrice,
          ...formatCosts(costs, gasPrice),
        };

        return (
          <TxnDetailMultipleAction
            key={txnIdx}
            data={txnData}
            showDetails={showTxnDetail}
            actions={txnData.transaction.actions as FunctionCallAction[]}
          />
        );
      })}
    </>
  );
};
