import { Field, FormContext, FieldGroup, FormContextI, FieldOption } from '../../context/form'
import { unsnakeCase, upperFirst } from '../text'
import React, { ChangeEvent, useEffect } from "react"
import { Button, ButtonProps, Form, FormProps as FormPropsUI, FormField, FormGroup, Input, Message, Header } from "semantic-ui-react"
import { ApiResponseHandler, FormSubmitHandler } from '../types'
import { getFlatFields } from '../fields/getFlatFields'

import '../../style/form.css'

export interface FormProps extends FormPropsUI {
  fields: (Field & FieldGroup)[],
  buttons?: ButtonProps[]
  submit?: FormSubmitHandler
  respond?: ApiResponseHandler<any>
  submitBtnText?: string
}

const defaultSubmit: FormSubmitHandler = async (data) => {
  console.log('Submit data', data)
  return data
}
const defaultRespond: ApiResponseHandler<any> = (data) => {
  console.log('Response data', data)
}

const FormEl: React.FC<FormProps> = ({ fields, buttons = [], submitBtnText = "Submit", submit = defaultSubmit, respond = defaultRespond, ...formProps }) => {
  const { data, getData, setData, errors, setError, isWaiting, setIsWaiting } = React.useContext(FormContext)
  useEffect(() => {
    for (let [name, value] of Object.entries(getFlatFields(fields))) {
      setData(name, value)
    }
  }, [])

  const formatLabelStr = (str: string): string => unsnakeCase(upperFirst(str))

  const mapOption = (option: FieldOption, i: number) => {
    let value: string, label: string
    if (typeof option === 'string') value = label = option
    else {
      value = option.value
      label = option.label
    }
    return <option key={i} value={value}>{label}</option>
  }
  const renderOptions = (options: FieldOption[]) => {
    return (
      <>
        {options.map(mapOption)}
      </>
    )
  }
  const renderField = ({ name, dataKey, type = 'text', control = Input, options, label, useLabel = true, group, ...fieldProps }: Field, i: number | string) => {
    return (
      <FormField key={i}
        name={name}
        label={label ? label : useLabel ? formatLabelStr(name) : undefined}
        type={type}
        children={options ? renderOptions(options) : undefined}
        error={errors[name]}
        value={getData(dataKey || name) || ''}
        control={control}
        onChange={(ev: ChangeEvent<HTMLInputElement>) => { setData(dataKey || name, ev.target.value) }}
        {...fieldProps} />
    )
  }
  const getDataKey = (group: string, field: string) => {
    return group === '' ? field : group + '.' + field
  }
  const renderGroup = ({ name, dataKey, label, fields = [], ...groupProps }: FieldGroup, i: number | string) => (
    <div key={i} className='form-group'>
      {label && <Header as="h4" content={label} />}
      <FormGroup  {...groupProps}>
        {fields.map((field, j) => field.fields
          ? renderGroup({ ...field, dataKey: getDataKey(dataKey || name, field.name) }, `${i}-${j}`)
          : renderField({ ...field, dataKey: getDataKey(dataKey || name, field.name) }, `${i}-${j}`))}
      </FormGroup>
    </div>
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
    <Form className='use-form' unstackable onSubmit={onSubmit} error={errors.form !== undefined} {...formProps}>
      {fields.map((field, i) => field.fields ? renderGroup(field, i) : renderField(field, i))}

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