import { BittePrimitiveName } from "../constants";

export const isBittePrimitiveName = (
  value: unknown
): value is BittePrimitiveName => {
  return Object.values(BittePrimitiveName).includes(
    value as BittePrimitiveName
  );
};
