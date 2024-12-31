import TxAccordion from "@/src/components/pages/txn/TxAccordion";
import { getNearblocksURL } from "@/src/lib/utils/nearblocks";
import { useWalletContext } from "@/src/providers/WalletProvider";
import { TransactionDetailProps } from "@lib/types";
import { shortenString } from "@lib/utils/string";
import { FunctionCallAction } from "@near-wallet-selector/core";

const DetailMethods = ({
  action,
  method,
}: {
  action: FunctionCallAction;
  method: string;
}) => {
  return (
    <>
      <TxAccordion label='Function Call' methodName={method}>
        <div className='overflow-x-auto rounded bg-shad-white-10 p-2 text-sm text-text-primary'>
          <pre className='p-2 md:p-4'>
            <code>{JSON.stringify(action, null, 2)}</code>
          </pre>
        </div>
      </TxAccordion>
    </>
  );
};

export const TxnDetailMultipleAction = ({
  data,
  actions,
  showDetails,
}: {
  data: TransactionDetailProps;
  actions: FunctionCallAction[];
  showDetails: boolean;
}): JSX.Element => {
  const { transaction } = data;

  const { accountData } = useWalletContext();

  const contractName = transaction.receiverId;

  return (
    <>
      {showDetails && (
        <div className='flex flex-col'>
          {transaction?.actions?.[0].type === "FunctionCall" && (
            <div className='relative flex w-full flex-col gap-4 rounded p-6'>
              <span className='text-sm font-semibold text-gray-800'>
                Contract Details
              </span>
              <div className='flex flex-col items-start justify-start gap-2 text-sm md:flex-row md:items-center md:justify-between md:gap-0 md:space-x-4'>
                <span className='text-text-secondary'>For Contract</span>
                <span className='cursor-pointer'>
                  <a
                    className='flex gap-1 text-gray-800'
                    href={getNearblocksURL(
                      accountData?.accountId as string,
                      undefined,
                      contractName
                    )}
                    target='_blank'
                  >
                    {shortenString(contractName, 14)}
                    <img src='/open-tab.svg' width={12} />
                  </a>
                </span>
              </div>
              {actions.length > 1
                ? actions.map((action: FunctionCallAction, idx: number) => {
                    return (
                      <DetailMethods
                        key={idx}
                        action={action}
                        method={action.params.methodName}
                      />
                    );
                  })
                : null}
            </div>
          )}
        </div>
      )}
    </>
  );
};
