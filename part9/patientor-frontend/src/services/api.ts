import axios from 'axios'
import { Diagnosis, Patient, PatientListItem, Entry } from '../types'

export const getPatients = async (): Promise<PatientListItem[]> => {
  const { data } = await axios.get<PatientListItem[]>('/api/patients')
  return data
}

export const getPatient = async (id: string): Promise<Patient> => {
  const { data } = await axios.get<Patient>(`/api/patients/${id}`)
  return data
}

export const getDiagnoses = async (): Promise<Diagnosis[]> => {
  const { data } = await axios.get<Diagnosis[]>('/api/diagnoses')
  return data
}

export const addEntry = async (
  patientId: string,
  payload: Omit<Entry, 'id'>
): Promise<Entry> => {
  const { data } = await axios.post<Entry>(`/api/patients/${patientId}/entries`, payload)
  return data
}


