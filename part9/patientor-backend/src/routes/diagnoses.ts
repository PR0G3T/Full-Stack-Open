import { Router } from 'express'
import diagnosisService from '../services/diagnosisService'

const router = Router()

router.get('/', (_req, res) => {
  const data = diagnosisService.getDiagnoses()
  res.json(data)
})

export default router


