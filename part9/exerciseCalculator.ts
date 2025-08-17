import { parseNumber, parseNumberArray } from './utils'

export interface ExerciseResult {
  periodLength: number
  trainingDays: number
  success: boolean
  rating: number
  ratingDescription: string
  target: number
  average: number
}

export const calculateExercises = (
  dailyHours: number[],
  target: number
): ExerciseResult => {
  if (!Array.isArray(dailyHours) || dailyHours.length === 0) {
    throw new Error('dailyHours must be a non-empty array of numbers')
  }
  if (target <= 0) throw new Error('target must be greater than 0')

  const periodLength = dailyHours.length
  const trainingDays = dailyHours.filter(h => h > 0).length
  const totalHours = dailyHours.reduce((sum, h) => sum + h, 0)
  const average = totalHours / periodLength
  const success = average >= target

  // Simple rating schema
  // 3: average >= target
  // 2: average >= 0.75 * target
  // 1: otherwise
  let rating = 1
  let ratingDescription = 'You need to work harder'
  if (average >= target) {
    rating = 3
    ratingDescription = 'Great job!'
  } else if (average >= target * 0.75) {
    rating = 2
    ratingDescription = 'not too bad but could be better'
  }

  return {
    periodLength,
    trainingDays,
    success,
    rating,
    ratingDescription,
    target,
    average,
  }
}

// CLI entry
if (require.main === module) {
  try {
    const args = process.argv.slice(2)
    if (args.length < 2) {
      throw new Error(
        'Usage: ts-node part9/exerciseCalculator.ts <target> <d1> <d2> ... <dn>'
      )
    }
    const target = parseNumber(args[0], 'target')
    const hours = parseNumberArray(args.slice(1), 'dailyHours')
    console.log(calculateExercises(hours, target))
  } catch (err) {
    if (err instanceof Error) {
      console.error('Error:', err.message)
      process.exit(1)
    } else {
      console.error('Unknown error')
      process.exit(1)
    }
  }
}


