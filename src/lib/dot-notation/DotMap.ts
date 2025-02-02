import get from "lodash/get"
import set from "lodash/set"
import unset from "lodash/unset"
import { BehaviorSubject } from "rxjs"
import { useState, useEffect, useCallback } from "react"

// const { get: _get, set: _set, unset: _unset } = _

type DataTypes = string | number | boolean | Date
export type NestedData<T extends DataTypes = DataTypes> = { [key: string]: NestedData<T> | T | undefined | null }
export type FlatData<T extends DataTypes> = { [key: string]: T }

export type Serializable = DataTypes | NestedData

export type DataWithId<K extends string> = {
  [key: string]: DataTypes | NestedData | null | undefined
  value?: DataTypes | NestedData | null | undefined
} & {
  [P in K]: string
}

/**
 * DotMap is a class that allows you to store data in a nested object structure and access it using dot notation.
 */
type Key = string | (string | number)[]

export class DotMap<T extends DataTypes = DataTypes> {
  private _importantFlag: string = "***"
  private _debug: boolean = false
  private _name: string = "DotMap"

  constructor(options?: { initial?: NestedData<T>; importantFlag?: string; name?: string; debug?: boolean }) {
    if (options?.initial) this.initial = options?.initial
    if (options?.importantFlag) this._importantFlag = options?.importantFlag
    if (options?.debug) this._debug = options?.debug
    if (options?.name) this._name = options?.name
  }

  static flatten<T extends DataTypes>(data: NestedData<T>) {
    const result: FlatData<T> = {}
    for (let [key, value] of Object.entries(data)) {
      if (value === undefined || value === null) continue
      if (value instanceof Date) {
        result[key] = value
        continue
      }
      switch (typeof value) {
        case "boolean":
        case "number":
        case "string":
          result[key] = value
          break
        case "object":
          let next = DotMap.flatten(value)
          for (let [key2, val2] of Object.entries(next)) {
            result[`${key}.${key2}`] = val2
          }

          break
      }
      // if (typeof value === "string") result[key] = value
      // else {
      //   let next = DotMap.flatten(value)
      //   for (let [key2, val2] of Object.entries(next)) {
      //     result[`${key}.${key2}`] = val2
      //   }
      // }
    }
    return result
  }
  /**
   * Takes an object and converts it to an array of objects
   *
   * Each [key, value] pair is converted to an object
   *
   * If the value is an object, it is spread into the new object.  Otherwise it is added as a "value" property
   * @param data
   * @param keyPropName the property name to use for each key
   * @returns an array of objects
   */

  static toArrayOfObjects = <K extends string>(data: NestedData, keyPropName: K): DataWithId<K>[] => {
    return Object.entries(data).map(([key, value]) => {
      const obj: DataWithId<K> = { [keyPropName]: key } as DataWithId<K>
      if (typeof value !== "object") obj["value"] = value
      else Object.assign(obj, value)
      return obj
    })
  }
  static exclude = <T extends DataTypes>(data: NestedData<T>, keys: string[]) => {
    const filtered = Object.entries(data).reduce((acc, [key, value]) => {
      if (!keys.includes(key)) acc[key] = value
      return acc
    }, {} as NestedData<T>)
    return filtered
  }

  private _data: NestedData<T> = {}
  private _initial: NestedData<T> = {}

  // Observable to notify subscribers of changes
  public _v = new BehaviorSubject(0)

  useStringValue = (key: string, fallback: string = "") => {
    const [value, setValue] = useState(() => this.getString(key, fallback))

    useEffect(() => {
      const subscription = this._v.subscribe(() => {
        const newValue = this.getString(key, fallback)
        if (value !== newValue) setValue(this.getString(key, fallback))
      })
      return () => subscription.unsubscribe()
    }, [key, fallback])

    const setterCallback = useCallback(
      (newValue: T) => {
        // console.log("setterCallback", key, newValue)
        this.set(key, newValue)
        setValue(this.getString(key, fallback))
      },
      [key, fallback]
    )

    return [value, setterCallback] as const
  }

  get initial() {
    return this._initial
  }
  set initial(data: NestedData<T>) {
    this._initial = Object.freeze({ ...data })
    this._data = { ...data }
    this._v.next(this._v.value + 1)
  }
  get value() {
    return this._data
  }
  get _value() {
    return { ...this._data }
  }
  get size() {
    return Object.keys(this._data).length
  }

