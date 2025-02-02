import React, { useState, useEffect } from "react"
import { useFormContext } from "../../context"
import { TypedInput } from "../types/InputProps"
import { Message } from "./Message"


export default function ({
  byteSize,
  updateSrc,
  name,
  groupName,
  label,
  required,
  className = {},
  value,
  helper,
  error: passedError,
  inline,
  onChange,
  ...inputProps
}: TypedInput<"image">) {
  const [error, _setError] = useState<string | undefined>(passedError)
  const fullName = groupName ? `${groupName}.${name}` : name

  const { data, errors } = useFormContext()
  const setError = (error: string | undefined) => {
    errors.set(fullName, error)
    _setError(error)
  }

  /**
   * allows a change in a passed error to be propagated
   */
  useEffect(() => {
    setError(passedError)
  }, [passedError])

  const anyError = error || errors.getString(fullName)
  const hasError = anyError !== undefined && anyError !== ""

  return (
    <div className="relative">
      {label && (
        <label
          className={className.label}
        >
          {label}
          {required && <span className="ml-1 text-destructive-500">*</span>}
        </label>
      )}
      <input
        type="file"
        id={[groupName || "", name].join("_")}
        accept="image/*"
        className={className.input}
        onChange={(e) => {
          const file = e.target.files?.[0]

          // if (file) {
          //   onChange?.(file)
          //   setError(undefined)
          // }
        }}
      />
      {(error || errors.get(fullName)) && (
        <Message
          className={{ wrapper: "absolute w-full max-w-max whitespace-pre-wrap mt-1 left-0 shadow-lg shadow-destructive-100" }}
          type="error"
          content={error || errors.get(fullName)}
        />
      )}
      {helper}
    </div>
  )
}
