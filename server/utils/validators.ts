// Contact-form validation — ports the express-validator chain from the old
// server/validators.js using the same underlying `validator` library, so the
// trim/length/isEmail/normalizeEmail/escape behaviour matches.
import validator from 'validator'

export interface ContactInput {
  name: string
  email: string
  phone?: string
  subject: string
  message: string
}

export interface FieldError {
  field: string
  msg: string
}

export interface ValidationResult {
  valid: boolean
  errors: FieldError[]
  data?: ContactInput
}

const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '')

export function validateContact(body: any): ValidationResult {
  const raw = body || {}
  const errors: FieldError[] = []

  const name = str(raw.name)
  if (!validator.isLength(name, { min: 5, max: 128 })) {
    errors.push({ field: 'name', msg: 'Invalid name' })
  }

  const email = str(raw.email)
  if (!validator.isEmail(email) || !validator.isLength(email, { max: 256 })) {
    errors.push({ field: 'email', msg: 'Invalid email' })
  }

  // Phone is optional (checkFalsy): only validated when a non-empty value is given.
  const phone = str(raw.phone)
  const phoneProvided = phone.length > 0
  if (phoneProvided) {
    if (!validator.isLength(phone, { min: 7, max: 32 }) || !/^[+\d][\d\s()\-]{6,31}$/.test(phone)) {
      errors.push({ field: 'phone', msg: 'Invalid phone format' })
    }
  }

  const subject = str(raw.subject)
  if (!validator.isLength(subject, { min: 3, max: 128 })) {
    errors.push({ field: 'subject', msg: 'Invalid subject' })
  }

  const message = str(raw.message)
  if (!validator.isLength(message, { min: 5, max: 5000 })) {
    errors.push({ field: 'message', msg: 'Invalid message' })
  }

  if (errors.length) return { valid: false, errors }

  const data: ContactInput = {
    name: validator.escape(name),
    email: validator.normalizeEmail(email) || email.toLowerCase(),
    subject: validator.escape(subject),
    message: validator.escape(message)
  }
  if (phoneProvided) data.phone = validator.escape(phone)

  return { valid: true, errors: [], data }
}
