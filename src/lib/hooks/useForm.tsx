import { Field, FormContext, ApiFormData, FieldGroup } from '../../context/form'
import { unsnakeCase, upperFirst } from '../text'
import React, { ChangeEvent, useEffect, useState } from "react"
import { Button, ButtonProps, Form, FormField, FormGroup, Input, Message } from "semantic-ui-react"
import { ApiResponse, ApiResponseHandler, FormResponseHandler, FormSubmitHandler } from '../types'

export interface FormProps {
  fields: (Field & FieldGroup)[],
  buttons?: ButtonProps[]
  submit?: FormSubmitHandler
  respond?: FormResponseHandler<any>
  submitBtnText?: string
}

const defaultSubmit: FormSubmitHandler = async (data) => {
  console.log('Submit data', data)
  return data
}
const defaultRespond: FormResponseHandler<any> = (data) => {
  console.log('Response data', data)
}

const FormEl: React.FC<FormProps> = ({ fields, buttons = [], submitBtnText = "Submit", submit = defaultSubmit, respond = defaultRespond }) => {
  const { data, setData, errors, setError, isWaiting, setIsWaiting } = React.useContext(FormContext)
  useEffect(() => {
    for (let field of fields) {
      setData({ [field.name]: field.initial || '' })
    }
  }, [])

  const formatLabelStr = (str: string): string => unsnakeCase(upperFirst(str))

  const renderField =
    ({ name, type = 'text', control = Input, label, useLabel = true, ...fieldProps }: Field, i: number | string) => (
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
  const renderGroup = ({ fields = [], ...groupProps }: FieldGroup, i: number) => (
    <FormGroup key={i} {...groupProps}>
      {fields.map((field, j) => renderField(field, `${i}-${j}`))}
    </FormGroup>
  )

  const onSubmit = () => {
    setIsWaiting(true)
    submit(data)
      .then(response => {
        const { data, error, errors } = response
        if (error) { setError({ form: error }) }
        if (errors) setError(errors)
        return response
      })
      .then(respond)
      .then(() => setIsWaiting(false))
      .catch(err => console.log(err))
  }

  return (
    <Form onSubmit={onSubmit} error={errors.form !== undefined}>
      {fields.map((fieldOrGroup, i) => fieldOrGroup.fields ? renderGroup(fieldOrGroup, i) : renderField(fieldOrGroup, i))}

      {errors.form && <Message negative content={errors.form} />}
      <Button disabled={isWaiting} color="blue" content={submitBtnText} />
      {buttons.map((buttonProps, i) => <Button key={i} {...buttonProps} />)}
    </Form>
  )
}

export interface UseForm {
  Form: React.FC<FormProps>
  data: ApiFormData
  setData(data: ApiFormData): void
  errors: ApiFormData
  setError(data: ApiFormData): void
  isWaiting: boolean
  setIsWaiting(isWaiting: boolean): void
}

export const useForm = (): UseForm => {
  const { data, setData, errors, setError, clearData, clearErrors, isWaiting, setIsWaiting } = React.useContext(FormContext)

  useEffect(() => {
    clearData();
    clearErrors();
  }, [])

  return {
    Form: FormEl,
    data, setData,
    errors, setError,
    isWaiting, setIsWaiting
  }
}