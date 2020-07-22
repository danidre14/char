import { UnicodeCategory } from './UnicodeCategory';
export declare const kMaxValue = 65535;
export declare const kMinValue = 0;
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
export declare function getCode(char: string): number;
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
export declare function fromCode(code: number): string;
/**
 * Return true for all characters below or equal U+00ff, which is ASCII + Latin-1 Supplement.
 * @param code The code point.
 * @example
 * isLatin('a'); // true
 * isLatin('💯'); // false
 */
export declare function isLatin1(code: number): boolean;
export declare function isAscii(code: number): boolean;
export declare function getLatin1UnicodeCategory(code: number): UnicodeCategory;
export declare function isDigit(code: number): boolean | undefined;
/** Determines whether a character is a letter. */
export declare function isLetter(code: number): boolean;
/** Determines whether a character is whitespace. */
export declare function isWhiteSpace(code: number): boolean;
/** Determines whether a character is upper-case. */
export declare function isUpper(code: number): boolean;
/** Determines whether a character is lower-case. */
export declare function isLower(code: number): boolean;
/** Determines whether a character is a punctuation mark.  */
export declare function isPunctuation(code: number): boolean;
/** Determines whether a character is a letter or a digit. */
export declare function isLetterOrDigit(code: number): boolean;
export declare function isControl(code: number): boolean;
export declare function isSeparator(code: number): boolean;
export declare function isSurrogate(code: number): boolean;
export declare function isSymbol(code: number): boolean;
export declare function getUnicodeCategory(code: number): UnicodeCategory;
export declare function getNumericValue(code: number): number;
/** Check if a char is a high surrogate. */
export declare function isHighSurrogate(code: number): boolean;
/** Check if a char is a low surrogate. */
export declare function isLowSurrogate(code: number): boolean;
export declare function isSurrogatePair(highSurrogate: number, lowSurrogate: number): boolean;
//# sourceMappingURL=Char.d.ts.map