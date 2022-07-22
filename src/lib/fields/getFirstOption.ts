import { Field, FieldGroup } from '../../context'

export const getFirstOption = (field: Field | FieldGroup): string | undefined => {
  if (!field.options) return
  let first = field.options[0]
  return typeof first === 'string' ? first : first.value
}
