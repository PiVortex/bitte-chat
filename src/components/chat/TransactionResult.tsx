/* import { SuccessInfo } from "@lib/transactions/go-success";
import { getNearblocksURL } from "@lib/utils/nearblocks";
import { shortenString } from "@lib/utils/string";
import { Network } from "near-safe";

interface TransactionResultProps {
  result: SuccessInfo;
  // TODO(bh2smith): AccountId is not necessary.
  //  SuccessInfo contains enough information to determine the network.
  accountId: string;
}

export const TransactionResult = ({
  result: { evm, near },
  accountId,
}: TransactionResultProps) => {
  const scanUrl = evm?.txHash
    ? `${Network.fromChainId(evm.txData.chainId).scanUrl}/tx/${evm.txHash}`
    : null;

  return (
    <div className='mt-4'>
      <p className='text-center text-[14px] font-semibold'>
        Transaction success
      </p>
      <div className='flex flex-col gap-4 p-6 text-[14px]'>
        {evm?.txHash && scanUrl && (
          <div className='flex items-center justify-between px-6 text-[14px]'>
            <div className='text-text-secondary'>EVM Transaction</div>
            <a
              className='flex gap-1 text-gray-800'
              href={scanUrl}
              target='_blank'
              rel='noopener noreferrer'
            >
              {shortenString(evm.txHash, 10)}
              <img src='/open-tab.svg' width={12} alt='Open in new tab' />
            </a>
          </div>
        )}
        {near.receipts.map((receipt) => (
          <div
            key={receipt.transaction.hash}
            className='flex items-center justify-between px-6 text-[14px]'
          >
            <div className='text-text-secondary'>Near Transaction</div>
            <a
              className='flex gap-1 text-gray-800'
              href={getNearblocksURL(accountId, receipt.transaction.hash)}
              target='_blank'
              rel='noopener noreferrer'
            >
              {shortenString(receipt.transaction.hash, 10)}
              <img src='/open-tab.svg' width={12} alt='Open in new tab' />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};
 */
