import { TransactionListProps } from "../../../types";
import { MultipleTxnDetail } from "./multiple-transactions/MultipleTxnDetail";
import { ShowDetailsBtn } from "./ShowDetailsBtn";
import { SingleTxnDetail } from "./single-transaction/SingleTxnDetail";
import { TxnFees } from "./TxnFees";

export const TxnListWrapper = ({
  accountId,
  costs,
  gasPrice,
  transaction,
  modifiedUrl,
  showDetails,
  showTxnDetail,
  setShowTxnDetail,
  operation,
  textColor,
  borderColor
}: TransactionListProps): JSX.Element => {
  return (
    <div className='mx-auto flex w-full flex-col gap-1'>
      <div className='flex w-full flex-col justify-center rounded'>
        <ShowDetailsBtn
          setShowDetails={setShowTxnDetail}
          showDetails={showTxnDetail}
          displayName='Transaction Details'
          textColor={textColor}
        />

        {showTxnDetail ? (
          <TxnFees
            costs={costs || []}
            gasPrice={gasPrice || ""}
            transaction={transaction}
            operation={operation}
            textColor={textColor}
            borderColor={borderColor}
          />
        ) : null}

        {transaction?.length > 1 ? (
          <MultipleTxnDetail
            accountId={accountId}
            costs={costs || []}
            gasPrice={gasPrice || ""}
            transaction={transaction}
            modifiedUrl={modifiedUrl}
            showDetails={showDetails}
            showTxnDetail={showTxnDetail}
            textColor={textColor}
          />
        ) : (
          <SingleTxnDetail
            accountId={accountId}
            costs={costs || []}
            gasPrice={gasPrice || ""}
            transaction={transaction}
            modifiedUrl={modifiedUrl}
            showDetails={showDetails}
            showTxnDetail={showTxnDetail}
            textColor={textColor}
          />
        )}
      </div>
    </div>
  );
};
