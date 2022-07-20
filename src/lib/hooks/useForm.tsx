import { Field, FormContext, ApiFormData, FieldGroup, FormContextI } from '../../context/form'
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
  const { data, getData, setData, errors, setError, isWaiting, setIsWaiting } = React.useContext(FormContext)
  useEffect(() => {
    for (let field of fields) {
      if (field.fields) {
        for (let innerField of field.fields) {
          setData(`${field.name}.${innerField.name}`, innerField.initial || '')
        }
      } else {
        setData(field.name, field.initial || '')
      }
    }
  }, [])

  const formatLabelStr = (str: string): string => unsnakeCase(upperFirst(str))

  const renderField = ({ name, type = 'text', control = Input, label, useLabel = true, group, ...fieldProps }: Field, i: number | string) => {
    const nestedName = group ? `${group}.${name}` : name
    return (
      <FormField key={i}
        name={nestedName}
        label={label ? label : useLabel ? formatLabelStr(name) : undefined}
        type={type}
        error={errors[name]}
        value={getData(nestedName) || ''}
        control={control}
        onChange={(ev: ChangeEvent<HTMLInputElement>) => { setData(nestedName, ev.target.value) }}
        {...fieldProps} />
    )
  }
  const renderGroup = ({ name, fields = [], ...groupProps }: FieldGroup, i: number) => (
    <FormGroup key={i} {...groupProps}>
      {fields.map((field, j) => renderField({ ...field, group: name }, `${i}-${j}`))}
    </FormGroup>
  )

  const onSubmit = () => {
    setIsWaiting(true)
    submit(data)
      .then(response => {
        const { data, error, errors } = response
        if (error) { setError('form', error) }
        if (errors) {
          for (let errName in errors) { setError(errName, errors[errName]) }
          // setError(errors)
        }
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

export interface UseForm extends FormContextI {
  Form: React.FC<FormProps>
}

export const useForm = (): UseForm => {
  const context = React.useContext(FormContext)

  useEffect(() => {
    context.clearData();
    context.clearErrors();
  }, [])

  return {
    Form: FormEl,
    ...context
  }
}