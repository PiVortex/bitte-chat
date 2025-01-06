export const SUGGESTED_PROMPTS = [
  // NFTs, Generative Art
  {
    title: "Free NFT Mint",
    subtitle: "launch a digital asset",
    prompt: "Design and mint an NFT that represents digital ownership on NEAR",
  },
  {
    title: "Generative AI",
    subtitle: "craft an image and backstory",
    prompt: "Generate a cyberpunk character NFT with a backstory set in 2150",
  },
  {
    title: "Batch Mint NFTs",
    subtitle: "scale your art",
    prompt:
      "Generate and batch mint a collection of 3 NFTs inspired by constellations",
  },
  // Drops
  {
    title: "Create a Token Drop",
    subtitle: "of a dystopian movie poster",
    prompt:
      "Design a dystopian movie poster featuring 'Bitte' in bold lettering and create a drop link for it",
  },
  {
    title: "NFT Drop Quiz",
    subtitle: "your art, your rules",
    prompt:
      "Create a quiz for me to determine the NFT drop I will launch. Create a profile and theme for the drop based on my answers, then deploy the drop",
  },
  {
    title: "Craft a Unique Drop",
    subtitle: "make it stand out",
    prompt:
      "Create an NFT drop that combines AI-generated art with a unique story",
  },
  // NFT's Marketplace
  {
    title: "Shop NFTs",
    subtitle: "start collecting",
    prompt: "Show me the current trending NFTs in Bitte's marketplace?",
  },
  {
    title: "List NFT for Sale",
    subtitle: "on the marketplace",
    prompt: "Guide me through listing my NFT on Bitte's marketplace",
  },
  {
    title: "NFT Listings",
    subtitle: "browse new listings",
    prompt: "Show me recent NFT listings",
  },
  // Token Swaps / Ref.Finance
  {
    title: "Swap NEAR",
    subtitle: "for USDT",
    prompt: "Swap .01 NEAR for USDT using Ref.Finance",
  },
  {
    title: "Token Info",
    subtitle: "get token details",
    prompt: "Get the latest token details for Nearvidia on Ref.Finance",
  },
  {
    title: "Swap NEAR",
    subtitle: "for NEARVIDIA",
    prompt: "Swap .01 NEAR for NEARVIDIA",
  },
  {
    title: "Swap USDC",
    subtitle: "for NEAR",
    prompt: "Swap .01 USDC for NEAR",
  },
  // Wallet & Account
  {
    title: "Wallet Overview",
    subtitle: "summarize current assets",
    prompt: "Provide an overview of my assets on NEAR",
  },
  {
    title: "nate.near",
    subtitle: "explore NFT holdings",
    prompt: "Show me the NFT holdings of nate.near",
  },
  // Data Queries
  {
    title: "ICC Fan Passport",
    subtitle: "collection activity",
    prompt:
      "Show me recent activity for this collection: icc_fan_passport.near",
  },
  {
    title: "Generate NFT Report",
    subtitle: "create an NFT overview",
    prompt:
      "Generate a report on NFT minting activity by microchipgnu.near. Show the last 5 NFTs minted",
  },
];

export const RPC_URL = "https://rpc.mainnet.near.org";

export const OPEN_API_SPEC_PATH = ".well-known/ai-plugin.json";

export const PLUGINS_COLLECTION = "ai-plugins";
export const ASSISTANTS_COLLECTION = "ai-assistants";
export const TOOLS_COLLECTION = "ai-tools";
export const API_KEYS_COLLECTION = "ai-api-keys";

export const DEFAULT_MODEL = "gpt-4o";
export const DEFAULT_ASSISTANT_ID = "asst_9akhoUCRuq2fi36e1aSDVv4e";
export const DEFAULT_AGENT_ID = "bitte-assistant";
export const DISCOVERY_ASSISTANT_ID = "asst_5mlinuGadyp8PiI8203Uvh3C";
export const DISCOVERY_VECTOR_STORE_ID = "vs_iv6JjMEYtBVnQ91MVqS0PwTs";

export const PLUGINS_OAI_VECTOR_STORE = "oai-vector-store-ai-plugins";
export const ASSISTANTS_OAI_VECTOR_STORE = "oai-vector-store-ai-assistants";
export const TOOLS_OAI_VECTOR_STORE = "oai-vector-store-ai-tools";

export enum BittePrimitiveName {
  TRANSFER_FT = "transfer-ft",
  GENERATE_TRANSACTION = "generate-transaction",
  SUBMIT_QUERY = "submit-query",
  GENERATE_IMAGE = "generate-image",
  CREATE_DROP = "create-drop",
  GET_SWAP_TRANSACTIONS = "getSwapTransactions",
  GET_TOKEN_METADATA = "getTokenMetadata",
  GENERATE_EVM_TX = "generate-evm-tx",
}
