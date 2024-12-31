import { TxnDetailWrapperProps } from "@/src/lib/types/transaction";
import { MultipleTxnMultiActionDetails } from "./MultipleTxnMultiAction";
import { MultipleTxnSingleActionDetail } from "./MultipleTxnSingleAction";

export const MultipleTxnDetail = ({
  transaction,
  modifiedUrl,
  showDetails,
  showTxnDetail,
}: TxnDetailWrapperProps): JSX.Element => {
  const hasMultipleActions = transaction.every(
    (tx) => tx.actions && tx.actions.length > 1
  );

  return hasMultipleActions ? (
    <MultipleTxnMultiActionDetails
      transaction={transaction}
      modifiedUrl={modifiedUrl}
      showDetails={showDetails}
      showTxnDetail={showTxnDetail}
    />
  ) : (
    <MultipleTxnSingleActionDetail
      transaction={transaction}
      modifiedUrl={modifiedUrl}
      showDetails={showDetails}
      showTxnDetail={showTxnDetail}
    />
  );
};
