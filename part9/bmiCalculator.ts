import { parseNumber } from './utils'

// BMI categories use WHO standard ranges
// Underweight < 18.5, Normal 18.5–24.9, Overweight 25–29.9, Obese >= 30
export const calculateBmi = (heightCm: number, weightKg: number): string => {
  if (heightCm <= 0) throw new Error('Height must be greater than 0')
  if (weightKg <= 0) throw new Error('Weight must be greater than 0')

  const heightM = heightCm / 100
  const bmi = weightKg / (heightM * heightM)

  if (bmi < 18.5) return 'Underweight'
  if (bmi < 25) return 'Normal range'
  if (bmi < 30) return 'Overweight'
  return 'Obese'
}

// CLI entry
if (require.main === module) {
  try {
    const [, , a, b] = process.argv
    if (!a || !b) {
      throw new Error('Usage: ts-node part9/bmiCalculator.ts <height_cm> <weight_kg>')
    }
    const height = parseNumber(a, 'height')
    const weight = parseNumber(b, 'weight')
    console.log(calculateBmi(height, weight))
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


