import { Network } from "near-safe";
import { getNearblocksURL, shortenString } from "../../../lib/utils";

export const TransactionResult = ({
  result: { evm, near },
  accountId,
  textColor,
}: any) => {
  const scanUrl = evm?.txHash
    ? `${Network.fromChainId(evm.txData.chainId).scanUrl}/tx/${evm.txHash}`
    : null;

  return (
    <div className='mt-4'>
      <p className='text-center text-[14px] font-semibold'>
        Transaction success
      </p>
      <div
        className='flex flex-col gap-4 p-6 text-[14px]'
        style={{ color: textColor }}
      >
        {evm?.txHash && scanUrl && (
          <div className='flex items-center justify-between px-6 text-[14px]'>
            <div>EVM Transaction</div>
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
        {near.receipts.map((receipt: any) => (
          <div
            key={receipt.transaction.hash}
            className='flex items-center justify-between px-6 text-[14px]'
          >
            <div>Near Transaction</div>
            <a
              className='flex gap-1'
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
