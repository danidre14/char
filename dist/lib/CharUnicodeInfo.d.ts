import type { UnicodeCategory } from './UnicodeCategory';
export declare const kHighSurrogateStart = 55296;
export declare const kHighSurrogateEnd = 56319;
export declare const kLowSurrogateStart = 56320;
export declare const kLowSurrogateEnd = 57343;
export declare const kHighSurrogateRange = 1023;
export declare function getUnicodeCategory(code: number): UnicodeCategory;
/**
 * Data derived from https://unicode.org/reports/tr44/#White_Space. Represents whether a code point
 * is listed as White_Space per PropList.txt.
 */
export declare function getIsWhiteSpace(code: number): boolean;
/**
 * Data derived from https://www.unicode.org/reports/tr44/#UnicodeData.txt. If Numeric_Type=Decimal
 * or Numeric_Type=Digit or Numeric_Type=Numeric, then retrieves the Numeric_Value for this code point.
 * Otherwise returns -1. This data is encoded in field 8 of UnicodeData.txt.
 */
export declare function getNumericValue(code: number): number;
//# sourceMappingURL=CharUnicodeInfo.d.ts.map