import React, { PropsWithChildren, Reducer, useReducer, useState } from "react"
import { Form, FormFieldProps, FormGroupProps } from "semantic-ui-react"
import { NestedData, getDot, setDot } from "../lib/dot-notation"

export interface Field extends FormFieldProps {
  name: string,
  group?: string,
  useLabel?: boolean
  initial?: string,
}
export interface FieldGroup extends FormGroupProps {
  fields?: Field[]
}

export interface FormContextI {
  data: ApiFormData
  getData: (key: string) => NestedData | string | undefined
  setData: (key: string, value: string) => void
  errors: ApiFormData
  getError: (key: string) => NestedData | string | undefined
  setError: (key: string, value: string) => void
  clearData: () => void
  clearErrors: () => void
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
type AddToSet = { type: 'ADD', payload: [string, string] }

const reducer: Reducer<ApiFormData, ClearAction | AddToSet> = (data, action) => {
  switch (action.type) {
    case ('CLEAR'):
      return {}
    case ('ADD'):
      const [key, value] = action.payload
      return setDot(key, value, { ...data })
  }
}

export const FormProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [data, dispatchData] = useReducer(reducer, {})
  const [errors, dispatchErrors] = useReducer(reducer, {})

  const getData = (key: string): NestedData | string | undefined => getDot(key, data)
  const setData = (nestedKey: string, value: string) => {
    dispatchData({ type: 'ADD', payload: [nestedKey, value] })
  }

  const getError = (key: string): NestedData | string | undefined => getDot(key, errors)
  const setError = (nestedKey: string, value: string) => {
    dispatchErrors({ type: 'ADD', payload: [nestedKey, value] })
  }

  const clearData = () => { dispatchData({ type: 'CLEAR' }) }
  const clearErrors = () => { dispatchErrors({ type: 'CLEAR' }) }

  const [isWaiting, setIsWaiting] = useState<boolean>(false)

  return (
    <FormContext.Provider value={{
      data, getData, setData,
      errors, getError, setError,
      clearData, clearErrors,
      isWaiting, setIsWaiting
      // data, errors,
      // setData, setError,
      // clearData, clearErrors,
      // isWaiting, setIsWaiting
    }}>
      {children}
    </FormContext.Provider>
  )
}


