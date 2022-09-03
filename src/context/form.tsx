import React, { PropsWithChildren, Reducer, useReducer, useState } from "react"
import { Form, FormFieldProps, FormGroupProps, StrictDropdownItemProps } from "semantic-ui-react"
import { KeyedData, getDot, setDot } from "../lib/dot-notation"
import validator from 'validator'

export type FieldOption = string | { value: string, label: string }
export type FieldValidator = (value: string) => boolean
export type ValidatorWithMsg = [FieldValidator, string | undefined]
export interface Field extends FormFieldProps {
  name: string,
  dataKey?: string,
  useLabel?: boolean
  initial?: string,
  options?: StrictDropdownItemProps[],
  validators?: ValidatorWithMsg | ValidatorWithMsg[]
}
export interface FieldGroup extends FormGroupProps {
  fields?: Field[]
}

export interface FormContextI {
  data: ApiFormData
  getData: (key: string) => KeyedData | string | undefined
  setData: (key: string, value: string) => void
  errors: ApiFormData
  getError: (key: string) => KeyedData | string | undefined
  setError: (key: string, value: string) => void
  clearData: () => void
  clearErrors: (key?: string) => void
  isWaiting: boolean
  setIsWaiting: (isWaiting: boolean) => void
}

export type ApiFormData = { [key: string]: any }

export const FormContext = React.createContext<FormContextI>({
  data: {},
  getData: () => '',
  setData: () => { },
  errors: {},
  getError: () => '',
  setError: () => { },
  clearData: () => { },
  clearErrors: () => { },
  isWaiting: false,
  setIsWaiting: () => { }
})

type ClearAction = { type: 'CLEAR' }
type ClearKey = { type: 'CLEAR_KEY', payload: string }
type AddToSet = { type: 'ADD', payload: [string, string] }

const reducer: Reducer<ApiFormData, ClearAction | ClearKey | AddToSet> = (data, action) => {
  switch (action.type) {
    case ('CLEAR'):
      return {}
    case ('CLEAR_KEY'):
      let fresh = { ...data }
      delete fresh[action.payload]
      return fresh
    case ('ADD'):
      const [key, value] = action.payload
      return setDot(key, value, { ...data })
  }
}

export const FormProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [data, dispatchData] = useReducer(reducer, {})
  const [errors, dispatchErrors] = useReducer(reducer, {})

  const getData = (key: string): KeyedData | string | undefined => getDot(key, data)
  const setData = (nestedKey: string, value: string) => {
    dispatchData({ type: 'ADD', payload: [nestedKey, value] })
  }

  const getError = (key: string): KeyedData | string | undefined => getDot(key, errors)
  const setError = (nestedKey: string, value: string) => {
    dispatchErrors({ type: 'ADD', payload: [nestedKey, value] })
  }

  const clearData = () => { dispatchData({ type: 'CLEAR' }) }
  const clearErrors = (key?: string) => {
    key
      ? dispatchErrors({ type: 'CLEAR_KEY', payload: key })
      : dispatchErrors({ type: 'CLEAR' })
  }

  const [isWaiting, setIsWaiting] = useState<boolean>(false)

  return (
    <FormContext.Provider value={{
      data, getData, setData,
      errors, getError, setError,
      clearData, clearErrors,
      isWaiting, setIsWaiting
    }}>
      {children}
    </FormContext.Provider>
  )
}


