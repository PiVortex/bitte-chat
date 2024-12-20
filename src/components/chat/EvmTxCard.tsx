"use client";
import React, { useState, useEffect } from "react";
import { formatEther } from "viem";
import { Network, SafeEncodedSignRequest, decodeTxData } from "near-safe";
import { useWindowSize } from "../../hooks/useWindowSize";
import { dynamicToFixed, shortenString } from "../../lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { Card, CardHeader, CardFooter } from "../ui/card";
import { CopyStandard } from "./CopyStandard";
import { TransactionDetail } from "./TransactionDetail";
import { Button } from "../ui/button";
import { useAccount } from "../AccountContext";
import LoadingMessage from "./LoadingMessage";
import { TransactionResult } from "./TransactionResult";
import { useTransaction } from "../../hooks/useTransaction";

export const EvmTxCard = ({
  evmData,
}: {
  evmData?: SafeEncodedSignRequest;
}) => {
  const { width } = useWindowSize();
  const isMobile = !!width && width < 640;
  const [errorMsg, setErrorMsg] = useState("");
  const [result, setResult] = useState<any>();
  const [isLoading, setIsLoading] = useState(false);
  const { evmAddress, evmWallet } = useAccount();

  useEffect(() => {
    if (!isLoading || !evmWallet) return;

    const checkHash = () => {
      if (evmWallet.hash) {
        setResult({ hash: evmWallet.hash });
        setIsLoading(false);
      }
    };

    checkHash();
    const intervalId = setInterval(checkHash, 1000);
    return () => clearInterval(intervalId);
  }, [isLoading, evmWallet]);

  if (!evmData)
    return (
      <p className='my-6 overflow-auto text-center'>
        Unable to create evm transaction.
      </p>
    );

  const network = Network.fromChainId(evmData.chainId);
  const decodedData = decodeTxData(evmData);
  const { handleTxn } = useTransaction({ evmWallet: evmWallet });

  const handleSmartAction = async () => {
    setIsLoading(true);
    try {
      console.log("Handling EVM transaction...", decodedData);
      await handleTxn({ evmData: decodedData });
    } catch (error: any) {
      setErrorMsg(error.message);
    }
  };

  return (
    <>
      <div className='mb-8 flex justify-center'>
        <Card className='w-full'>
          <CardHeader className='border-b border-slate-200 p-4 text-center md:p-6'>
            <p className='text-xl font-semibold'>EVM Transaction</p>
          </CardHeader>
          <div>
            {decodedData ? (
              <div className='p-6'>
                <div className='flex flex-col gap-6 text-sm'>
                  <TransactionDetail
                    label='Chain ID'
                    value={shortenString(
                      decodedData.chainId.toString(),
                      isMobile ? 13 : 21
                    )}
                  />
                  <TransactionDetail label="Network" value={network.name} />
                  <TransactionDetail
                    label="Estimated Fees"
                    value={dynamicToFixed(Number(decodedData.costEstimate), 5)}
                  />
                  {/* TXN MAP ACCORDION */}
                  <Accordion
                    type="single"
                    collapsible
                    defaultValue="transaction-0"
                  >
                    {decodedData.transactions.map((transaction, index) => (
                      <AccordionItem
                        key={transaction.to}
                        value={`transaction-${index}`}
                        className="border-0"
                      >
                        <AccordionTrigger className="pt-0 hover:no-underline">
                          <div className="flex items-center justify-between text-sm">
                            <p className="text-text-secondary">
                              Transaction {index + 1}
                            </p>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="flex flex-col gap-6 border-0">
                          {!!transaction.to && (
                            <TransactionDetail
                              label="To"
                              className="-mr-2.5"
                              value={
                                <CopyStandard
                                  text={transaction.to}
                                  textSize="sm"
                                  textColor="gray-800"
                                  charSize={isMobile ? 7 : 12}
                                />
                              }
                            />
                          )}
                          <TransactionDetail
                            label="Value"
                            value={formatEther(
                              BigInt(transaction.value || "0")
                            )}
                          />
                          <TransactionDetail
                            label="Data"
                            value={
                              <CopyStandard
                                text={transaction.data || "0x"}
                                textSize="sm"
                                textColor="gray-800"
                                charSize={isMobile ? 10 : 15}
                              />
                            }
                          />
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              </div>
            ) : null}
          </div>

          {errorMsg && !isLoading ? (
            <div className='flex flex-col items-center gap-4 px-6 pb-6 text-center text-sm'>
              <p className='text-red-300'>
                An error occurred trying to execute your transaction: {errorMsg}
                .
              </p>
              <Button
                className='w-1/2'
                variant='outline'
                onClick={() => {
                  setErrorMsg("");
                }}
              >
                Dismiss
              </Button>
            </div>
          ) : null}

          {isLoading ? <LoadingMessage /> : null}
          {result && !isLoading ? (
            <TransactionResult
              result={result}
              accountId={evmAddress}
              textColor='text-gray-800'
            />
          ) : null}
          {!isLoading && !result && !errorMsg && evmAddress ? (
            <CardFooter className='flex items-center gap-6'>
              <>
                <Button variant='outline' className='w-1/2'>
                  Decline
                </Button>

                <Button className='w-1/2' onClick={handleSmartAction}>
                  Approve
                </Button>
              </>
            </CardFooter>
          ) : null}
        </Card>
      </div>
    </>
  );
};
