import { useEffect, useMemo, useState } from "react";
import { getLatestGasPrice } from "@mintbase-js/rpc";
import { FT_METHOD_NAMES } from "@mintbase-js/sdk";
import {
  Action,
  FunctionCallAction,
  Transaction,
} from "@near-wallet-selector/core";
import BN from "bn.js";
import { formatNearAmount } from "near-api-js/lib/utils/format";
import { formatUnits } from "viem";
import { ActionCosts } from "../types/transaction";

export const useTxnPrice = (transactions?: Transaction[]) => {
  const [hasBalance, setHasBalance] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const [gasPrice, setGasPrice] = useState<string | undefined>(undefined);
  const [costs, setCosts] = useState<{ deposit: BN; gas: BN }[] | undefined>(
    undefined
  );

  const COSTS: Record<ActionCosts, BN> = {
    CreateAccount: new BN(420000000000), // 0.42 TGas
    Transfer: new BN(450000000000), // 0.45 TGas
    Stake: new BN(50000000000), // 0.50 TGas
    AddFullAccessKey: new BN(420000000000), // 0.42 TGas
    DeleteKey: new BN(410000000000), // 0.41 TGas
  };

  useEffect(() => {
    const definePrice = async () => {
      const currentGasPrice = await getLatestGasPrice(rpcUrl);
      setGasPrice(currentGasPrice.toString());
    };
    if (Number(gasPrice) === 0 && rpcUrl) {
      definePrice();
    }
  }, [gasPrice, rpcUrl]);

  useEffect(() => {
    const defineCosts = () => {
      if (!transactions || transactions.length === 0) return;
      const costs = transactions.map((txn) => {
        const actionCosts: { deposit: BN; gas: BN }[] = txn.actions.map(
          (action: Action) => {
            switch (action.type) {
              case "FunctionCall":
                return {
                  deposit: new BN(action.params.deposit || "0"),
                  gas: new BN(action.params.gas),
                };
              case "Transfer":
                return {
                  deposit: new BN(action.params.deposit || "0"),
                  gas: COSTS[action.type as ActionCosts],
                };
              default:
                return {
                  deposit: new BN("0"),
                  gas: COSTS[action.type as ActionCosts],
                };
            }
          }
        );
        return actionCosts.reduce((acc, x) => ({
          deposit: acc.deposit.add(x.deposit),
          gas: acc.gas.add(x.gas),
        }));
      });

      setCosts(costs);

      const { deposit } = costs.reduce((acc, x) => ({
        deposit: acc.deposit.add(x.deposit),
        gas: acc.gas.add(x.gas),
      }));
      const hasBalance = deposit.lt(balance);

      setHasBalance(hasBalance);
      setLoaded(true);
    };

    if (Number(gasPrice) !== 0 && balance !== undefined) {
      defineCosts();
    }
  }, [gasPrice, balance]);

  const otherTokensAmount = useMemo(() => {
    if (!transactions) return;
    return transactions
      .map((txn) => {
        const functionCallAction = txn.actions.find(
          (action) =>
            action.type === "FunctionCall" &&
            action.params.methodName !== FT_METHOD_NAMES.STORAGE_DEPOSIT
        );
        if (!functionCallAction) return null;
        const args = (functionCallAction as FunctionCallAction)?.params?.args;
        return (
          ("amount" in args &&
            typeof args?.amount === "string" &&
            args?.amount) ||
          null
        );
      })
      .find((amount) => amount !== null);
  }, [transactions]);

  const amount = useMemo(() => {
    if (token) {
      if (token.meta.name === "NEAR") {
        return formatNearAmount(priceState?.price, 6);
      } else {
        return formatUnits(
          BigInt(otherTokensAmount || "0"),
          token.meta.decimals
        ).toString();
      }
    } else {
      const costsAmount =
        costs?.[0]?.deposit &&
        formatNearAmount(costs?.[0]?.deposit.toString(), 3);
      if (
        ["0", "0.000", null, undefined, ""].includes(costsAmount) ||
        isNaN(Number(costsAmount))
      ) {
        return formatNearAmount(otherTokensAmount || "0", 3);
      } else {
        return costsAmount;
      }
    }
  }, [token, priceState.price, otherTokensAmount, costs]);

  const memoizedReturn = useMemo(() => {
    return {
      amount,
      gasPrice,
      hasBalance: !!loaded ? hasBalance : true,
      costs,
      loaded,
      tokenCalculation: tokenUsdCalc,
    };
  }, [amount, gasPrice, hasBalance, costs, loaded, tokenUsdCalc]);

  return memoizedReturn;
};
