"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var bmiCalculator_1 = require("../bmiCalculator");
var app = (0, express_1.default)();
var PORT = 3003;
app.get('/hello', function (_req, res) {
    res.send('Hello Full Stack!');
});
app.get('/bmi', function (req, res) {
    try {
        var _a = req.query, height = _a.height, weight = _a.weight;
        if (height === undefined || weight === undefined) {
            return res.status(400).json({ error: 'malformatted parameters' });
        }
        var h = Number(height);
        var w = Number(weight);
        if (!Number.isFinite(h) || !Number.isFinite(w)) {
            return res.status(400).json({ error: 'malformatted parameters' });
        }
        var bmi = (0, bmiCalculator_1.calculateBmi)(h, w);
        return res.json({ weight: w, height: h, bmi: bmi });
    }
    catch (err) {
        return res.status(400).json({ error: 'malformatted parameters' });
    }
});
if (require.main === module) {
    app.listen(PORT, function () {
        console.log("Server running at http://localhost:".concat(PORT));
    });
}
exports.default = app;
