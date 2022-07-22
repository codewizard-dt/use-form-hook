import { at, set } from "lodash"

export type KeyedData = { [key: string]: KeyedData | string }
export type FlatData = { [key: string]: string }
// export type NestedData = { [key: string]: KeyedData | string }

export function getDot(dotNotation: string, obj: KeyedData): KeyedData | string | undefined {
  return at(obj, dotNotation)[0]
}

export function setDot(dotNotation: string, value: string, obj: KeyedData) {
  return set(obj, dotNotation.split('.'), value)
}

export function getFlatObj(obj: KeyedData): FlatData {
  let flat: FlatData = {}
  for (let [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') flat[key] = value
    else {
      let next = getFlatObj(value)
      for (let [key2, val2] of Object.entries(next)) {
        flat[`${key}.${key2}`] = val2
      }
    }
  }
  return flat
}

