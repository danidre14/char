"use strict";
// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
// https://github.com/dotnet/runtime/blob/master/src/libraries/System.Private.CoreLib/src/System/Globalization/CharUnicodeInfo.cs
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNumericValue = exports.getIsWhiteSpace = exports.getUnicodeCategory = exports.kHighSurrogateRange = exports.kLowSurrogateEnd = exports.kLowSurrogateStart = exports.kHighSurrogateEnd = exports.kHighSurrogateStart = void 0;
const CategoriesValues_1 = require("./CharUnicodeInfo/CategoriesValues");
const CategoryCasingDataLevel1_1 = require("./CharUnicodeInfo/CategoryCasingDataLevel1");
const CategoryCasingDataLevel2_1 = require("./CharUnicodeInfo/CategoryCasingDataLevel2");
const CategoryCasingDataLevel3_1 = require("./CharUnicodeInfo/CategoryCasingDataLevel3");
const NumericGrapheneDataLevel1_1 = require("./CharUnicodeInfo/NumericGrapheneDataLevel1");
const NumericGrapheneDataLevel2_1 = require("./CharUnicodeInfo/NumericGrapheneDataLevel2");
const NumericGrapheneDataLevel3_1 = require("./CharUnicodeInfo/NumericGrapheneDataLevel3");
const NumericValues_1 = require("./CharUnicodeInfo/NumericValues");
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
    return CategoriesValues_1.categoriesValues.readUInt8(offset) & 0x1f;
}
/**
 * Retrieves the offset into the "CategoryCasing" arrays where this code point's
 * information is stored. Used for getting the Unicode category, bidi information,
 * and whitespace information.
 */
function getCategoryCasingTableOffsetNoBoundsChecks(code) {
    // Get the level index item from the high 11 bits of the code point.
    let index = CategoryCasingDataLevel1_1.categoryCasingLevel1Index.readUInt8(code >> 9);
    // Get the level 2 WORD offset from the next 5 bits of the code point.
    // This provides the base offset of the level 3 table.
    // Note that & has lower precedence than +, so remember the parens.
    index = CategoryCasingDataLevel2_1.categoryCasingLevel2Index.readUInt16LE((index << 6) + ((code >> 3) & 62));
    // Get the result from the low 4 bits of the code point.
    // This is the offset into the values table where the data is stored.
    return CategoryCasingDataLevel3_1.categoryCasingLevel3Index.readUInt8((index << 4) + (code & 0x0f));
}
/**
 * Data derived from https://unicode.org/reports/tr44/#White_Space. Represents whether a code point
 * is listed as White_Space per PropList.txt.
 */
function getIsWhiteSpace(code) {
    const offset = getCategoryCasingTableOffsetNoBoundsChecks(code);
    // High bit of each value in the 'CategoriesValues' array denotes whether this code point is white space.
    return CategoriesValues_1.categoriesValues.readInt8(offset) < 0;
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
    return NumericValues_1.numericValues.readDoubleLE(offset * 8);
}
function getNumericGraphemeTableOffsetNoBoundsChecks(code) {
    // Get the level index item from the high 11 bits of the code point.
    let index = NumericGrapheneDataLevel1_1.numericGraphemeLevel1Index.readUInt8(code >> 9);
    // Get the level 2 WORD offset from the next 5 bits of the code point.
    // This provides the base offset of the level 3 table.
    // Note that & has lower precedence than +, so remember the parens.
    index = NumericGrapheneDataLevel2_1.numericGraphemeLevel2Index.readUInt16LE((index << 6) + ((code >> 3) & 62));
    // Get the result from the low 4 bits of the code point.
    // This is the offset into the values table where the data is stored.
    return NumericGrapheneDataLevel3_1.numericGraphemeLevel3Index.readUInt8((index << 4) + (code & 0x0f));
}
//# sourceMappingURL=CharUnicodeInfo.js.map