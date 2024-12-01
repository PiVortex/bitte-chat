/* import { generateImageOpenAi } from "@/src/lib/actions/openai";
import { BitteTool, GenerateImageResponse } from "@/src/lib/ai/types";

export const generateImage: BitteTool<
  { prompt: string },
  GenerateImageResponse
> = {
  toolSpec: {
    function: {
      name: "generate-image",
      description:
        "Generates an image, uploads it to Arweave, and displays it for the user.",
      parameters: {
        type: "object",
        required: ["prompt"],
        properties: {
          prompt: {
            type: "string",
            description: "Prompt for the image generation",
          },
        },
      },
    },
    type: "function",
  },
  execute: async ({ prompt }) => {
    try {
      return {
        data: await generateImageOpenAi(prompt),
        warnings: [],
        error: null,
      };
    } catch (error) {
      return {
        data: null,
        warnings: [],
        error:
          error instanceof Error
            ? error
            : new Error(`Error generating image: ${JSON.stringify(error)}`),
      };
    }
  },
};
 */