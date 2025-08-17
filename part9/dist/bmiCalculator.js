"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateBmi = void 0;
var utils_1 = require("./utils");
// BMI categories use WHO standard ranges
// Underweight < 18.5, Normal 18.5–24.9, Overweight 25–29.9, Obese >= 30
var calculateBmi = function (heightCm, weightKg) {
    if (heightCm <= 0)
        throw new Error('Height must be greater than 0');
    if (weightKg <= 0)
        throw new Error('Weight must be greater than 0');
    var heightM = heightCm / 100;
    var bmi = weightKg / (heightM * heightM);
    if (bmi < 18.5)
        return 'Underweight';
    if (bmi < 25)
        return 'Normal range';
    if (bmi < 30)
        return 'Overweight';
    return 'Obese';
};
exports.calculateBmi = calculateBmi;
// CLI entry
if (require.main === module) {
    try {
        var _a = process.argv, a = _a[2], b = _a[3];
        if (!a || !b) {
            throw new Error('Usage: ts-node part9/bmiCalculator.ts <height_cm> <weight_kg>');
        }
        var height = (0, utils_1.parseNumber)(a, 'height');
        var weight = (0, utils_1.parseNumber)(b, 'weight');
        console.log((0, exports.calculateBmi)(height, weight));
    }
    catch (err) {
        if (err instanceof Error) {
            console.error('Error:', err.message);
            process.exit(1);
        }
        else {
            console.error('Unknown error');
            process.exit(1);
        }
    }
}
