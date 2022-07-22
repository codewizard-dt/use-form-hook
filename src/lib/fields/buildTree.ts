import { KeyedData } from "../dot-notation"
import { Field, FieldGroup } from "../../context/form"
import { getFirstOption } from "./getFirstOption"

export function getBranchedTree(fields: (Field & FieldGroup)[]): KeyedData {
  let flat: KeyedData = {}
  for (let field of fields) {
    if (field.fields) {
      let next = getBranchedTree(field.fields)
      if (field.name) flat[field.name] = next
      else flat = { ...flat, ...next }
    }
    else flat[field.name] = field.initial || getFirstOption(field) || ''
  }
  return flat
}