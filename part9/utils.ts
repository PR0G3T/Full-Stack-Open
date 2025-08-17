// Utility helpers shared by CLI programs

/** Returns true if the given argument is not a finite number. */
export const isNotNumber = (argument: unknown): boolean => {
  if (typeof argument === 'number') return !Number.isFinite(argument)
  const n = Number(argument)
  return Number.isNaN(n) || !Number.isFinite(n)
}

/** Parses a string to a finite number or throws a descriptive error. */
export const parseNumber = (value: unknown, label: string): number => {
  if (isNotNumber(value)) {
    throw new Error(`Invalid ${label}: expected a number, got '${String(value)}'`)
  }
  return Number(value)
}

/** Ensures an array contains only finite numbers, returning parsed numbers. */
export const parseNumberArray = (values: unknown[], label: string): number[] => {
  try {
    return values.map((v, i) => parseNumber(v, `${label}[${i}]`))
  } catch (err) {
    throw err
  }
}


