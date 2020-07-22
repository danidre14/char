"use strict";
// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
// https://github.com/dotnet/runtime/blob/master/src/libraries/System.Private.CoreLib/src/System/Globalization/CharUnicodeInfo.cs
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNumericValue = exports.getIsWhiteSpace = exports.getUnicodeCategory = exports.kHighSurrogateRange = exports.kLowSurrogateEnd = exports.kLowSurrogateStart = exports.kHighSurrogateEnd = exports.kHighSurrogateStart = void 0;
const CharUnicodeInfoData_1 = require("./CharUnicodeInfoData");
exports.kHighSurrogateStart = 0xd800;
exports.kHighSurrogateEnd = 0xdbff;
exports.kLowSurrogateStart = 0xdc00;
exports.kLowSurrogateEnd = 0xdfff;
exports.kHighSurrogateRange = 0x03ff;
function getUnicodeCategory(code) {
    return getUnicodeCategoryNoBoundsChecks(code);
}
exports.getUnicodeCategory = getUnicodeCategory;
function getUnicodeCategoryNoBoundsChecks(code) {
    const offset = getCategoryCasingTableOffsetNoBoundsChecks(code);
    // Each entry of the 'CategoriesValues' table uses the low 5 bits to store the UnicodeCategory information.
    return CharUnicodeInfoData_1.categoriesValues[offset] & 0x1f;
}
/**
 * Retrieves the offset into the "CategoryCasing" arrays where this code point's
 * information is stored. Used for getting the Unicode category, bidi information,
 * and whitespace information.
 */
function getCategoryCasingTableOffsetNoBoundsChecks(code) {
    // Get the level index item from the high 11 bits of the code point.
    let index = CharUnicodeInfoData_1.categoryCasingLevel2Index[code >> 9];
    // Get the level 2 WORD offset from the next 5 bits of the code point.
    // This provides the base offset of the level 3 table.
    // Note that & has lower precedence than +, so remember the parens.
    index = CharUnicodeInfoData_1.categoryCasingLevel2Index[(index << 6) + ((code >> 3) & 62)];
    // Get the result from the low 4 bits of the code point.
    // This is the offset into the values table where the data is stored.
    return CharUnicodeInfoData_1.categoryCasingLevel2Index[(index << 4) + (code & 0x0f)];
}
/**
 * Data derived from https://unicode.org/reports/tr44/#White_Space. Represents whether a code point
 * is listed as White_Space per PropList.txt.
 */
function getIsWhiteSpace(code) {
    const offset = getCategoryCasingTableOffsetNoBoundsChecks(code);
    // High bit of each value in the 'CategoriesValues' array denotes whether this code point is white space.
    return CharUnicodeInfoData_1.categoriesValues[offset] < 0;
}
exports.getIsWhiteSpace = getIsWhiteSpace;
/**
 * Data derived from https://www.unicode.org/reports/tr44/#UnicodeData.txt. If Numeric_Type=Decimal
 * or Numeric_Type=Digit or Numeric_Type=Numeric, then retrieves the Numeric_Value for this code point.
 * Otherwise returns -1. This data is encoded in field 8 of UnicodeData.txt.
 */
function getNumericValue(code) {
    return getNumericValueNoBoundsCheck(code);
}
exports.getNumericValue = getNumericValue;
function getNumericValueNoBoundsCheck(code) {
    const offset = getNumericGraphemeTableOffsetNoBoundsChecks(code);
    return CharUnicodeInfoData_1.numericValues[offset * 8];
}
function getNumericGraphemeTableOffsetNoBoundsChecks(code) {
    // Get the level index item from the high 11 bits of the code point.
    let index = CharUnicodeInfoData_1.numericGraphemeLevel1Index[code >> 9];
    // Get the level 2 WORD offset from the next 5 bits of the code point.
    // This provides the base offset of the level 3 table.
    // Note that & has lower precedence than +, so remember the parens.
    index = CharUnicodeInfoData_1.numericGraphemeLevel2Index[(index << 6) + ((code >> 3) & 62)];
    // Get the result from the low 4 bits of the code point.
    // This is the offset into the values table where the data is stored.
    return CharUnicodeInfoData_1.numericGraphemeLevel3Index[(index << 4) + (code & 0x0f)];
}
//# sourceMappingURL=CharUnicodeInfo.js.map