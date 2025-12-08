/**
 * API validation helpers
 * Centralized validation logic for request handling
 */

export interface ValidationError {
  field: string
  message: string
}

export interface ValidationResult<T> {
  success: boolean
  data?: T
  errors?: ValidationError[]
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

/**
 * Validate URL
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * Validate positive integer
 */
export function isValidPositiveInt(value: any): boolean {
  const num = Number(value)
  return Number.isInteger(num) && num >= 0
}

/**
 * Sanitize string input (basic XSS prevention)
 */
export function sanitizeString(input: any, maxLength = 1000): string {
  if (input === null || input === undefined) return ''
  let str = String(input).trim()
  if (str.length > maxLength) str = str.substring(0, maxLength)
  return str.replace(/[<>]/g, '').trim()
}

/**
 * Sanitize array of strings
 */
export function sanitizeStringArray(arr: any[], maxItems = 100): string[] {
  if (!Array.isArray(arr)) return []
  return arr
    .slice(0, maxItems)
    .map((item) => sanitizeString(item))
    .filter((item) => item.length > 0)
}

/**
 * Validate onboarding step
 */
export function isValidOnboardingStep(step: any): boolean {
  const num = Number(step)
  return Number.isInteger(num) && num >= 0 && num <= 6
}

/**
 * Create error response
 */
export function createValidationError(field: string, message: string): ValidationError {
  return { field, message }
}

/**
 * Create success response
 */
export function createSuccessResponse<T>(data: T): ValidationResult<T> {
  return { success: true, data }
}

/**
 * Create error response
 */
export function createErrorResponse<T>(errors: ValidationError[]): ValidationResult<T> {
  return { success: false, errors }
}
