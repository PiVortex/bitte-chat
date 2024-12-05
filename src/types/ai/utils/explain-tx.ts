import { Transaction } from "@near-wallet-selector/core";
import { formatNearAmount } from "./format-near";

//format amounts for LLM to be able to explain
export const formatTransactionActions = (transactions: Transaction[]) => {
  const formattedTxns = transactions.map((txn) => ({
    ...txn,
    actions: txn.actions.map((action) => {
      if (action.type !== "FunctionCall") return action;

      return {
        ...action,
        params: {
          ...action.params,
          gas: formatNearAmount(action.params.gas),
          deposit: action.params.deposit
            ? formatNearAmount(action.params.deposit)
            : "0",
        },
      };
    }),
  }));

  return JSON.stringify(formattedTxns, null, 2);
};

export const buildTxPrompt = (transactions: string, evmData: string) => {
  return `Please analyze and explain these transactions in 1-3 lines:
      For the EVM transaction:
      ${evmData}
      
      The transaction data includes:
      - Destination address (to): Where the transaction is being sent
      - Value being transferred (in native tokens)
      - Transaction data: The encoded function call data
      - Operation type: Whether it's a standard call or delegate call
      
      For each transaction in the batch:
      1. What contract is being interacted with?
      2. What is the network name?
      3. What is the function being called (based on the function signature)?
      4. What is the value being transferred (based on the value amounts converted from hex)?
      5. What are the expected effects/outcomes?
      
      For the NEAR transaction:
      ${transactions}
      
      For each NEAR action:
      - Method being called
      - Arguments being passed
      - Gas allocated
      - Amount of NEAR tokens attached (display as a comma-separated number if over 999, e.g. "1,000 NEAR", with 1 decimal place if less than 1 NEAR, no decimals if whole number, add "NEAR" suffix, none if zero, considering NEAR's 24 decimal places)
      
      Please provide a concise explanation of what the transaction does, avoiding phrases like "trying to" or "potentially". Focus on the direct effects and outcomes.
      
      Please provide:
      1. A clear explanation of what each transaction is trying to accomplish
      2. The expected outcome and impact
      3. Any notable interactions between the EVM and NEAR transactions if the evm transaction is empty dont mention this at all exclude this point completely
      
      For transactions involving the v1signer contract on NEAR, briefly note in a couple of words that it enables MPC signing but focus primarily on explaining the EVM transaction's purpose and effects on the target chain.
      If the EVM transaction is a 0x data transaction its most likely to trigger a deployment of a SAFE on the particular chain ID, only mention this in that case.
      Give 1-3 lines of specific simple explanation about the transactions details and its effects, phrase it without bullets.
      Keep the response concise - aim for 2-3 lines.
      `;
};
