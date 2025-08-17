"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("../types");
// Sample patients (subset) – in real exercise you can paste the full list
const patients = [
    {
        id: 'd2773336-f723-11e9-8f0b-362b9e155667',
        name: 'John McClane',
        dateOfBirth: '1986-07-09',
        gender: types_1.Gender.Male,
        occupation: 'New york city cop',
        ssn: '090786-122X',
        entries: [
            {
                id: 'd811e46d-70b3-4d90-b090-4535c7cf8fb1',
                date: '2015-01-02',
                type: 'Hospital',
                specialist: 'MD House',
                diagnosisCodes: ['S62.5'],
                description: "Healing time appr. 2 weeks. patient doesn't remember how he got the injury.",
                discharge: {
                    date: '2015-01-16',
                    criteria: 'Thumb has healed.'
                }
            }
        ]
    },
    {
        id: 'd2773598-f723-11e9-8f0b-362b9e155667',
        name: 'Martin Riggs',
        dateOfBirth: '1979-01-30',
        gender: types_1.Gender.Male,
        occupation: 'Cop',
        ssn: '300179-777A',
        entries: [
            {
                id: 'a17e7c44-6e7b-4b94-88d0-0b7d7b7d7b7d',
                date: '2019-08-05',
                type: 'OccupationalHealthcare',
                specialist: 'MD House',
                employerName: 'FBI',
                description: 'Patient mistakenly found himself in a nuclear plant waste site without protection gear. Very minor radiation poisoning.',
                diagnosisCodes: ['Z57.1', 'Z74.3', 'M51.2']
            }
        ]
    },
    {
        id: 'd2773962-f723-11e9-8f0b-362b9e155667',
        name: 'Hans Gruber',
        dateOfBirth: '1970-04-25',
        gender: types_1.Gender.Male,
        occupation: 'Technician',
        ssn: '250470-555L',
        entries: [
            {
                id: 'f019d8e3-a6c3-4ec9-b0a6-0d0ea1a5f9a9',
                date: '2019-10-20',
                type: 'HealthCheck',
                specialist: 'MD House',
                description: 'Yearly control visit. Cholesterol levels back to normal.',
                healthCheckRating: types_1.HealthCheckRating.LowRisk
            }
        ]
    },
    {
        id: 'd2773c6e-f723-11e9-8f0b-362b9e155667',
        name: 'Dana Scully',
        dateOfBirth: '1974-01-05',
        gender: types_1.Gender.Female,
        occupation: 'Forensic Pathologist',
        ssn: '050174-432N',
        entries: []
    }
];
exports.default = patients;
