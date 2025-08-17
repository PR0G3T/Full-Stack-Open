"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toNewEntry = exports.toNewPatient = void 0;
const zod_1 = require("zod");
const types_1 = require("../types");
// Zod schema for validating new patient payloads
const newPatientSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'name is required'),
    dateOfBirth: zod_1.z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/u, 'dateOfBirth must be YYYY-MM-DD'),
    ssn: zod_1.z.string().min(1, 'ssn is required'),
    gender: zod_1.z.nativeEnum(types_1.Gender),
    occupation: zod_1.z.string().min(1, 'occupation is required')
});
const toNewPatient = (object) => {
    return newPatientSchema.parse(object);
};
exports.toNewPatient = toNewPatient;
// Entry parsing – minimal correctness
const baseEntrySchema = zod_1.z.object({
    date: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/u),
    specialist: zod_1.z.string().min(1),
    description: zod_1.z.string().min(1),
    diagnosisCodes: zod_1.z.array(zod_1.z.string()).optional()
});
const hospitalSchema = baseEntrySchema.extend({
    type: zod_1.z.literal('Hospital'),
    discharge: zod_1.z.object({ date: zod_1.z.string(), criteria: zod_1.z.string() })
});
const occupationalSchema = baseEntrySchema.extend({
    type: zod_1.z.literal('OccupationalHealthcare'),
    employerName: zod_1.z.string(),
    sickLeave: zod_1.z
        .object({ startDate: zod_1.z.string(), endDate: zod_1.z.string() })
        .optional()
});
const healthCheckSchema = baseEntrySchema.extend({
    type: zod_1.z.literal('HealthCheck'),
    healthCheckRating: zod_1.z.nativeEnum(types_1.HealthCheckRating)
});
const newEntrySchema = zod_1.z.discriminatedUnion('type', [
    hospitalSchema,
    occupationalSchema,
    healthCheckSchema
]);
const toNewEntry = (object) => {
    return newEntrySchema.parse(object);
};
exports.toNewEntry = toNewEntry;
