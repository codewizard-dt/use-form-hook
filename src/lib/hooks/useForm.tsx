// import { Field, FormContext, FormData } from "src/context/form"
import { Field, FormContext, FormData } from '../../context/form'
// import { unsnakeCase } from "src/lib/text/replace";
// import upperFirst from "src/lib/text/upperFirst"
import { unsnakeCase, upperFirst } from '../text'
import React, { ChangeEvent, useEffect } from "react"
import { Button, ButtonProps, Form, FormField, Input, Message } from "semantic-ui-react"
// import { ApiResponse, ApiResponseHandler } from 'src/lib/types/responses';
import { ApiResponse, ApiResponseHandler } from '../types'

export type FormSubmitHandler = (data: FormData) => Promise<ApiResponse<any>>
export type FormResponseHandler<T> = (response: ApiResponse<T>) => void
export interface FormProps {
  fields: Field[],
  buttons?: ButtonProps[]
  submit?: FormSubmitHandler
  respond?: FormResponseHandler<any>
  submitBtnText?: string
}

const defaultSubmit: FormSubmitHandler = async (data) => {
  console.log('Submit data', data)
  console.log('Define an onSubmit value for your form')
  return data
}
const defaultRespond: FormResponseHandler<any> = (data) => {
  console.log('Response data', data)
}

// const handleResponse: ApiResponseHandler<{data?:any,error?:string,errors:{[key:string]:string}}> =(response: ApiResponse)

const FormEl: React.FC<FormProps> = ({ fields, buttons = [], submitBtnText = "Submit", submit = defaultSubmit, respond = defaultRespond }) => {
  const { data, setData, errors, setError } = React.useContext(FormContext)
  useEffect(() => {
    for (let field of fields) {
      setData({ [field.name]: field.initial || '' })
    }
  }, [])

  const formatLabelStr = (str: string): string => unsnakeCase(upperFirst(str))

  const renderField =
    ({ name, type = 'text', control = Input, label, useLabel = true, ...fieldProps }: Field, i: number) => (
      <FormField key={i}
        name={name}
        label={label ? label : useLabel ? formatLabelStr(name) : undefined}
        type={type}
        error={errors[name]}
        value={data[name] || ''}
        control={control}
        onChange={(ev: ChangeEvent<HTMLInputElement>) => { setData({ [name]: ev.target.value }) }}
        {...fieldProps} />
    )

  const onSubmit = () => {
    submit(data)
      .then(response => {
        const { data, error, errors } = response
        if (error) { setError({ form: error }) }
        if (errors) setError(errors)
        return response
      })
      .then(respond)
      .catch(err => console.log(err))
  }

  return (
    <Form onSubmit={onSubmit} error={errors.form !== undefined}>
      {fields.map(renderField)}
      {errors.form && <Message negative content={errors.form} />}
      <Button color="blue" content={submitBtnText} />
      {buttons.map((buttonProps, i) => <Button key={i} {...buttonProps} />)}
    </Form>
  )
}

export interface UseForm {
  data: FormData
  setData(data: FormData): void
  errors: FormData
  setError(data: FormData): void
  Form: React.FC<FormProps>
}

export const useForm = (): UseForm => {
  const { data, setData, errors, setError, clearData, clearErrors } = React.useContext(FormContext)
  useEffect(() => {
    clearData();
    clearErrors();
  }, [])

  return {
    data, setData,
    errors, setError,
    Form: FormEl,
  }
}