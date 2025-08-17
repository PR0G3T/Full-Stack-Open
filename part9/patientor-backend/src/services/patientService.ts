import patients from '../data/patients'
import { NonSensitivePatientListItem, NewPatient, Patient } from '../types'
import { v1 as uuid } from 'uuid'

const getNonSensitivePatients = (): NonSensitivePatientListItem[] =>
  patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation
  }))

export default {
  getNonSensitivePatients,
  addPatient: (newPatient: NewPatient): Patient => {
    const created: Patient = { id: uuid(), ...newPatient }
    patients.push(created)
    return created
  },
  getById: (id: string): Patient | undefined => patients.find(p => p.id === id)
}


