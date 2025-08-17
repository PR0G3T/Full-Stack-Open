import express, { Request, Response } from 'express'
import { calculateBmi } from '../bmiCalculator'
import { calculateExercises } from '../exerciseCalculator'

const app = express()
const PORT = 3003

// Parse JSON bodies
app.use(express.json())

app.get('/hello', (_req: Request, res: Response) => {
  res.send('Hello Full Stack!')
})

app.get('/bmi', (req: Request, res: Response) => {
  try {
    const { height, weight } = req.query

    if (height === undefined || weight === undefined) {
      return res.status(400).json({ error: 'malformatted parameters' })
    }

    const h = Number(height)
    const w = Number(weight)

    if (!Number.isFinite(h) || !Number.isFinite(w)) {
      return res.status(400).json({ error: 'malformatted parameters' })
    }

    const bmi = calculateBmi(h, w)
    return res.json({ weight: w, height: h, bmi })
  } catch {
    return res.status(400).json({ error: 'malformatted parameters' })
  }
})

app.post('/exercises', (req: Request, res: Response) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const body: any = req.body

  if (!body || body.daily_exercises === undefined || body.target === undefined) {
    return res.status(400).json({ error: 'parameters missing' })
  }

  const { daily_exercises, target } = body

  if (!Array.isArray(daily_exercises)) {
    return res.status(400).json({ error: 'malformatted parameters' })
  }

  const hours = daily_exercises.map((n: unknown) => Number(n))
  const parsedTarget = Number(target)

  if (hours.some(h => !Number.isFinite(h)) || !Number.isFinite(parsedTarget)) {
    return res.status(400).json({ error: 'malformatted parameters' })
  }

  try {
    const result = calculateExercises(hours, parsedTarget)
    return res.json(result)
  } catch {
    return res.status(400).json({ error: 'malformatted parameters' })
  }
})

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`)
  })
}

export default app


