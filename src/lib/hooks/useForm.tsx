import { Field, FormContext, FieldGroup, FormContextI, FieldOption, ApiFormData, ValidatorWithMsg } from '../../context/form';
import { unsnakeCase, upperFirst } from '../text'
import React, { ChangeEvent, useEffect, useState } from "react"
import { Button, ButtonProps, Form, FormProps as FormPropsUI, FormField, FormGroup, Input, Message, Header, Dropdown, TextArea, Rating } from "semantic-ui-react"
import { ApiResponseHandler, FormSubmitHandler } from '../types'
import { getFlatFields } from '../fields/getFlatFields'

import '../../style/form.css'
import hasChanges from '../fields/hasChanges'
import { getFlatObj } from '../dot-notation';
import { uniq } from 'lodash';

export interface FormProps extends FormPropsUI {
  fields: (Field & FieldGroup)[],
  buttons?: ButtonProps[]
  submit?: FormSubmitHandler
  respond?: ApiResponseHandler<any>
  submitBtnText?: string
  display?: 'disabled' | 'edit' | 'toggle'
  successMessage?: string
}
interface ChangeEvData {
  value: string
}
interface RateEvData {
  rating: string
}

const defaultSubmit: FormSubmitHandler = async (data) => {
  console.log('Submit data', data)
  return data
}
const defaultRespond: ApiResponseHandler<any> = (data) => {
  console.log('Response data', data)
}

const FormEl: React.FC<FormProps> = ({
  fields,
  buttons = [],
  submitBtnText = "Submit",
  submit = defaultSubmit,
  respond = defaultRespond,
  display = 'edit',
  successMessage,
  ...formProps }) => {

  const { data, getData, setData, errors, setError, clearErrors, isWaiting, setIsWaiting } = React.useContext(FormContext)

  const [isDisabled, setIsDisabled] = useState<boolean>(display !== 'edit')
  const [initial, setInitial] = useState<ApiFormData>(getFlatFields(fields))
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    for (let [name, value] of Object.entries(getFlatFields(fields))) {
      setData(name, value)
    }
  }, [])
  useEffect(() => {
    setIsDisabled(display !== 'edit')
  }, [display])

  const formatLabelStr = (str: string): string => unsnakeCase(upperFirst(str))

  const renderField = ({ name, dataKey, type = 'text', control = Input, label, useLabel = true, group, validators, ...fieldProps }: Field, i: number | string) => {
    if (control === 'select') control = Dropdown
    else if (control === 'textarea') control = TextArea

    if (control === Rating) {
      let ratingDefaults = {
        onRate: (ev: any, { rating }: RateEvData) => { setData(dataKey || name, `${rating}`) },
        defaultRating: getData(dataKey || name) || initial[dataKey || name] || '5',
        icon: 'star', maxRating: 10
      }
      setTimeout(() => { if (!getData(dataKey || name)) setData(dataKey || name, ratingDefaults.defaultRating) }, 0)
      fieldProps = { ...ratingDefaults, ...fieldProps }
    } else if (control === Dropdown) {
      let options = fieldProps.options
      if (!options) throw new Error('Options not given for Dropdown')
      let firstValue = typeof options[0] === 'string' ? options[0] : options[0].value
      let defaultValue = getData(dataKey || name) || initial[dataKey || name] || firstValue
      setTimeout(() => { if (!getData(dataKey || name)) setData(dataKey || name, defaultValue) }, 0)
    }

    const value = getData(dataKey || name) || ''
    const requiredWarning = (): boolean => {
      const missingAndRequired = fieldProps.required && value === ''
      missingAndRequired ? setError(name, 'Required') : clearErrors(name)
      return missingAndRequired
    }
    const validate = (): boolean => {
      if (requiredWarning()) return true
      // let value = getData(dataKey || name) || ''
      if (typeof value !== 'string') return true
      else {
        if (!validators) return true
        else if (value === '' && !fieldProps.required) return true
        else if (Array.isArray(validators[0])) {
          let fieldErrors = []
          for (let [fn, msg = 'Invalid response'] of validators as ValidatorWithMsg[]) {
            if (!fn(value)) fieldErrors.push(msg)
          }
          let isValid = fieldErrors.length === 0
          isValid ? clearErrors(name) : setError(name, uniq(fieldErrors).join('\n'))
          return isValid
        }
        else {
          let [fn, msg = 'Invalid response'] = validators as ValidatorWithMsg
          let isValid = fn(value)
          isValid ? clearErrors(name) : setError(name, msg)
          return isValid
        }
      }
    }
    return (
      <FormField key={i}
        name={name}
        label={label ? label : useLabel ? formatLabelStr(name) : undefined}
        type={type}
        disabled={isDisabled}
        error={errors[name]}
        value={getData(dataKey || name) || ''}
        control={control}
        onBlur={validate}
        onChange={(ev: any, { value }: ChangeEvData) => { setData(dataKey || name, value) }}
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
    if (hasChanges(initial, data)) {
      setIsWaiting(true)
      submit(data)
        .then((response = {}) => {
          const { error, errors } = response
          if (error) {
            setError('form', error)
            setMessage(null)
          }
          if (errors) {
            for (let errName in errors) { setError(errName, errors[errName]) }
            setMessage(null)
          }
          if (!error && !errors) {
            clearErrors()
            setInitial(getFlatObj(data))
            if (successMessage) setMessage(successMessage)
          }
          return response
        })
        .then(respond)
        .then(() => setIsWaiting(false))
        .catch(err => {
          if (err.message) setError('form', err.message)
          setIsWaiting(false)
          respond(err)
          console.error(err)
        })
    } else {
      // setError('form', 'No changes')
      setMessage(null)
    }
  }

  return (
    <Form className={`use-form ${isDisabled ? 'disabled' : 'editing'}`} unstackable onSubmit={onSubmit} error={errors.form !== undefined} {...formProps}>
      {fields.map((field, i) => field.fields ? renderGroup(field, i) : renderField(field, i))}
      <div>
        {errors.form && <Message negative content={errors.form} />}
        {message && <Message positive content={message} />}
        {!isDisabled && <Button disabled={isWaiting || !hasChanges(initial, data)} color="blue" content={submitBtnText} />}
        {!isDisabled && buttons.map((buttonProps, i) => <Button key={i} type="button" {...buttonProps} />)}
        {display === 'toggle' && <Button content={isDisabled ? 'Edit' : 'Cancel'} type='button' onClick={() => setIsDisabled(!isDisabled)} />}
      </div>
    </Form>
  )
}

export type UseForm = React.FC<FormProps>

export const useForm = (): UseForm => {
  const context = React.useContext(FormContext)

  useEffect(() => {
    context.clearData();
    context.clearErrors();
  }, [])

  return FormEl
}