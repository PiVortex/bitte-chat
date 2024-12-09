// from https://github.com/near/near-api-js/blob/9cb7e89a688304fdd439411e2854235c358f4ab7/packages/utils/src/format.ts#L32

/**
 * Exponent for calculating how many indivisible units are there in one NEAR. See {@link NEAR_NOMINATION}.
 */
export const NEAR_NOMINATION_EXP = 24;

/**
 * Number of indivisible units in one NEAR. Derived from {@link NEAR_NOMINATION_EXP}.
 */
export const NEAR_NOMINATION = 10n ** BigInt(NEAR_NOMINATION_EXP);

// Pre-calculate offsets used for rounding to different number of digits
const ROUNDING_OFFSETS: bigint[] = [];
const BN10 = 10n;
for (
  let i = 0, offset = 5n;
  i < NEAR_NOMINATION_EXP;
  i++, offset = offset * BN10
) {
  ROUNDING_OFFSETS[i] = offset;
}

/**
 * Convert account balance value from internal indivisible units to NEAR. 1 NEAR is defined by {@link NEAR_NOMINATION}.
 * Effectively this divides given amount by {@link NEAR_NOMINATION}.
 *
 * @param balance decimal string representing balance in smallest non-divisible NEAR units (as specified by {@link NEAR_NOMINATION})
 * @param fracDigits number of fractional digits to preserve in formatted string. Balance is rounded to match given number of digits.
 * @returns Value in Ⓝ
 */
export function formatNearAmount(
  balance: string,
  fracDigits: number = NEAR_NOMINATION_EXP
): string {
  let balanceBN = BigInt(balance);
  if (fracDigits !== NEAR_NOMINATION_EXP) {
    // Adjust balance for rounding at given number of digits
    const roundingExp = NEAR_NOMINATION_EXP - fracDigits - 1;
    if (roundingExp > 0) {
      balanceBN += ROUNDING_OFFSETS[roundingExp];
    }
  }

  balance = balanceBN.toString();
  const wholeStr =
    balance.substring(0, balance.length - NEAR_NOMINATION_EXP) || "0";
  const fractionStr = balance
    .substring(balance.length - NEAR_NOMINATION_EXP)
    .padStart(NEAR_NOMINATION_EXP, "0")
    .substring(0, fracDigits);

  return trimTrailingZeroes(`${formatWithCommas(wholeStr)}.${fractionStr}`);
}

/**
 * Removes .000… from an input
 * @param value A value that may contain trailing zeroes in the decimals place
 * @returns string The value without the trailing zeros
 */
function trimTrailingZeroes(value: string): string {
  return value.replace(/\.?0*$/, "");
}

/**
 * Returns a human-readable value with commas
 * @param value A value that may not contain commas
 * @returns string A value with commas
 */
function formatWithCommas(value: string): string {
  const pattern = /(-?\d+)(\d{3})/;
  while (pattern.test(value)) {
    value = value.replace(pattern, "$1,$2");
  }
  return value;
}
