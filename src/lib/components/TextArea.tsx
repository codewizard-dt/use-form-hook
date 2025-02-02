import React, { useState, KeyboardEventHandler, useEffect, useCallback } from "react"
import startCase from "lodash/startCase"
import { TypedInput } from "../types/InputProps"
import { useFormContext } from "../../context"
import { Message } from "./Message"

export const TextArea = ({
  name,
  value: passedValue,
  className = {},
  icon,
  outlineIcon,
  label,
  groupName,
  inline,
  defaultValue,
  placeholder,
  required,
  rows,
  error: passedError,
  helper,
  background,
  validators = [],
  disabled,
  onChange,
  onEnter,
}: TypedInput<"string">) => {
  const { data, errors } = useFormContext()

  const [error, _setError] = useState<string | undefined>(passedError)
  const [_value, _setValue] = useState<string | number | undefined>(defaultValue ?? passedValue)
  const fullName = groupName ? `${groupName}.${name}` : name

  const setValue = useCallback(
    (value: string | number = "") => {
      if (value !== _value) {
        _setValue(value)
        data.set(name, value.toString())
      }
    },
    [_setValue, data, _value]
  )

  const setError = (error: string | undefined) => {
    errors.set(fullName, error)
    _setError(error)
  }

  useEffect(() => {
    const sub = data._v.subscribe(() => {
      const _data = data.getString(fullName)
      if (_data !== _value) _setValue(_data)
    })
    return () => sub.unsubscribe()
  }, [data])

  useEffect(() => {
    const value = passedValue ?? defaultValue ?? data.getString(fullName)
    setValue(value)
    // do not include data in the dependency array
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [passedValue, defaultValue])

  const handleChange = (event: { target: { value: string } }) => {
    if (onChange) onChange(event.target.value)
    else _setValue(event.target.value)
  }
  const validate = (value: string) => {
    if (required && value === "") {
      setError(`${startCase(name)} is required`)
      return
    } else if (value === "") return

    for (const validator of validators) {
      if (Array.isArray(validator)) {
        const [func, message] = validator
        if (!func(value)) {
          setError(message)
          return
        }
      } else {
        if (!validator(value)) {
          setError(`${startCase(name)} is invalid`)
          return
        }
      }
    }
    setError(undefined)
  }
  const handleBlur = (event: { target: { value: string } }) => {
    const { value } = event.target
    validate(value)
  }

  const id = groupName ? groupName + "_" + name : name
  const _error = error || errors.get(fullName)
  const hasError = _error !== undefined && _error !== ""


  const handleKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = (ev) => {
    let value = ev.currentTarget.value
    if (hasError) {
      validate(value)
    }
    if (ev.key === "Enter" && ev.metaKey) {
      if (value === "" && required) setError("Required")
      else if (onEnter && value && value !== "") {
        ev.preventDefault()
        onEnter(value)
      }
    }
  }


  return (
    <div className={className.wrapper || "text-grey-900 w-full"}>
      {label && (
        <label
          htmlFor={id}
          className={`${className.label || "inline-block mt-2 text-neutral-700"} ${hasError ? "text-destructive-500" : ""
            }`}
        >
          {label}
          {required && <span className="ml-1 text-destructive-500">*</span>}
        </label>
      )}

      <div className={`relative ${inline ? "inline-block" : ""}`}>
        {icon || null}
        <textarea
          id={id}
          name={name}
          disabled={disabled}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          onBlur={handleBlur}
          placeholder={placeholder}
          rows={rows}
          className={`${className.input ||
            `border focus:outline-none focus:ring active:ring hover:border-neutral-300 
            focus:ring-neutral-300/40 active:ring-neutral-300/40 rounded-lg p-2 
            ${icon ? "pl-10" : ""} w-full max-w-full ${background ? "border-transparent" : "border-neutral-200"
            }`
            } ${hasError ? "text-destructive-300" : ""}`}
          defaultValue={_value ?? ""}
        />
        {_error && (
          <Message
            type="error"
            className={{
              wrapper: "absolute w-full max-w-max whitespace-pre-wrap mt-1 left-0 shadow-lg shadow-destructive-100 z-10"
            }}
            content={_error}
          />
        )}
        {helper}
      </div>
    </div>
  )
}
