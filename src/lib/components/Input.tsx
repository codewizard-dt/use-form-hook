import React, { InputHTMLAttributes, useRef } from "react"
import { useFormInput } from "../hooks/useFormInput"
import { InputProps } from "../types/InputProps"
import { Message } from "./Message"
import { formatDateCustom } from "../util/DateHelpers"

export const Input = <P extends InputProps>(props: P) => {
  let { disabled = false, className = {}, icon, outlineIcon, helper, label, inline, placeholder, type, background, required } = props

  const input = useFormInput(props)
  const [_value, _setValue] = input.value
  const [_error, _setError] = input.error

  /**
   * Constructed input props object
   * Constructed here to allow for multiple rendering options below
   */
  const inputHtmlProps: InputHTMLAttributes<HTMLInputElement> = {
    id: input.name,
    name: input.name,
    type,
    disabled,
    onChange: input.handleChange,
    onKeyDown: input.handleKeyDown,
    autoComplete: "off",
    onBlur: input.handleBlur,
    placeholder: placeholder,
    className: className.input,
  }
  if (props.type === "checkbox") {
    const size = props.size
    const accentColor = props.accentColor
    inputHtmlProps.style = {
      accentColor: accentColor,
      width: size?.width,
      height: size?.height,
    }
    inputHtmlProps.checked = _value as boolean
    inputHtmlProps.onClick = (ev) => ev.stopPropagation()
  }

  if (props.type === "number") {
    inputHtmlProps.min = props.min
    inputHtmlProps.max = props.max
    inputHtmlProps.step = props.step
  }

  const inputRef = useRef<HTMLInputElement>(null)
  const labelRef = useRef<HTMLLabelElement>(null)

  return (
    <div
      suppressHydrationWarning
      className={className.wrapper}
      onClick={type === "checkbox" ? () => labelRef.current?.click() : undefined}
    >
      {label && (
        <label
          ref={labelRef}
          suppressHydrationWarning
          htmlFor={inputHtmlProps.id}
          className={className.label}
          onClick={(ev) => ev.stopPropagation()}
        >
          {label}
          {required && typeof label === "string" && <span className="ml-1 text-destructive-500">*</span>}
        </label>
      )}

      <div suppressHydrationWarning>
        {icon ?? null}
        <input ref={inputRef} value={_value instanceof Date ? formatDateCustom(_value, "yyyy-MM-dd", "") : _value?.toString() || ""} {...inputHtmlProps} />
        {helper}
        {_error && (
          <Message
            type="error"
            content={_error}
          />
        )}
      </div>
    </div>
  )
}
