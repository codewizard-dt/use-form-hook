import React, { useState, useCallback, useEffect, useRef, InputHTMLAttributes } from "react"
import { useFormContext } from "../../context"
import { TypedInput } from "../types/InputProps"
import { Message } from "./Message"

export const InputColorPicker = ({
  name,
  groupName,
  disabled = false,
  className = {},
  icon,
  label,
  inline,
  placeholder,
  helper,
  background,
  value: passedValue,
  defaultValue,
  required,
  error: passedError,
  onChange,
}: TypedInput<"string">) => {
  const [error, _setError] = useState<string | undefined>(passedError)
  const [_value, _setValue] = useState<string | number>(defaultValue ?? passedValue ?? "transparent")
  const fullName = groupName ? `${groupName}.${name}` : name

  const { data, errors } = useFormContext()
  const setError = useCallback(
    (error: string | undefined) => {
      errors.set(fullName, error)
      _setError(error)
    },
    [errors, fullName]
  )

  useEffect(() => {
    const sub = data._v.subscribe(() => {
      const value = data.getString(fullName, "")
      if (value !== _value) _setValue(value)
    })
    return () => sub.unsubscribe()
  }, [data, _value, fullName])

  useEffect(() => {
    if (passedValue && passedValue !== _value) {
      _setValue(passedValue)
      data.set(fullName, passedValue.toString())
    }
  }, [passedValue, _value, fullName, data])

  const hiddenRef = useRef<HTMLInputElement>(null)

  /**
   * allows a change in a passed error to be propagated
   */
  useEffect(() => {
    setError(passedError)
  }, [passedError, setError])

  const handleChange = (event: { target: { value: string } }) => {
    if (required && event.target.value === "transparent") {
      setError("required")
    } else {
      setError(undefined)
    }
    if (onChange) {
      onChange(event.target.value)
      _setValue(event.target.value)
    }
  }


  const anyError = error || errors.get(fullName)
  const hasError = anyError !== undefined && anyError !== ""

  const inputProps: InputHTMLAttributes<HTMLInputElement> = {
    disabled,
    onChange: handleChange,
    type: "color",
    autoComplete: "off",
    id: [groupName || "group", name ?? "text"].join("_"),
    name: name,
    placeholder: placeholder,
    className: "absolute z-[-1] bottom-0 w-0 h-0 opacity-0",
  }

  return (
    <div className={className.wrapper}>
      {label && (
        <label
          htmlFor={inputProps.id}
          className={className.label}
        >
          {label}
          {required && <span className="ml-1 text-destructive-500">*</span>}
        </label>
      )}

      <div className={`relative ${inline ? "inline-block" : ""}`}>
        <div className="inline-block relative">
          <input ref={hiddenRef} value={_value || "#ffffff"} {...inputProps} />
          <div
            style={{ backgroundColor: _value?.toString() }}
            onClick={() => hiddenRef.current?.click()}
            className={className.input}
          >
            {_value === "" && <div className="transform-center h-12 w-[2px] bg-destructive-500 origin-center rounded-full rotate-45" />}
          </div>
        </div>

        {(error || errors.get(fullName)) && (
          <Message
            className={{ wrapper: "absolute w-full max-w-max whitespace-pre-wrap mt-1 left-0 shadow-lg shadow-destructive-100" }}
            type="error"
            content={error || errors.get(fullName)}
          />
        )}
        {helper}
      </div>
    </div>
  )
}
