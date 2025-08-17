"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const patientService_1 = __importDefault(require("../services/patientService"));
const parsers_1 = require("../utils/parsers");
const router = (0, express_1.Router)();
router.get('/', (_req, res) => {
    const data = patientService_1.default.getNonSensitivePatients();
    res.json(data);
});
router.get('/:id', (req, res) => {
    const patient = patientService_1.default.getById(req.params.id);
    if (!patient) {
        return res.status(404).json({ error: 'patient not found' });
    }
    return res.json(patient);
});
router.post('/', (req, res) => {
    try {
        const newPatient = (0, parsers_1.toNewPatient)(req.body);
        const created = patientService_1.default.addPatient(newPatient);
        res.status(201).json(created);
    }
    catch (e) {
        const message = e instanceof Error ? e.message : 'Unknown error';
        res.status(400).json({ error: message });
    }
});
router.post('/:id/entries', (req, res) => {
    try {
        const patient = patientService_1.default.getById(req.params.id);
        if (!patient) {
            res.status(404).json({ error: 'patient not found' });
            return;
        }
        const newEntry = (0, parsers_1.toNewEntry)(req.body);
        const created = { id: globalThis.crypto?.randomUUID?.() ?? 'id-' + Date.now(), ...newEntry };
        // created is of type Entry due to NewEntry discriminated union spread
        patient.entries.push(created);
        res.status(201).json(created);
    }
    catch (e) {
        const message = e instanceof Error ? e.message : 'Unknown error';
        res.status(400).json({ error: message });
    }
});
exports.default = router;
