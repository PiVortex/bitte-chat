/* import { NextRequest } from "next/server";
import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomUUID,
} from "node:crypto";

import { read } from "@/src/lib/actions/firestore";

import { API_KEYS_COLLECTION } from "@/src/lib/ai/constants";
import { AI_ENCRYPTION_KEY } from "@/src/lib/constants/config-server";

// Function to derive a 32-byte key from any string
const deriveKey = (input: string) => {
  return createHash("sha256").update(input).digest();
};

const ENCRYPTION_KEY = deriveKey(AI_ENCRYPTION_KEY);
const IV = ENCRYPTION_KEY.subarray(0, 16); // Use first 16 bytes of the key as IV

export const generateApiKey = () => {
  return randomUUID();
};

export const encryptApiKey = (apiKey: string) => {
  const cipher = createCipheriv("aes-256-cbc", ENCRYPTION_KEY, IV);
  let encrypted = cipher.update(apiKey, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
};

export const decryptApiKey = (encryptedApiKey: string) => {
  const decipher = createDecipheriv("aes-256-cbc", ENCRYPTION_KEY, IV);
  let decrypted = decipher.update(encryptedApiKey, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
};

// Helper function to validate API key
export const validateApiKey = async (
  req: NextRequest,
  pluginUrl: string
): Promise<{ error: string; status: number } | null> => {
  const bitteApiKey = req.headers.get("bitte-api-key");
  if (!bitteApiKey) {
    return { error: "Unauthorized, missing bitte-api-key", status: 401 };
  }

  const apiKeyDoc = await read<{ encryptedApiKey: string }>(
    API_KEYS_COLLECTION,
    pluginUrl
  );
  const encryptedDbApiKey = apiKeyDoc?.encryptedApiKey;

  if (!encryptedDbApiKey) {
    return { error: "No API key found for this plugin", status: 400 };
  }

  const encryptedProvidedApiKey = encryptApiKey(bitteApiKey);

  if (encryptedProvidedApiKey !== encryptedDbApiKey) {
    return { error: "Unauthorized, invalid bitte-api-key", status: 401 };
  }

  return null; // Validation successful
};
 */