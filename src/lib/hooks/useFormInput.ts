import { ChangeEventHandler, FocusEventHandler, KeyboardEventHandler, useEffect, useMemo } from "react"
import { useCallback } from "react"
import { useState } from "react"
import debounce from "lodash/debounce"
import { useFormContext } from "../../context"
import { InputProps, InputValue, formatPhone, formatZipcode } from "../types/InputProps"
import { emailValidator, phoneValidator, zipcodeValidator, zip5Validator, zip9Validator } from "../util/Validators"

export const useFormInput = <P extends InputProps>(inputProps: P) => {
  const { data, errors } = useFormContext()
  const name = useMemo(() => (inputProps.groupName ? `${inputProps.groupName}.${inputProps.name}` : inputProps.name), [inputProps.groupName, inputProps.name])

  /**
   * Get the value from the form context
   */
  const getContextValue = (): InputValue<P> => {
    switch (inputProps.type) {
      case "number":
        return data.getNumber(name, inputProps.defaultValue)
      case "checkbox":
      case "toggle":
        return data.getBoolean(name, inputProps.defaultValue)
      case "date":
        return data.getDate(name, inputProps.defaultValue)
      default:
        return data.getString(name, inputProps.defaultValue)
    }
  }

  /**
   * Subscribe to the form context and update the local state
   */
  useEffect(() => {
    // const valueSubscription = data._v.subscribe(() => {
    //   const newValue = getContextValue()
    //   // only update the local state if the value has changed
    //   if (value !== newValue) {
    //     if (inputProps.debug) {
    //       console.log("USE EFFECT", name, "context value changed", newValue)
    //     }
    //     setLocalValue(newValue)
    //   }
    // })
    const errorSubscription = errors._v.subscribe(() => {
      const newError = getContextError()
      // only update the local state if the error has changed
      if (error !== newError) {
        if (inputProps.debug) {
          console.log("USE EFFECT", name, "context error changed", newError)
        }
        setLocalError(newError)
      }
    })
    return () => {
      // valueSubscription.unsubscribe()
      errorSubscription.unsubscribe()
    }
  }, [data, errors])

  // set the value from the input props or the form context
  const [value, setLocalValue] = useState<InputValue<P>>(inputProps.value ?? inputProps.defaultValue ?? getContextValue())
  // set the value both in the form context and the local state
  const setValue = (newValue: InputValue<P>) => {
    if (newValue !== value) {
      if (inputProps.debug) {
        console.log("SET VALUE", newValue, "old value:", value)
      }
      data.set(name, newValue)
      setLocalValue(newValue)
    }
  }
  // if props value changes, set value
  useEffect(() => {
    let contextValue = getContextValue()
    if (inputProps.debug) {
      console.log("USE EFFECT", name, inputProps.value, inputProps.defaultValue, contextValue)
    }
    setValue(inputProps.value ?? inputProps.defaultValue ?? contextValue)
  }, [inputProps.value, inputProps.defaultValue])

  /**
   * Get the error from the form context
   */
  const getContextError = () => {
    return errors.get(name)
  }
  // set the error from the input props or the form context
  const [error, setLocalError] = useState<string | undefined>(inputProps.error ?? getContextError())
  // set the error both in the form context and the local state
  const setError = (newError: string | undefined) => {
    if (newError !== error) {
      errors.set(name, newError)
      setLocalError(newError)
    }
  }
  // if props error changes, set error
  useEffect(() => {
    setError(inputProps.error ?? getContextError())
    return () => errors.clear(name)
  }, [inputProps.error])

  const validators = useMemo(() => {
    const validators = inputProps.validators ?? []
    if (inputProps.type === "email") {
      validators.push([emailValidator, "Invalid email"])
    }
    if (inputProps.type === "phone") {
      validators.push([phoneValidator, "Invalid phone number"])
    }
    if (inputProps.type === "number") {
      const min = inputProps.min
      const max = inputProps.max
      if (min) validators.push([(value: string) => parseFloat(value) >= min, `Must be greater than ${min}`])
      if (max) validators.push([(value: string) => parseFloat(value) <= max, `Must be less than ${max}`])
    }
    if (inputProps.type === "zipcode") {
      validators.push([zipcodeValidator, "Invalid zipcode"])
    }
    if (inputProps.type === "zip5") {
      validators.push([zip5Validator, "Invalid zipcode"])
    }
    if (inputProps.type === "zip9") {
      validators.push([zip9Validator, "Invalid zipcode"])
    }
    return validators
  }, [])

  /**
   * Debounce the date change to prevent multiple calls to the onChange handler
   */
  const dateChange = useCallback(
    debounce((value: string) => {
      if (inputProps.type === "date" && value !== "") {
        const [year, month, day] = value.split("-").map(Number)
        const now = new Date()
        const date = new Date(year, month - 1, day, now.getHours(), now.getMinutes(), now.getSeconds())
        if (inputProps.debug) {
          console.log("DATE CHANGE", value, date)
        }
        inputProps.onChange?.(date)
      }
    }, 1000),
    [inputProps.type, inputProps.onChange]
  )
  const validate = useCallback(
    (value: string) => {
      if (inputProps.required && value === "") {
        setError(`Required`)
        return
      } else if (value !== "" && inputProps.validators) {
        for (const validator of inputProps.validators) {
          if (Array.isArray(validator)) {
            const [func, message] = validator
            if (!func(value)) {
              setError(message)
              return
            }
          } else {
            if (!validator(value)) {
              setError(`Invalid value`)
              return
            }
          }
        }
      }
      setError(undefined)
    },
    [inputProps.required, validators]
  )

  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    switch (inputProps.type) {
      case "number": {
        const value = parseFloat(event.target.value)
        if (isNaN(value)) {
          setValue(undefined)
        } else {
          const min = inputProps.min
          const max = inputProps.max
          if (min && value < min) {
            setError(`Must be ${min} or greater`)
          } else if (max && value > max) {
            setError(`Must be ${max} or less`)
          } else {
            setError(undefined)
          }
          setValue(value)
        }
        break
      }
      case "checkbox": {
        setValue(event.target.checked)
        break
      }
      case "phone": {
        if ((event.nativeEvent as InputEvent).inputType !== "deleteContentBackward") {
          event.target.value = formatPhone(event.target.value)
        }
        setValue(event.target.value)
        break
      }
      case "zipcode":
      case "zip5":
      case "zip9": {
        if ((event.nativeEvent as InputEvent).inputType !== "deleteContentBackward") {
          event.target.value = formatZipcode(event.target.value, inputProps.type)
        }
        setValue(event.target.value)
        break
      }
      default:
        setValue(event.target.value)
        break
    }

    if (inputProps.onChange) {
      switch (inputProps.type) {
        case "checkbox":
        case "toggle":
          inputProps.onChange(event.target.checked)
          break
        case "number":
          const value = parseFloat(event.target.value)
          if (!isNaN(value)) {
            inputProps.onChange(value)
          }
          break
        case "date":
          dateChange(event.target.value)
          break
        default:
          inputProps.onChange(event.target.value)
          break
      }
    }
  }
  const handleBlur: FocusEventHandler<HTMLInputElement> = (event) => {
    const { value } = event.target
    if (inputProps.onBlur) {
      switch (inputProps.type) {
        case "number":
          inputProps.onBlur(parseFloat(value))
          break
        case "date":
          inputProps.onBlur(new Date(value))
          break
        case "checkbox":
        case "toggle":
          inputProps.onBlur(event.target.checked)
          break
        default:
          inputProps.onBlur(value)
          break
      }
    }
    validate(value)
  }
  const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (ev) => {
    let value = ev.currentTarget.value
    if (error) {
      validate(value)
    }
    if (ev.key === "Enter") {
      if (value === "" && inputProps.required) setError("Required")
      else if (inputProps.onEnter && value && value !== "") {
        ev.preventDefault()
        switch (inputProps.type) {
          case "number":
            inputProps.onEnter(parseFloat(value))
            break
          case "date":
            inputProps.onEnter(new Date(value))
            break
          case "checkbox":
          case "toggle":
            inputProps.onEnter(ev.currentTarget.checked)
            break
          default:
            inputProps.onEnter(value)
            break
        }
      }
    } else if (inputProps.onKeyDown) {
      switch (inputProps.type) {
        case "number":
          console.log("number", value)
          inputProps.onKeyDown(ev, parseFloat(value))
          break
        default:
          inputProps.onKeyDown(ev, value)
          break
      }
    }
  }

  return {
    name,
    value: [value, setValue] as [InputValue<P>, (newValue: InputValue<P>) => void],
    error: [error, setError] as [string | undefined, (error: string | undefined) => void],
    handleChange,
    handleBlur,
    handleKeyDown,
  }
  // return [value, setValue]
}