  get = (key: Key): T => {
    const v = get(this._data, key, "")
    return this.isImportant(key) ? v.slice(this._importantFlag.length) : v
  }
  getString = <V extends string | undefined>(key: Key, defaultValue?: V): string | V => {
    const v = this.get(key)
    if (v === null || v === undefined) return defaultValue as V
    switch (typeof v) {
      case "string":
        return v
      case "boolean":
        return v ? "true" : "false"
      default:
        return v.toString()
    }
  }
  // getBoolean = <V extends boolean |undefined>(key: Key, defaultValue?: V): boolean | V=> {
  getBoolean = <V extends boolean | undefined>(key: Key, defaultValue?: V): boolean | V => {
    const v = this.get(key)
    if (v === null || v === undefined || v === "") {
      return defaultValue as V
    }
    switch (typeof v) {
      case "boolean":
        return v
      case "number":
        return v === 1
      case "string":
        return v === "true" || v === "1"
      default:
        return v instanceof Date
    }
  }
  getNumber = <V extends number | undefined>(key: Key, defaultValue?: V): number | V => {
    const v = this.get(key)
    if (v === null || v === undefined || v === "") return defaultValue as V
    switch (typeof v) {
      case "number":
        return v
      case "string":
        const num = parseFloat(v)
        if (isNaN(num)) return defaultValue as V
        return num
      case "boolean":
        return v ? 1 : 0
      default:
        return defaultValue as V
    }
  }
  getDate = <V extends Date | undefined>(key: Key, defaultValue?: V): Date | V => {
    const v = this.get(key)
    if (!v) return defaultValue as V
    if (v instanceof Date) return v

    switch (typeof v) {
      case "string":
        return new Date(v)
      case "number":
        return new Date(v)
      default:
        return defaultValue as V
    }
  }
  set = (key: Key, value: T | undefined | null, options: { forceSet: boolean; version: boolean } = { forceSet: false, version: true }) => {
    if (this._debug) console.log(this._name, "TRY", key, value || null, "isImportant", this.isImportant(key), "forceSet", options.forceSet)
    if (this.isImportant(key) && !options.forceSet) return
    if (this._debug) console.log(this._name, "SET", key, value || null)
    if (value === undefined || value === null) {
      this.clear(key)
    } else {
      set(this._data, key, value)
    }
    if (options.version) {
      this._v.next(this._v.value + 1)
    }
  }
  setMultiple = (data: NestedData<T>, options: { forceSet: boolean; version: boolean } = { forceSet: false, version: false }) => {
    const flattened = DotMap.flatten(data)
    if (this._debug) console.log(this._name, "SET MULTIPLE", flattened)
    for (let [key, value] of Object.entries<T>(flattened)) {
      this.set(key, value, options)
    }
    this._v.next(this._v.value + 1)
  }
  isImportant = (key: Key) => {
    const v = get(this._data, key, "")
    // console.log({ key, v })
    return typeof v === "string" && v.startsWith(this._importantFlag)
    // return _get(this._data, key, "").startsWith(this._importantFlag)
  }
  reset = () => {
    this._data = { ...this._initial }
    this._v.next(this._v.value + 1)
  }
  clear = (key: Key, forceClear: boolean = false) => {
    if (!forceClear && this.isImportant(key)) {
      return
    }

    unset(this._data, key)
    let parent: Key | undefined = undefined

    if (Array.isArray(key)) parent = key.slice(0, -1)
    else if (key.split(".").length > 1) parent = key.split(".").slice(0, -1)

    if (parent) {
      const parentValue = this.get(parent)
      if (parentValue && typeof parentValue === "object") {
        if (Object.keys(parentValue).length === 0) {
          this.clear(parent)
        }
      }
    }
    this._v.next(this._v.value + 1)
  }
  clearAll = () => {
    this._data = {}
    this._v.next(this._v.value + 1)
  }

  toFlat = () => DotMap.flatten(this._data)

  hasChanges = () => {
    const flat = this.toFlat()
    for (let [key, value] of Object.entries(flat)) {
      if (get(this._initial, key) !== value) return true
    }
    return false
  }

  exclude = (keys: string[]) => {
    const filtered = Object.entries(this._data).reduce((acc, [key, value]) => {
      if (!keys.includes(key)) acc[key] = value
      return acc
    }, {} as NestedData<T>)
    return filtered
  }
}
