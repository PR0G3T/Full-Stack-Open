import { useEffect, useState } from 'react'
import * as diaryService from './services/diaries'
import { DiaryEntry, NewDiaryEntry, Visibility, Weather } from './types'
import axios from 'axios'

const visibilityOptions: Visibility[] = ['great', 'good', 'ok', 'poor']
const weatherOptions: Weather[] = ['sunny', 'rainy', 'cloudy', 'stormy', 'windy']

const App = () => {
  const [entries, setEntries] = useState<DiaryEntry[]>([])
  const [error, setError] = useState<string | null>(null)

  const [date, setDate] = useState('')
  const [visibility, setVisibility] = useState<Visibility>('great')
  const [weather, setWeather] = useState<Weather>('sunny')
  const [comment, setComment] = useState('')

  useEffect(() => {
    diaryService.getAll().then(setEntries)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    const newEntry: NewDiaryEntry = {
      date,
      visibility,
      weather,
      comment
    }
    try {
      const created = await diaryService.create(newEntry)
      setEntries(prev => prev.concat(created))
      setDate('')
      setComment('')
      setVisibility('great')
      setWeather('sunny')
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error ?? err.message)
      } else if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Unknown error')
      }
    }
  }

  return (
    <div>
      <h2>Add new entry</h2>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          date
          <input type="date" value={date} onChange={e => setDate(e.target.value)} />
        </div>
        <div>
          visibility
          {visibilityOptions.map(v => (
            <label key={v} style={{ marginLeft: 8 }}>
              <input
                type="radio"
                name="visibility"
                value={v}
                checked={visibility === v}
                onChange={() => setVisibility(v)}
              />
              {v}
            </label>
          ))}
        </div>
        <div>
          weather
          {weatherOptions.map(w => (
            <label key={w} style={{ marginLeft: 8 }}>
              <input
                type="radio"
                name="weather"
                value={w}
                checked={weather === w}
                onChange={() => setWeather(w)}
              />
              {w}
            </label>
          ))}
        </div>
        <div>
          comment
          <input value={comment} onChange={e => setComment(e.target.value)} />
        </div>
        <button type="submit">add</button>
      </form>

      <h2>Diary entries</h2>
      {entries.map(e => (
        <div key={e.id} style={{ marginBottom: 12 }}>
          <h3>{e.date}</h3>
          <div>visibility: {e.visibility}</div>
          <div>weather: {e.weather}</div>
          {e.comment && <div>comment: {e.comment}</div>}
        </div>
      ))}
    </div>
  )
}

export default App


