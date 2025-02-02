import { KeyboardEvent, ReactNode } from "react"
import { ButtonProps } from "./ButtonTypes"

export type Validator = (value: string) => boolean
export type ValidatorWithMessage = [function: Validator, message: string]

type StringInputType = "email" | "phone" | "text" | "zipcode" | "zip5" | "zip9" | "color" | "hidden" | "month" | "password" | "range" | "search" | "url" | "textarea"

export type SelectType = "select"

// Helper type to map input types to their corresponding value types
// export type InputTypeToValueType<T = unknown> = {
//   number: number
//   checkbox: boolean
//   date: Date
//   'datetime-local': Date
//   email: string
//   phone: string
//   text: string
//   zipcode: string
//   zip5: string
//   zip9: string
//   color: string
//   file: string
//   hidden: string
//   image: string
//   month: string
//   password: string
//   range: string
//   search: string
//   time: string
//   url: string
//   week: string
//   textarea: string
//   select: T
// }

// export type InputType = keyof InputTypeToValueType

// Base shared props without value-specific properties
type BaseSharedProps = {
  name: string
  groupName?: string
  disabled?: boolean
  icon?: ReactNode
  label?: ReactNode
  className?: {
    group?: string
    wrapper?: string
    inputWrapper?: string
    label?: string
    input?: string
    button?: string
  }
  // helper?:
  inline?: boolean
  placeholder?: string
  outlineIcon?: boolean
  helper?: ReactNode
  background?: boolean
  button?: ButtonProps
  validators?: (Validator | ValidatorWithMessage)[]
  clearAfterOnEnter?: boolean
  required?: boolean
  error?: string
  showCheckmark?: boolean
  fields?: null
  debug?: boolean
  onKeyDown?: (ev: KeyboardEvent<HTMLInputElement>, value: any) => void
}

export type StringInputProps = {
  type: StringInputType
  value?: string
  defaultValue?: string
  rows?: number
  onChange?: (value: string) => void
  onBlur?: (value: string) => void
  onEnter?: (value: string) => void
}

export type CheckboxInputProps = {
  type: "checkbox"
  value?: boolean
  defaultValue?: boolean
  onChange?: (value: boolean) => void
  onBlur?: (value: boolean) => void
  onEnter?: (value: boolean) => void
  size?: {
    width?: number
    height?: number
  }
  accentColor?: string
}
export type ToggleInputProps = {
  type: "toggle"
  value?: boolean
  defaultValue?: boolean
  onChange?: (value: boolean) => void
  onBlur?: (value: boolean) => void
  onEnter?: (value: boolean) => void
  accentColor?: string
}
export type NumberInputProps = {
  type: "number"
  value?: number
  defaultValue?: number
  onChange?: (value: number) => void
  onBlur?: (value: number) => void
  onEnter?: (value: number) => void
  max?: number
  min?: number
  step?: number
}
export type ImageInputProps = {
  type: "image"
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  onBlur?: (value: string) => void
  onEnter?: (value: string) => void
  byteSize?: number
  updateSrc?: boolean
}
export type DateInputProps = {
  type: "date"
  value?: Date
  defaultValue?: Date
  onChange?: (value: Date) => void
  onBlur?: (value: Date) => void
  onEnter?: (value: Date) => void
  format?: (value: Date) => string
}
export type SelectInputProps<T> = {
  type: "select"
  list: T[]
  value?: T
  defaultValue?: T
  onChange?: (value: T) => void
  onBlur?: (value: T) => void
  onEnter?: (value: T) => void
  getDisabled?: (item: T) => boolean
  getLabel: (item: T) => ReactNode
  getDisplayLabel?: (item: T) => ReactNode
  onSelect?: (item: T) => void
}

type ExplicitInputProps<T> = Omit<BaseSharedProps & T, "type">

type TypedInputMap<T = string> = {
  string: ExplicitInputProps<StringInputProps>
  checkbox: ExplicitInputProps<CheckboxInputProps>
  toggle: ExplicitInputProps<ToggleInputProps>
  number: ExplicitInputProps<NumberInputProps>
  image: ExplicitInputProps<ImageInputProps>
  date: ExplicitInputProps<DateInputProps>
  select: ExplicitInputProps<SelectInputProps<T>>
}

export type TypedInput<T extends keyof TypedInputMap, K = string> = TypedInputMap<K>[T]
export type NamedInput<T extends keyof TypedInputMap, K = string> = Omit<TypedInputMap<K>[T], "name">

export type InputProps = BaseSharedProps &
  (StringInputProps | CheckboxInputProps | ToggleInputProps | NumberInputProps | ImageInputProps | DateInputProps | SelectInputProps<string>)

export type InputType = InputProps["type"]
export type InputValue<P extends InputProps> = P["value"]

export type FieldProps = InputProps

export interface FieldGroup extends Omit<FieldProps, "fields" | "type"> {
  type?: never
  fields: (FieldProps | FieldGroup)[]
}

export const formatPhone = (phone: string | number) => {
  let value = `${phone}`.replace(/\D/g, "")
  switch (value.length) {
    case 0:
      return value
    case 1:
    case 2:
      return `(${value}`
    case 3:
      return `(${value})`
    case 4:
    case 5:
    case 6:
      return `(${value.substring(0, 3)}) ${value.substring(3)}`
    case 7:
    case 8:
    case 9:
    case 10:
      return `(${value.substring(0, 3)}) ${value.substring(3, 6)}-${value.substring(6, 10)}`
    case 11:
      if (value.substring(0, 1) === "1") {
        return `(${value.substring(1, 4)}) ${value.substring(4, 7)}-${value.substring(7, 11)}`
      } else {
        return `+${value.substring(0, 1)} (${value.substring(1, 4)}) ${value.substring(4, 7)}-${value.substring(7, 11)}`
      }
    default:
      return `(${value.substring(0, 3)}) ${value.substring(3, 6)}-${value.substring(6, 10)}`
  }
}
export const formatZipcode = (zipcode: string | number, format?: "zipcode" | "zip5" | "zip9") => {
  let value = `${zipcode}`.replace(/\D/g, "")
  if (format === "zip5") return value.substring(0, 5)
  return value.length <= 5 ? value : `${value.substring(0, 5)}-${value.substring(5, 9)}`
}

export const StateList = [
  "AL",
  "AK",
  "AR",
  "AZ",
  "CA",
  "CO",
  "CT",
  "DC",
  "DE",
  "FL",
  "GA",
  "HI",
  "IA",
  "ID",
  "IL",
  "IN",
  "KS",
  "KY",
  "LA",
  "MA",
  "MD",
  "ME",
  "MI",
  "MN",
  "MO",
  "MS",
  "MT",
  "NC",
  "NE",
  "NH",
  "NJ",
  "NM",
  "NV",
  "NY",
  "ND",
  "OH",
  "OK",
  "OR",
  "PA",
  "RI",
  "SC",
  "SD",
  "TN",
  "TX",
  "UT",
  "VT",
  "VA",
  "WA",
  "WI",
  "WV",
  "WY",
]
