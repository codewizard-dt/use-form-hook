import { at, set } from "lodash"

export type KeyedData = { [key: string]: string }
export type NestedData = { [key: string]: KeyedData | string }

export function getDot(dotNotation: string, obj: NestedData): KeyedData | string | undefined {
  return at(obj, dotNotation)[0]
}

export function setDot(dotNotation: string, value: string, obj: NestedData) {
  return set(obj, dotNotation.split('.'), value)
}