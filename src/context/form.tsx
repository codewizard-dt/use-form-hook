import React from 'react'
import { PropsWithChildren, createContext, useContext } from "react"
import { DotMap } from "../lib/dot-notation/DotMap"

export interface IFormContext {
  data: DotMap
  errors: DotMap<string>
}

export type ApiFormData = { [key: string]: string }

export const FormContext = createContext<IFormContext>({
  data: new DotMap(),
  errors: new DotMap<string>(),
})

export const useFormContext = () => useContext(FormContext)

export const FormProvider = ({ children }: PropsWithChildren) => {
  const data = new DotMap({
    // debug: true,
    name: "DATA",
  })
  const errors = new DotMap<string>({
    // debug: true,
    name: "ERROR",
  })

  return (
    <FormContext.Provider
      value={{
        data,
        errors,
      }}
    >
      {children}
    </FormContext.Provider>
  )
}
