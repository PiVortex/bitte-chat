import { Network } from "@mintbase-js/sdk";

export interface AccountCreationData {
  devicePublicKey: string;
  accountId: string;
  isCreated: boolean;
  txnHash?: string; // TODO - I believe this field is unused.
}

export interface WalletConfig {
  network: Network;
  networkConfig: {
    networkId: Network;
    viewAccountId: Network;
    nodeUrl: string;
    walletUrl: string;
    helperUrl: string;
  };
  relayer: {
    accountId: string;
  };
}
