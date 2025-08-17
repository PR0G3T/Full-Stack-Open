import express, { Request, Response } from 'express'
import diagnosesRouter from './routes/diagnoses'
import patientsRouter from './routes/patients'

const app = express()
const PORT = 3001

app.use(express.json())

app.get('/api/ping', (_req: Request, res: Response) => {
  res.send('pong')
})

app.use('/api/diagnoses', diagnosesRouter)
app.use('/api/patients', patientsRouter)

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Patientor backend running on http://localhost:${PORT}`)
  })
}

export default app


