import { z } from 'zod'
import { Gender, NewPatient, NewEntry, HealthCheckRating } from '../types'

// Zod schema for validating new patient payloads
const newPatientSchema = z.object({
  name: z.string().min(1, 'name is required'),
  dateOfBirth: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/u, 'dateOfBirth must be YYYY-MM-DD'),
  ssn: z.string().min(1, 'ssn is required'),
  gender: z.nativeEnum(Gender),
  occupation: z.string().min(1, 'occupation is required')
})

export const toNewPatient = (object: unknown): NewPatient => {
  return newPatientSchema.parse(object) as NewPatient
}

// Entry parsing – minimal correctness
const baseEntrySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/u),
  specialist: z.string().min(1),
  description: z.string().min(1),
  diagnosisCodes: z.array(z.string()).optional()
})

const hospitalSchema = baseEntrySchema.extend({
  type: z.literal('Hospital'),
  discharge: z.object({ date: z.string(), criteria: z.string() })
})

const occupationalSchema = baseEntrySchema.extend({
  type: z.literal('OccupationalHealthcare'),
  employerName: z.string(),
  sickLeave: z
    .object({ startDate: z.string(), endDate: z.string() })
    .optional()
})

const healthCheckSchema = baseEntrySchema.extend({
  type: z.literal('HealthCheck'),
  healthCheckRating: z.nativeEnum(HealthCheckRating)
})

const newEntrySchema = z.discriminatedUnion('type', [
  hospitalSchema,
  occupationalSchema,
  healthCheckSchema
])

export const toNewEntry = (object: unknown): NewEntry => {
  return newEntrySchema.parse(object) as NewEntry
}


