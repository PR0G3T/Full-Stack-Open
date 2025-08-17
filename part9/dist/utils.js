"use strict";
// Utility helpers shared by CLI programs
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseNumberArray = exports.parseNumber = exports.isNotNumber = void 0;
/** Returns true if the given argument is not a finite number. */
var isNotNumber = function (argument) {
    if (typeof argument === 'number')
        return !Number.isFinite(argument);
    var n = Number(argument);
    return Number.isNaN(n) || !Number.isFinite(n);
};
exports.isNotNumber = isNotNumber;
/** Parses a string to a finite number or throws a descriptive error. */
var parseNumber = function (value, label) {
    if ((0, exports.isNotNumber)(value)) {
        throw new Error("Invalid ".concat(label, ": expected a number, got '").concat(String(value), "'"));
    }
    return Number(value);
};
exports.parseNumber = parseNumber;
/** Ensures an array contains only finite numbers, returning parsed numbers. */
var parseNumberArray = function (values, label) {
    try {
        return values.map(function (v, i) { return (0, exports.parseNumber)(v, "".concat(label, "[").concat(i, "]")); });
    }
    catch (err) {
        throw err;
    }
};
exports.parseNumberArray = parseNumberArray;
