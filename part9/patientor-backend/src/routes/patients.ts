import { Router } from 'express'
import patientService from '../services/patientService'
import { toNewEntry, toNewPatient } from '../utils/parsers'

const router = Router()

router.get('/', (_req, res) => {
  const data = patientService.getNonSensitivePatients()
  res.json(data)
})

router.get('/:id', (req, res) => {
  const patient = patientService.getById(req.params.id)
  if (!patient) {
    return res.status(404).json({ error: 'patient not found' })
  }
  return res.json(patient)
})

router.post('/', (req, res) => {
  try {
    const newPatient = toNewPatient(req.body)
    const created = patientService.addPatient(newPatient)
    res.status(201).json(created)
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unknown error'
    res.status(400).json({ error: message })
  }
})

router.post('/:id/entries', (req, res) => {
  try {
    const patient = patientService.getById(req.params.id)
    if (!patient) {
      res.status(404).json({ error: 'patient not found' })
      return
    }
    const newEntry = toNewEntry(req.body)
    const created = { id: (globalThis.crypto as any)?.randomUUID?.() ?? 'id-' + Date.now(), ...newEntry }
    // created is of type Entry due to NewEntry discriminated union spread
    patient.entries.push(created as any)
    res.status(201).json(created)
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unknown error'
    res.status(400).json({ error: message })
  }
})

export default router


