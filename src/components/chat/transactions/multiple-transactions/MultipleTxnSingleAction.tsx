import { TxnDetail } from "../TxnDetail";
import { TxnDetailWrapperProps } from "@/src/lib/types/transaction";
import { Transaction } from "@near-wallet-selector/core";
import { formatCosts, usePriceState } from "@/src/lib/state/price.state";

export const MultipleTxnSingleActionDetail = ({
  transaction,
  modifiedUrl,
  showDetails,
  showTxnDetail,
}: TxnDetailWrapperProps): JSX.Element => {
  const {
    priceState: { costs, gasPrice },
  } = usePriceState();

  return (
    <>
      {transaction.map((txn: Transaction, idx: number) => {
        const txnData = {
          transaction: txn,
          showDetails,
          modifiedUrl,
          gasPrice,
          ...formatCosts(costs, gasPrice),
        };

        return (
          <div className='mb-1' key={idx}>
            <TxnDetail
              showTitle={idx === 0}
              data={txnData}
              showDetails={showTxnDetail}
            />
          </div>
        );
      })}
    </>
  );
};
