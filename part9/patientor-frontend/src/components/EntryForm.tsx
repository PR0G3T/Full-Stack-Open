import { useState } from 'react'
import { Diagnosis, HealthCheckRating, NewEntry } from '../types'

type Props = {
  onSubmit: (entry: NewEntry) => Promise<void>
  diagnoses: Diagnosis[]
}

const EntryForm = ({ onSubmit, diagnoses }: Props) => {
  const [type, setType] = useState<'HealthCheck' | 'Hospital' | 'OccupationalHealthcare'>('HealthCheck')
  const [date, setDate] = useState('')
  const [specialist, setSpecialist] = useState('')
  const [description, setDescription] = useState('')
  const [diagnosisCodes, setDiagnosisCodes] = useState<string>('')

  // HealthCheck fields
  const [healthCheckRating, setHealthCheckRating] = useState<number>(0)
  // Hospital fields
  const [dischargeDate, setDischargeDate] = useState('')
  const [dischargeCriteria, setDischargeCriteria] = useState('')
  // Occupational fields
  const [employerName, setEmployerName] = useState('')
  const [sickStart, setSickStart] = useState('')
  const [sickEnd, setSickEnd] = useState('')

  const reset = () => {
    setDate(''); setSpecialist(''); setDescription(''); setDiagnosisCodes('')
    setHealthCheckRating(0); setDischargeDate(''); setDischargeCriteria('')
    setEmployerName(''); setSickStart(''); setSickEnd('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const codes = diagnosisCodes
      .split(',')
      .map(c => c.trim())
      .filter(Boolean)

    let payload: NewEntry
    switch (type) {
      case 'HealthCheck':
        payload = {
          type,
          date,
          specialist,
          description,
          diagnosisCodes: codes.length ? codes : undefined,
          healthCheckRating: healthCheckRating as HealthCheckRating
        }
        break
      case 'Hospital':
        payload = {
          type,
          date,
          specialist,
          description,
          diagnosisCodes: codes.length ? codes : undefined,
          discharge: { date: dischargeDate, criteria: dischargeCriteria }
        }
        break
      case 'OccupationalHealthcare':
        payload = {
          type,
          date,
          specialist,
          description,
          diagnosisCodes: codes.length ? codes : undefined,
          employerName,
          sickLeave: sickStart && sickEnd ? { startDate: sickStart, endDate: sickEnd } : undefined
        }
        break
    }
    await onSubmit(payload)
    reset()
  }

  return (
    <form onSubmit={handleSubmit} style={{ border: '1px dashed #999', padding: 12, marginBottom: 16 }}>
      <h3>New {type} entry</h3>
      <div>
        Type
        <select value={type} onChange={e => setType(e.target.value as any)}>
          <option>HealthCheck</option>
          <option>Hospital</option>
          <option>OccupationalHealthcare</option>
        </select>
      </div>
      <div>
        Description
        <input value={description} onChange={e => setDescription(e.target.value)} />
      </div>
      <div>
        Date
        <input type="date" value={date} onChange={e => setDate(e.target.value)} />
      </div>
      <div>
        Specialist
        <input value={specialist} onChange={e => setSpecialist(e.target.value)} />
      </div>
      <div>
        Diagnosis codes (comma separated)
        <input list="codes" value={diagnosisCodes} onChange={e => setDiagnosisCodes(e.target.value)} />
        <datalist id="codes">
          {diagnoses.map(d => (
            <option key={d.code} value={d.code}>{d.code} {d.name}</option>
          ))}
        </datalist>
      </div>
      {type === 'HealthCheck' && (
        <div>
          Healthcheck rating
          <input type="number" min={0} max={3} value={healthCheckRating}
                 onChange={e => setHealthCheckRating(Number(e.target.value))} />
        </div>
      )}
      {type === 'Hospital' && (
        <div>
          Discharge date
          <input type="date" value={dischargeDate} onChange={e => setDischargeDate(e.target.value)} />
          Criteria
          <input value={dischargeCriteria} onChange={e => setDischargeCriteria(e.target.value)} />
        </div>
      )}
      {type === 'OccupationalHealthcare' && (
        <div>
          Employer
          <input value={employerName} onChange={e => setEmployerName(e.target.value)} />
          Sickleave start
          <input type="date" value={sickStart} onChange={e => setSickStart(e.target.value)} />
          end
          <input type="date" value={sickEnd} onChange={e => setSickEnd(e.target.value)} />
        </div>
      )}
      <button type="button" onClick={reset} style={{ marginRight: 8 }}>Cancel</button>
      <button type="submit">Add</button>
    </form>
  )
}

export default EntryForm


