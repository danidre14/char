"use strict";
// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
// https://github.com/dotnet/runtime/blob/master/src/libraries/System.Private.CoreLib/src/System/Char.cs
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSurrogatePair = exports.isLowSurrogate = exports.isHighSurrogate = exports.getNumericValue = exports.getUnicodeCategory = exports.isSymbol = exports.isSurrogate = exports.isSeparator = exports.isControl = exports.isLetterOrDigit = exports.isPunctuation = exports.isLower = exports.isUpper = exports.isWhiteSpace = exports.isLetter = exports.isDigit = exports.getLatin1UnicodeCategory = exports.isAscii = exports.isLatin1 = exports.fromCode = exports.getCode = exports.kMinValue = exports.kMaxValue = void 0;
const CharUnicodeInfo = require("./CharUnicodeInfo");
require("./UnicodeCategory");
// The maximum character value.
exports.kMaxValue = 0xffff;
// The minimum character value.
exports.kMinValue = 0x00;
const kIsWhiteSpaceFlag = 0x80;
const kIsUpperCaseLetterFlag = 0x40;
const kIsLowerCaseLetterFlag = 0x20;
const kUnicodeCategoryMask = 0x1f;
// Contains information about the C0, Basic Latin, C1, and Latin-1 Supplement ranges [ U+0000..U+00FF ], with:
// - 0x80 bit if set means 'is whitespace'
// - 0x40 bit if set means 'is uppercase letter'
// - 0x20 bit if set means 'is lowercase letter'
// - bottom 5 bits are the UnicodeCategory of the character
//
// n.b. This data is locked to an earlier version of the Unicode standard (2.0, perhaps?), so
// the UnicodeCategory data contained here doesn't necessarily reflect the UnicodeCategory data
// contained within the CharUnicodeInfo or Rune types, which generally follow the latest Unicode
// standard.
// prettier-ignore
const kLatin1CharInfo = [
    0x0e, 0x0e, 0x0e, 0x0e, 0x0e, 0x0e, 0x0e, 0x0e, 0x0e, 0x8e, 0x8e, 0x8e, 0x8e, 0x8e, 0x0e, 0x0e,
    0x0e, 0x0e, 0x0e, 0x0e, 0x0e, 0x0e, 0x0e, 0x0e, 0x0e, 0x0e, 0x0e, 0x0e, 0x0e, 0x0e, 0x0e, 0x0e,
    0x8b, 0x18, 0x18, 0x18, 0x1a, 0x18, 0x18, 0x18, 0x14, 0x15, 0x18, 0x19, 0x18, 0x13, 0x18, 0x18,
    0x08, 0x08, 0x08, 0x08, 0x08, 0x08, 0x08, 0x08, 0x08, 0x08, 0x18, 0x18, 0x19, 0x19, 0x19, 0x18,
    0x18, 0x40, 0x40, 0x40, 0x40, 0x40, 0x40, 0x40, 0x40, 0x40, 0x40, 0x40, 0x40, 0x40, 0x40, 0x40,
    0x40, 0x40, 0x40, 0x40, 0x40, 0x40, 0x40, 0x40, 0x40, 0x40, 0x40, 0x14, 0x18, 0x15, 0x1b, 0x12,
    0x1b, 0x21, 0x21, 0x21, 0x21, 0x21, 0x21, 0x21, 0x21, 0x21, 0x21, 0x21, 0x21, 0x21, 0x21, 0x21,
    0x21, 0x21, 0x21, 0x21, 0x21, 0x21, 0x21, 0x21, 0x21, 0x21, 0x21, 0x14, 0x19, 0x15, 0x19, 0x0e,
    0x0e, 0x0e, 0x0e, 0x0e, 0x0e, 0x8e, 0x0e, 0x0e, 0x0e, 0x0e, 0x0e, 0x0e, 0x0e, 0x0e, 0x0e, 0x0e,
    0x0e, 0x0e, 0x0e, 0x0e, 0x0e, 0x0e, 0x0e, 0x0e, 0x0e, 0x0e, 0x0e, 0x0e, 0x0e, 0x0e, 0x0e, 0x0e,
    0x8b, 0x18, 0x1a, 0x1a, 0x1a, 0x1a, 0x1c, 0x1c, 0x1b, 0x1c, 0x21, 0x16, 0x19, 0x13, 0x1c, 0x1b,
    0x1c, 0x19, 0x0a, 0x0a, 0x1b, 0x21, 0x1c, 0x18, 0x1b, 0x0a, 0x21, 0x17, 0x0a, 0x0a, 0x0a, 0x18,
    0x40, 0x40, 0x40, 0x40, 0x40, 0x40, 0x40, 0x40, 0x40, 0x40, 0x40, 0x40, 0x40, 0x40, 0x40, 0x40,
    0x40, 0x40, 0x40, 0x40, 0x40, 0x40, 0x40, 0x19, 0x40, 0x40, 0x40, 0x40, 0x40, 0x40, 0x40, 0x21,
    0x21, 0x21, 0x21, 0x21, 0x21, 0x21, 0x21, 0x21, 0x21, 0x21, 0x21, 0x21, 0x21, 0x21, 0x21, 0x21,
    0x21, 0x21, 0x21, 0x21, 0x21, 0x21, 0x21, 0x19, 0x21, 0x21, 0x21, 0x21, 0x21, 0x21, 0x21, 0x21 // U+00F0..U+00FF
];
/**
 * Returns the code point of a character.
 * @see fromCode
 * @example
 * getCode('a'); // -> 97
 * fromCode(97); // -> 'a'
 *
 * @example
 * getCode('💯'); // -> 128175
 * fromCode(128175); // -> '💯'
 */
