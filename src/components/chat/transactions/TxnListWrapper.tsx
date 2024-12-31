import { TransactionListProps } from "../../../types";
import { MultipleTxnDetail } from "./multiple-transactions/MultipleTxnDetail";
import { ShowDetailsBtn } from "./ShowDetailsBtn";
import { SingleTxnDetail } from "./single-txn/SingleTxnDetail";
import { TxnFees } from "./TxnFees";

export const TxnListWrapper = ({
  transaction,
  modifiedUrl,
  showDetails,
  showTxnDetail,
  setShowTxnDetail,
  operation,
}: TransactionListProps): JSX.Element => {
  return (
    <div className='mx-auto flex w-full flex-col gap-1'>
      <div className='flex w-full flex-col justify-center rounded'>
        <ShowDetailsBtn
          setShowDetails={setShowTxnDetail}
          showDetails={showTxnDetail}
          displayName='Transaction Details'
        />

        {showTxnDetail ? (
          <TxnFees transaction={transaction} operation={operation} />
        ) : null}

        {transaction?.length > 1 ? (
          <MultipleTxnDetail
            transaction={transaction}
            modifiedUrl={modifiedUrl}
            showDetails={showDetails}
            showTxnDetail={showTxnDetail}
          />
        ) : (
          <SingleTxnDetail
            transaction={transaction}
            modifiedUrl={modifiedUrl}
            showDetails={showDetails}
            showTxnDetail={showTxnDetail}
          />
        )}
      </div>
    </div>
  );
};
