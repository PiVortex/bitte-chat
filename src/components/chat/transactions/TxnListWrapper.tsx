import BN from "bn.js";
import { useAccountBalance } from "../../../hooks/useAccountBalance";
import { useTxnPrice } from "../../../hooks/useTxnPrice";
import { TransactionListProps } from "../../../types";
import { useAccount } from "../../AccountContext";
import { MultipleTxnDetail } from "./multiple-transactions/MultipleTxnDetail";
import { ShowDetailsBtn } from "./ShowDetailsBtn";
import { SingleTxnDetail } from "./single-transaction/SingleTxnDetail";
import { TxnFees } from "./TxnFees";

export const TxnListWrapper = ({
  transaction,
  modifiedUrl,
  showDetails,
  showTxnDetail,
  setShowTxnDetail,
  operation,
}: TransactionListProps): JSX.Element => {
  const { wallet, account, accountId } = useAccount();

  if (!account || !accountId) return <></>;

  const { balance } = useAccountBalance(account);

  const { costs, gasPrice } = useTxnPrice(new BN(balance || 0), transaction);

  return (
    <div className='mx-auto flex w-full flex-col gap-1'>
      <div className='flex w-full flex-col justify-center rounded'>
        <ShowDetailsBtn
          setShowDetails={setShowTxnDetail}
          showDetails={showTxnDetail}
          displayName='Transaction Details'
        />

        {showTxnDetail ? (
          <TxnFees
            costs={costs || []}
            gasPrice={gasPrice || ""}
            transaction={transaction}
            operation={operation}
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
          />
        )}
      </div>
    </div>
  );
};
