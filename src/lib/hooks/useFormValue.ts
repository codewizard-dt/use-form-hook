import { useEffect } from "react"
import { useCallback } from "react"
import { useState } from "react"
import { useFormContext } from "../../context/form"

export const useFormValue = <T extends string | number | boolean | Date>(
  name: string,
  fallback: T,
  onChange?: (newValue: T | undefined) => void
): T extends string
  ? [string, (newValue: string | undefined) => void]
  : T extends number
  ? [number, (newValue: number | undefined) => void]
  : T extends boolean
  ? [boolean, (newValue: boolean | undefined) => void]
  : T extends Date
  ? [Date, (newValue: Date | undefined) => void]
  : never => {
  const forms = useFormContext()

  const getValue = useCallback((): T => {
    if (fallback instanceof Date) {
      return forms.data.getDate(name, fallback) as T
    }
    switch (typeof fallback) {
      case "string":
        return forms.data.getString(name, fallback) as T
      case "number":
        return forms.data.getNumber(name, fallback) as T
      case "boolean":
        return forms.data.getBoolean(name, fallback) as T
      default:
        throw new Error("not implemented")
    }
  }, [name, fallback])

  const [value, setLocal] = useState<T | undefined>(() => getValue())

  useEffect(() => {
    const subscription = forms.data._v.subscribe(() => {
      const newValue = getValue()
      if (value !== newValue) setLocal(newValue)
    })
    return () => subscription.unsubscribe()
  }, [name, fallback])

  const setGlobal = useCallback(
    (newValue: T | undefined) => {
      let value = newValue || fallback
      forms.data.set(name, value)
      setLocal(value)
      onChange?.(value)
    },
    [name, fallback]
  )

  return [value, setGlobal] as T extends string
    ? [string, (newValue: string | undefined) => void]
    : T extends number
    ? [number, (newValue: number | undefined) => void]
    : T extends boolean
    ? [boolean, (newValue: boolean | undefined) => void]
    : T extends Date
    ? [Date, (newValue: Date | undefined) => void]
    : never
}
