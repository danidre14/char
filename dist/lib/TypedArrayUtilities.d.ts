export declare function endianness(): 'BE' | 'LE';
export declare function readUInt8(array: Uint8Array, offset: number): number;
export declare function readInt8(array: Uint8Array, offset: number): number;
export declare function readUInt16LE(array: Uint8Array, offset: number): number;
declare function readDoubleBackwards(array: Uint8Array, offset: number): number;
export declare const readDoubleLE: typeof readDoubleBackwards;
export {};
//# sourceMappingURL=TypedArrayUtilities.d.ts.map