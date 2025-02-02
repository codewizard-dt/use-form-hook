import { Validator } from "../types/InputProps"

export const emailRegex = new RegExp(/^[\w-.]+@([\w-]+.)+[\w-]{2,4}$/)
export const validEmail = new RegExp(/^[a-z0-9._]+@[a-z0-9.]+\.[a-z]+/i)

export const emailValidator: Validator = (value) => value.match(validEmail) !== null
export const phoneValidator: Validator = (value) => {
  const pattern = /^\(\d{3}\) \d{3}-\d{4}$/
  return pattern.test(value)
}
export const zipcodeValidator: Validator = (value) => {
  const pattern = /^\d{5}(-\d{4})?$/
  return pattern.test(value)
}
export const zip5Validator: Validator = (value) => {
  const pattern = /^\d{5}$/
  return pattern.test(value)
}
export const zip9Validator: Validator = (value) => {
  const pattern = /^\d{5}-\d{4}$/
  return pattern.test(value)
}
