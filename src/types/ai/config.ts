"server-only";

import { createAnthropic } from "@ai-sdk/anthropic";
import { createOpenAI } from "@ai-sdk/openai";
import { createXai } from "@ai-sdk/xai";
import { OpenAI } from "openai";
import { Model } from "../types";

// OpenAI SDK
export const openai = new OpenAI();

// AI SDK
const openaiProvider = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
const anthropicProvider = createAnthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});
const xaiProvider = createXai({
  apiKey: process.env.XAI_API_KEY,
});

export const modelGPT4o = openaiProvider("gpt-4o");
export const sonnet = anthropicProvider("claude-3-5-sonnet-latest");
export const grok2 = xaiProvider("grok-beta");

export const getModel = (model: string) => {
  switch (model) {
    case Model.GPT4o:
      return modelGPT4o;
    case Model.Grok2:
      return grok2;
    case Model.Sonnet:
      return sonnet;
    default:
      return modelGPT4o;
  }
};
