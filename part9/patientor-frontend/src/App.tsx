import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Link, useParams } from 'react-router-dom'
import { Diagnosis, Entry, NewEntry, Patient, PatientListItem } from './types'
import * as api from './services/api'
import EntryForm from './components/EntryForm'

const Home = () => {
  const [patients, setPatients] = useState<PatientListItem[]>([])

  useEffect(() => {
    api.getPatients().then(setPatients)
  }, [])

  return (
    <div>
      <h1>Patientor</h1>
      <ul>
        {patients.map(p => (
          <li key={p.id}>
            <Link to={`/patients/${p.id}`}>{p.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

const assertNever = (v: never): never => {
  throw new Error(`Unhandled entry type: ${JSON.stringify(v)}`)
}

const EntryDetails = ({ entry, diagnoses }: { entry: Entry; diagnoses: Record<string, Diagnosis> }) => {
  return (
    <div style={{ border: '1px solid #ccc', borderRadius: 4, padding: 12, marginBottom: 10 }}>
      <div>
        <strong>{entry.date}</strong> {entry.description}
      </div>
      {entry.diagnosisCodes && (
        <ul>
          {entry.diagnosisCodes.map(code => (
            <li key={code}>
              {code} {diagnoses[code]?.name}
            </li>
          ))}
        </ul>
      )}
      {(() => {
        switch (entry.type) {
          case 'Hospital':
            return <div>discharge: {entry.discharge.date} – {entry.discharge.criteria}</div>
          case 'OccupationalHealthcare':
            return (
              <div>
                employer: {entry.employerName}
                {entry.sickLeave && (
                  <div>sick leave: {entry.sickLeave.startDate} → {entry.sickLeave.endDate}</div>
                )}
              </div>
            )
          case 'HealthCheck':
            return <div>health check rating: {entry.healthCheckRating}</div>
          default:
            return assertNever(entry)
        }
      })()}
      <div>diagnose by {entry.specialist}</div>
    </div>
  )
}

const PatientView = () => {
  const { id } = useParams()
  const [patient, setPatient] = useState<Patient | null>(null)
  const [diagnoses, setDiagnoses] = useState<Record<string, Diagnosis>>({})
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    api.getPatient(id).then(setPatient)
    api.getDiagnoses().then(list => {
      const map: Record<string, Diagnosis> = {}
      list.forEach(d => (map[d.code] = d))
      setDiagnoses(map)
    })
  }, [id])

  if (!patient) return <div>loading...</div>

  return (
    <div>
      <h1>Patientor</h1>
      <Link to="/">Home</Link>
      <h2>{patient.name}</h2>
      <div>ssn: {patient.ssn}</div>
      <div>occupation: {patient.occupation}</div>
      <EntryForm
        diagnoses={Object.values(diagnoses)}
        onSubmit={async (entry: NewEntry) => {
          setError(null)
          try {
            const created = await api.addEntry(patient.id, entry)
            setPatient({ ...patient, entries: patient.entries.concat(created) })
          } catch (e: unknown) {
            const message = (e as any)?.response?.data?.error ?? (e as Error).message ?? 'error'
            setError(String(message))
          }
        }}
      />
      {error && <div style={{ color: 'crimson', fontWeight: 'bold' }}>{error}</div>}
      <h3>entries</h3>
      {patient.entries.map(e => (
        <EntryDetails key={e.id} entry={e} diagnoses={diagnoses} />
      ))}
    </div>
  )
}

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/patients/:id" element={<PatientView />} />
    </Routes>
  </BrowserRouter>
)

export default App


