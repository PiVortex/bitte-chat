import { TxnDetailWrapperProps } from "../../../../types/transaction";
import { SingleTxnMultipleAction } from "./SingleTxnMultipleAction";
import { SingleTxnSingleAction } from "./SingleTxnSingleAction";

export const SingleTxnDetail = ({
  transaction,
  modifiedUrl,
  showDetails,
  showTxnDetail,
}: TxnDetailWrapperProps): JSX.Element => {
  const hasMultipleActions = transaction?.[0]?.actions?.length > 1;

  return hasMultipleActions ? (
    <SingleTxnMultipleAction
      transaction={transaction}
      modifiedUrl={modifiedUrl}
      showDetails={showDetails}
      showTxnDetail={showTxnDetail}
    />
  ) : (
    <SingleTxnSingleAction
      transaction={transaction}
      modifiedUrl={modifiedUrl}
      showDetails={showDetails}
      showTxnDetail={showTxnDetail}
    />
  );
};
