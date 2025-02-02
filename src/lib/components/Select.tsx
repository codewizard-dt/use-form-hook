import React, { useState, useEffect, Fragment } from "react"
import { TypedInput } from "../types/InputProps"

export const Select = ({
  list,
  name,
  label,
  defaultValue,
  value,
  background,
  className = {},
  disabled,
  showCheckmark = true,
  required,
  onChange,
  onSelect,
}: TypedInput<"select", string>) => {
  const [selected, setSelected] = useState<string>(value ?? defaultValue ?? list[0])

  useEffect(() => {
    if (onChange) onChange(selected)
  }, [selected])

  useEffect(() => {
    if (value && value !== selected) setSelected(value)
  }, [value])

  const handleChange = (item: string) => {
    if (item !== selected) {
      setSelected(item)
      if (onChange) onChange(selected)
    }
  }


  return (
    <div className={className.wrapper}>
      {label && (
        <label htmlFor={name} className={className.label}>
          {label}
          {required && <span className="ml-1 text-destructive-500">*</span>}
        </label>
      )}

      <div className={className.input}>
        <select
          value={selected}
          onChange={(e) => {
            const selectedItem = list.find(item => item === e.target.value)
            if (selectedItem) {
              handleChange(selectedItem)
              onSelect?.(selectedItem)
            }
          }}
          disabled={disabled}
          className={className.button}
        >
          {list.map((option, idx) => (
            <option key={idx} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