function getCode(char) {
    return char.codePointAt(0);
}
exports.getCode = getCode;
/**
 * Returns the character from a code point.
 * @see getCode
 * @example
 * fromCode(97); // -> 'a'
 * getCode('a'); // -> 97
 *
 * @example
 * fromCode(128175); // -> '💯'
 * getCode('💯'); // -> 128175
 */
function fromCode(code) {
    return String.fromCodePoint(code);
}
exports.fromCode = fromCode;
/**
 * Return true for all characters below or equal U+00ff, which is ASCII + Latin-1 Supplement.
 * @param code The code point.
 * @example
 * isLatin('a'); // true
 * isLatin('💯'); // false
 */
function isLatin1(code) {
    return code < kLatin1CharInfo.length;
}
exports.isLatin1 = isLatin1;
// Return true for all characters below or equal U+007f, which is ASCII.
function isAscii(code) {
    return code <= 0x007f;
}
exports.isAscii = isAscii;
// Return the Unicode category for Unicode character <= 0x00ff.
function getLatin1UnicodeCategory(code) {
    return kLatin1CharInfo[code] & kUnicodeCategoryMask;
}
exports.getLatin1UnicodeCategory = getLatin1UnicodeCategory;
/** Returns a boolean indicating whether character c is considered to be a digit. */
const asciiZeroCode = '0'.charCodeAt(0);
const asciiNineCode = '9'.charCodeAt(0);
function isDigit(code) {
    if (isLatin1(code)) {
        return isInRange(code, asciiZeroCode, asciiNineCode);
    }
}
exports.isDigit = isDigit;
function isInRange(code, minimum, maximum) {
    return code - minimum <= maximum - minimum;
}
function checkLetter(category) {
    return isInRange(category, 0 /* UppercaseLetter */, 4 /* OtherLetter */);
}
/** Determines whether a character is a letter. */
function isLetter(code) {
    if (isLatin1(code)) {
        // For the version of the Unicode standard the Char type is locked to, the
        // Latin-1 range doesn't include letters in categories other than "upper" and "lower".
        return (kLatin1CharInfo[code] & (kIsUpperCaseLetterFlag | kIsLowerCaseLetterFlag)) !== 0;
    }
    return checkLetter(CharUnicodeInfo.getUnicodeCategory(code));
}
exports.isLetter = isLetter;
function isWhiteSpaceLatin1(code) {
    return (kLatin1CharInfo[code] & kIsWhiteSpaceFlag) !== 0;
}
/** Determines whether a character is whitespace. */
function isWhiteSpace(code) {
    if (isLatin1(code)) {
        return isWhiteSpaceLatin1(code);
    }
    return CharUnicodeInfo.getIsWhiteSpace(code);
}
exports.isWhiteSpace = isWhiteSpace;
/** Determines whether a character is upper-case. */
function isUpper(code) {
    if (isLatin1(code)) {
        return (kLatin1CharInfo[code] & kIsUpperCaseLetterFlag) !== 0;
    }
    return CharUnicodeInfo.getUnicodeCategory(code) === 0 /* UppercaseLetter */;
}
exports.isUpper = isUpper;
/** Determines whether a character is lower-case. */
function isLower(code) {
    if (isLatin1(code)) {
        return (kLatin1CharInfo[code] & kIsLowerCaseLetterFlag) !== 0;
    }
    return CharUnicodeInfo.getUnicodeCategory(code) === 1 /* LowercaseLetter */;
}
exports.isLower = isLower;
function checkPunctuation(category) {
    return isInRange(category, 18 /* ConnectorPunctuation */, 24 /* OtherPunctuation */);
}
/** Determines whether a character is a punctuation mark.  */
function isPunctuation(code) {
    if (isLatin1(code)) {
        return checkPunctuation(getLatin1UnicodeCategory(code));
    }
    return checkPunctuation(CharUnicodeInfo.getUnicodeCategory(code));
}
exports.isPunctuation = isPunctuation;
function checkLetterOrDigit(category) {
    return checkLetter(category) || category === 8 /* DecimalDigitNumber */;
}
/** Determines whether a character is a letter or a digit. */
function isLetterOrDigit(code) {
    if (isLatin1(code)) {
        return checkLetterOrDigit(getLatin1UnicodeCategory(code));
    }
    return checkLetterOrDigit(CharUnicodeInfo.getUnicodeCategory(code));
}
exports.isLetterOrDigit = isLetterOrDigit;
function isControl(code) {
    // This works because 'code' can never be -1.
    return ((code + 1) & ~0x0080) <= 0x0020;
}
exports.isControl = isControl;
function checkSeparator(category) {
    return isInRange(category, 11 /* SpaceSeparator */, 13 /* ParagraphSeparator */);
}
function isSeparatorLatin1(code) {
    // U+00a0 = NO-BREAK SPACE
    // There is no LineSeparator or ParagraphSeparator in Latin 1 range.
    return code === 0x0020 || code === 0x00a0;
}
function isSeparator(code) {
    if (isLatin1(code)) {
        return isSeparatorLatin1(code);
    }
    return checkSeparator(CharUnicodeInfo.getUnicodeCategory(code));
}
exports.isSeparator = isSeparator;
function isSurrogate(code) {
    return isInRange(code, CharUnicodeInfo.kHighSurrogateStart, CharUnicodeInfo.kLowSurrogateEnd);
}
exports.isSurrogate = isSurrogate;
function checkSymbol(category) {
    return isInRange(category, 25 /* MathSymbol */, 28 /* OtherSymbol */);
}
function isSymbol(code) {
    if (isLatin1(code)) {
        return checkSymbol(getLatin1UnicodeCategory(code));
    }
    return checkSymbol(CharUnicodeInfo.getUnicodeCategory(code));
}
exports.isSymbol = isSymbol;
function getUnicodeCategory(code) {
    if (isLatin1(code)) {
        return getLatin1UnicodeCategory(code);
    }
    return CharUnicodeInfo.getUnicodeCategory(code);
}
exports.getUnicodeCategory = getUnicodeCategory;
function getNumericValue(code) {
    return CharUnicodeInfo.getNumericValue(code);
}
exports.getNumericValue = getNumericValue;
/** Check if a char is a high surrogate. */
function isHighSurrogate(code) {
    return isInRange(code, CharUnicodeInfo.kHighSurrogateStart, CharUnicodeInfo.kHighSurrogateEnd);
}
exports.isHighSurrogate = isHighSurrogate;
/** Check if a char is a low surrogate. */
function isLowSurrogate(code) {
    return isInRange(code, CharUnicodeInfo.kLowSurrogateStart, CharUnicodeInfo.kLowSurrogateEnd);
}
exports.isLowSurrogate = isLowSurrogate;
function isSurrogatePair(highSurrogate, lowSurrogate) {
    // Since both the high and low surrogate ranges are exactly 0x400 elements
    // wide, and since this is a power of two, we can perform a single comparison
    // by baselining each value to the start of its respective range and taking
    // the logical OR of them.
    const highSurrogateOffset = highSurrogate - CharUnicodeInfo.kHighSurrogateStart;
    const lowSurrogateOffset = lowSurrogate - CharUnicodeInfo.kLowSurrogateStart;
    return (highSurrogateOffset | lowSurrogateOffset) <= CharUnicodeInfo.kHighSurrogateRange;
}
exports.isSurrogatePair = isSurrogatePair;
//# sourceMappingURL=Char.js.map