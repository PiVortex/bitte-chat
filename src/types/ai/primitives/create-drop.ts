/* import { FunctionCallAction } from "@near-wallet-selector/core";

import { read } from "@/src/lib/actions/firestore";
import {
  createTokenDrop,
  createTokenDropOwner,
  updateTokenDropOwner,
} from "@/src/lib/actions/token-drops";
import { BitteTool } from "@/src/lib/ai/types";
import {
  DROPS_OPEN_CONTRACT,
  DROPS_PROXY_CONTRACT,
} from "@/src/lib/constants/contracts";
import { TokenDropsOwned } from "@/src/lib/types/token-drops";
import { generateDropSlug } from "@/src/lib/utils/token-drops/misc";

type CreateDrop = {
  accountId: string;
  title: string;
  description: string;
  mediaHash: string;
};

export const createDrop: BitteTool<CreateDrop, string> = {
  toolSpec: {
    function: {
      name: "create-drop",
      description: `Creates an NFT drop with a previous generated image. If not image was generated, ask the user to do so before proceeding with creating a drop. If the user does not provide a title and description, you can generate those based on the conversation.`,
      parameters: {
        type: "object",
        properties: {
          accountId: {
            type: "string",
            description: "Account ID of the user.",
          },
          mediaHash: {
            type: "string",
            description:
              "Media hash. It should always use the hash from the generated image.",
          },
          title: {
            type: "string",
            description:
              "Title. ALWAYS generate it, if the user does not provide it.",
          },
          description: {
            type: "string",
            description:
              "Description. ALWAYS generate it, if the user does not provide it.",
          },
        },
        required: ["accountId", "mediaHash", "title", "description"],
      },
    },
    type: "function",
  },
  execute: async ({ mediaHash, title, description, accountId }) => {
    try {
      const dropId = generateDropSlug({
        title,
        accountId,
      });

      const action: FunctionCallAction = {
        type: "FunctionCall",
        params: {
          methodName: "mint",
          args: {
            metadata: JSON.stringify({
              media: mediaHash,
              title: title,
              id: dropId,
              description: description,
            }),
            nft_contract_id: DROPS_OPEN_CONTRACT,
          },
          gas: "200000000000000",
          deposit: "14500000000000000000000",
        },
      };

      const txArgs = encodeURIComponent(
        JSON.stringify({
          receiverId: DROPS_PROXY_CONTRACT,
          actions: [action],
        })
      );

      await createTokenDrop({
        transactionUrl: `[${txArgs}]`,
        id: dropId,
        creator: accountId,
        description: description,
        name: title,
        contract_id: DROPS_OPEN_CONTRACT,
        media: mediaHash,
        enabled: true,
        total_minted: 0,
        proxy: DROPS_PROXY_CONTRACT,
      });

      const responseUserOwnedDrops = await read<TokenDropsOwned>(
        "dropOwners",
        accountId
      );

      const hasDrops = (responseUserOwnedDrops?.drops?.length ?? 0) > 0;

      // update or create token drop owner in the database
      hasDrops
        ? await updateTokenDropOwner({
            id: dropId,
            creator: accountId,
          })
        : await createTokenDropOwner({
            id: dropId,
            creator: accountId,
          });

      return {
        data: dropId,
        warnings: null,
        error: null,
      };
    } catch (error) {
      return {
        data: null,
        warnings: null,
        error:
          error instanceof Error
            ? error
            : new Error(`Error Crating Drop: ${JSON.stringify(error)}`),
      };
    }
  },
};
 */