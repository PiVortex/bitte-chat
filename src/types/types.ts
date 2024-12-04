import { ReactNode } from "react";

import {
  FunctionCallAction,
  Transaction,
  TransferAction,
} from "@near-wallet-selector/core";
import { CoreMessage, CoreTool, JSONValue, Message } from "ai";
import { AssistantTool, FunctionTool } from "openai/resources/beta/assistants";
import { FunctionDefinition } from "openai/resources/index";
import { OpenAPIV3 } from "openapi-types";

import { NearSafe } from "near-safe";
import { Hex } from "viem";
import { AccountCreationData, WalletConfig } from "./wallet";
import { BittePrimitiveName } from "./ai/constants";

export type BitteMetadata = {
  [key: string]: unknown;
};

export type BittePrimitiveRef = {
  type: string;
};

export type BitteOpenAPISpec = OpenAPIV3.Document & {
  "x-mb": {
    "account-id": string;
    assistant?: Pick<
      BitteAssistantConfig,
      "name" | "description" | "instructions" | "tools" | "image"
    > & {
      tools?: (AssistantTool | BittePrimitiveRef)[];
    };
  };
};

export type ExecutionDefinition = {
  baseUrl: string;
  path: string;
  httpMethod: string;
};

export type PluginToolSpec = {
  id: string;
  agentId: string;
  type: "function";
  function: FunctionDefinition;
  execution: ExecutionDefinition;
  verified: boolean;
};

export type BitteToolSpec = PluginToolSpec | FunctionTool;

export type BitteToolWarning = {
  message: string;
  final: boolean;
};

export type BitteToolResult<TResult = unknown> = {
  data: TResult | null;
  warnings: BitteToolWarning[] | null;
  error: Error | null;
};

export type BitteToolExecutor<
  TArgs = Record<string, JSONValue>,
  TResult = unknown
> = (
  args: TArgs,
  metadata?: BitteMetadata
) => Promise<BitteToolResult<TResult>>;

export type BitteToolRenderer<TArgs = unknown> = (
  args: TArgs,
  metadata?: BitteMetadata
) => ReactNode | null;

export type BitteTool<TArgs = Record<string, JSONValue>, TResult = unknown> = {
  toolSpec: FunctionTool;
  execute: BitteToolExecutor<TArgs, TResult>;
  render?: BitteToolRenderer;
};

// TODO: Remove this once we have a better way to handle this.
export type AnyBitteTool = BitteTool<any>; // eslint-disable-line @typescript-eslint/no-explicit-any

export type BitteAssistantConfig = {
  id: string;
  name: string;
  accountId: string;
  description: string;
  instructions: string;
  verified: boolean;
  tools?: BitteToolSpec[];
  image?: string;
};

export type BitteAssistant = Omit<BitteAssistantConfig, "tools"> & {
  toolSpecs?: FunctionTool[];
  tools?: Record<string, CoreTool>;
};

export type FunctionDataMessage = {
  functionName: BittePrimitiveName | string;
  isPrimitive: boolean;
  description?: string;
  value: JSONValue;
};

export type SmartAction = {
  id: string;
  agentId: string;
  message: string;
  creator: string;
  createdAt: number;
};

export type SmartActionMessage = CoreMessage & {
  id?: string;
  agentId?: string;
};

export type SmartActionAiMessage = Message & {
  id?: string;
  agentId?: string;
};

export type SmartActionChat = SmartAction & {
  messages: SmartActionMessage[];
};

export type SaveSmartAction = {
  agentId: string;
  creator: string;
  message: string;
};

export type SaveSmartActionMessages = {
  id: string;
  agentId: string;
  creator: string;
  messages: SmartActionMessage[];
};

type TransferTransaction = Omit<Transaction, "actions"> & {
  actions: Array<TransferAction>;
};

export type AccountTransaction = Omit<Transaction, "actions"> & {
  actions: Array<FunctionCallAction | TransferAction>;
};

export type SmartActionTransaction =
  | {
      args: Record<string, unknown> | string;
      contractName: string;
      deposit: string;
      gas: string;
      methodName: string;
    }
  | TransferTransaction;

export enum AssistantsMode {
  DEFAULT = "default",
  DEBUG = "debug",
}

export enum Model {
  GPT4o = "gpt4o",
  Grok2 = "grok2",
  Sonnet = "sonnet",
}

export type ChatComponentColors = {
  generalBackground?: string;
  messageBackground?: string;
  textColor?: string;
  buttonColor?: string;
  borderColor?: string;
};

export interface BitteAiChatProps {
  agentData: BitteAssistantConfig;
  messages?: Message[];
  id?: string;
  creator?: string;
  prompt?: string;
  isPlayground?: boolean;
  model?: string;
  isShare?: boolean;
  isDefault?: boolean;
  openAgentSelector: () => void;
  walletInfo: WalletInfo;
  walletConfig: WalletConfig;
  colors: ChatComponentColors;
}

export type SelectedAgent = {
  id?: string;
  name?: string;
};

export interface AssistantsRequestBody {
  threadId: string | null;
  message: string;
  accountData?: AccountCreationData;
  walletConfig: WalletConfig;
  kvId: string;
  config?: {
    mode?: AssistantsMode;
    agentId?: string;
  };
}

export interface ChatRequestBody {
  id?: string;
  config?: {
    mode?: string;
    agentId?: string;
    model?: string;
  };
  accountData?: AccountCreationData;
  walletConfig?: WalletConfig;
  evmAddress?: Hex;
}

export type AllowlistedToken = {
  name: string;
  symbol: string;
  contractId: string;
  decimals: number;
  icon?: string;
};

export type GenerateImageResponse = {
  url: string;
  hash: string;
};

export type WalletInfo = {
  accountData: AccountCreationData;
  isLoading: boolean;
  isConnected: boolean;
  evmAdapter: NearSafe;
};
