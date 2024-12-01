import React from "react";
import { formatEther } from "viem";

import {
  NearSafe,
  Network,
  SafeEncodedSignRequest,
  decodeTxData,
} from "near-safe";
import { useWindowSize } from "../../hooks/useWindowSize";
import { dynamicToFixed, shortenString } from "../../lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { Card, CardHeader } from "../ui/card";
import { CopyStandard } from "./CopyStandard";
import { TransactionDetail } from "./TransactionDetail";

export const EvmTxCard = ({
  evmData,
  evmAdapter,
}: {
  evmData?: SafeEncodedSignRequest;
  evmAdapter?: NearSafe;
}) => {
  const { width } = useWindowSize();
  const isMobile = !!width && width < 640;

  if (!evmData || !evmAdapter) return <></>;

  const network = Network.fromChainId(evmData.chainId);
  const decodedData = decodeTxData(evmData);

  return (
    <>
      <div className="mb-8 flex justify-center">
        <Card className="w-full">
          <CardHeader className="border-b border-slate-200 p-4 text-center md:p-6">
            <p className="text-xl font-semibold">EVM Transaction</p>
          </CardHeader>
          <div>
            {decodedData ? (
              <div className="p-6">
                <div className="flex flex-col gap-6 text-sm">
                  <TransactionDetail
                    label="Chain ID"
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
        </Card>
      </div>
    </>
  );
};
