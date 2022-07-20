import React, { PropsWithChildren, Reducer, useReducer, useState } from "react"
import { Form, FormFieldProps } from "semantic-ui-react"

export interface Field extends FormFieldProps {
  name: string,
  useLabel?: boolean
  initial?: string,
}

export interface Form {
  data: ApiFormData
  setData: (data: ApiFormData) => void
  errors: ApiFormData
  setError: (data: ApiFormData) => void
  clearData: () => void
  clearErrors: () => void
  isWaiting: boolean
  setIsWaiting: (isWaiting: boolean) => void
}

export type ApiFormData = { [key: string]: any }

export const FormContext = React.createContext<Form>({
  data: {},
  setData: () => { },
  errors: {},
  setError: () => { },
  clearData: () => { },
  clearErrors: () => { },
  isWaiting: false,
  setIsWaiting: () => { }
})

type ClearAction = { type: 'CLEAR' }
type AddToSet = { type: 'ADD', payload: { [key: string]: string } }


const reducer: Reducer<ApiFormData, ClearAction | AddToSet> = (data, action) => {
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
  const setData = (payload: ApiFormData) => { dispatchData({ type: 'ADD', payload }) }
  const setError = (payload: ApiFormData) => { dispatchErrors({ type: 'ADD', payload }) }
  const clearData = () => { dispatchData({ type: 'CLEAR' }) }
  const clearErrors = () => { dispatchErrors({ type: 'CLEAR' }) }
  const [isWaiting, setIsWaiting] = useState<boolean>(false)

  return (
    <FormContext.Provider value={{
      data, errors,
      setData, setError,
      clearData, clearErrors,
      isWaiting, setIsWaiting
    }}>
      {children}
    </FormContext.Provider>
  )
}


