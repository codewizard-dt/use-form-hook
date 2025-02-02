// import { FieldProps, CheckboxInputProps } from "../../../components/ui/input/InputProps"

import { FieldProps, TypedInput } from "./InputProps"

export interface FieldGroup extends Omit<FieldProps, "fields" | "type"> {
  type: "group"
  fields: (FieldProps | FieldGroup)[]
}

export interface CheckboxGroupProps extends Omit<TypedInput<"checkbox">, "fields" | "type" | "value"> {
  type: "checkboxGroup"
  fields: Omit<TypedInput<"checkbox">, "type">[]
}
