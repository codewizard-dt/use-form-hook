import React, { PropsWithChildren, Reducer, useReducer, useState } from "react"
import { Form, FormFieldProps } from "semantic-ui-react"
import { FormResponseHandler, FormSubmitHandler } from '@lib/hooks/useForm';

export interface Field extends FormFieldProps {
  name: string,
  useLabel?: boolean
  initial?: string,
}

export interface Form {
  data: FormData
  setData: (data: FormData) => void
  errors: FormData
  setError: (data: FormData) => void
  clearData: () => void
  clearErrors: () => void
}

export type FormData = { [key: string]: any }

export const FormContext = React.createContext<Form>({
  data: {},
  setData: () => { },
  errors: {},
  setError: () => { },
  clearData: () => { },
  clearErrors: () => { },
})

type ClearAction = { type: 'CLEAR' }
type AddToSet = { type: 'ADD', payload: { [key: string]: string } }


const reducer: Reducer<FormData, ClearAction | AddToSet> = (data, action) => {
  switch (action.type) {
    case ('CLEAR'):
      return {}
    case ('ADD'):
      return { ...data, ...action.payload }
  }
}

export const FormProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [data, dispatchData] = useReducer(reducer, {})
  const [errors, dispatchErrors] = useReducer(reducer, {})
  const setData = (payload: FormData) => { dispatchData({ type: 'ADD', payload }) }
  const setError = (payload: FormData) => { dispatchErrors({ type: 'ADD', payload }) }
  const clearData = () => { dispatchData({ type: 'CLEAR' }) }
  const clearErrors = () => { dispatchErrors({ type: 'CLEAR' }) }

  return (
    <FormContext.Provider value={{
      data, errors,
      setData, setError,
      clearData, clearErrors,
      // submit, setSubmit,
      // respond, setResponse
    }}>
      {children}
    </FormContext.Provider>
  )
}


