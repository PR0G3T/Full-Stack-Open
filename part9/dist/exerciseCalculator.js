"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateExercises = void 0;
var utils_1 = require("./utils");
var calculateExercises = function (dailyHours, target) {
    if (!Array.isArray(dailyHours) || dailyHours.length === 0) {
        throw new Error('dailyHours must be a non-empty array of numbers');
    }
    if (target <= 0)
        throw new Error('target must be greater than 0');
    var periodLength = dailyHours.length;
    var trainingDays = dailyHours.filter(function (h) { return h > 0; }).length;
    var totalHours = dailyHours.reduce(function (sum, h) { return sum + h; }, 0);
    var average = totalHours / periodLength;
    var success = average >= target;
    // Simple rating schema
    // 3: average >= target
    // 2: average >= 0.75 * target
    // 1: otherwise
    var rating = 1;
    var ratingDescription = 'You need to work harder';
    if (average >= target) {
        rating = 3;
        ratingDescription = 'Great job!';
    }
    else if (average >= target * 0.75) {
        rating = 2;
        ratingDescription = 'not too bad but could be better';
    }
    return {
        periodLength: periodLength,
        trainingDays: trainingDays,
        success: success,
        rating: rating,
        ratingDescription: ratingDescription,
        target: target,
        average: average,
    };
};
exports.calculateExercises = calculateExercises;
// CLI entry
if (require.main === module) {
    try {
        var args = process.argv.slice(2);
        if (args.length < 2) {
            throw new Error('Usage: ts-node part9/exerciseCalculator.ts <target> <d1> <d2> ... <dn>');
        }
        var target = (0, utils_1.parseNumber)(args[0], 'target');
        var hours = (0, utils_1.parseNumberArray)(args.slice(1), 'dailyHours');
        console.log((0, exports.calculateExercises)(hours, target));
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
