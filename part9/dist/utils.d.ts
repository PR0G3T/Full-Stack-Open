/** Returns true if the given argument is not a finite number. */
export declare const isNotNumber: (argument: unknown) => boolean;
/** Parses a string to a finite number or throws a descriptive error. */
export declare const parseNumber: (value: unknown, label: string) => number;
/** Ensures an array contains only finite numbers, returning parsed numbers. */
export declare const parseNumberArray: (values: unknown[], label: string) => number[];
