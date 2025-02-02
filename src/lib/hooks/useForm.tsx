import uniq from "lodash/uniq"
import merge from "lodash/merge"
import React, { useState, useEffect, useContext, FormEventHandler, useReducer, useCallback } from "react"


import { FormContext } from "../../context/form"
import { ButtonGroup } from "../components/ButtonGroup"
import ImageInput from "../components/ImageInput"
import { Input } from "../components/Input"
import { InputColorPicker } from "../components/InputColorPicker"
import { MessageProps, Message } from "../components/Message"
import { TextArea } from "../components/TextArea"
import { NestedData } from "../dot-notation/DotMap"
import { ButtonProps, ButtonGroupProps } from "../types/ButtonTypes"
import { FieldProps, FieldGroup, InputValue } from "../types/InputProps"
import { Select } from "../components/Select"
import { AppMutationOptions } from "../types/AppHelperTypes"
import { useMutation, UseMutationResult } from "@tanstack/react-query"

/**
 * FormProps
 * * fields: defines the form input fields
 * * mutation: defines the action to take when the form is submitted
 * * submitBtn: the text (or props) for the submit button
 * * buttonGroup: additional buttons for the form
 * * className.form: classes for the form element
 * * className.group: classes for each field group element
 * * theme.field: theme for each field
 * * theme.group: theme for each field group
 * * getSuccessMessage: function to customize success message based on response
 * * getErrorMessage: function to customize error message based on error
 * * confirmStep: if defined, promise must resolve to true in order to submit the form
 */
export interface FormProps<TResponse, TData extends NestedData> {
  fields: (FieldProps | FieldGroup)[]
  mutation: UseMutationResult<TResponse | null, unknown, TData>
  submitBtn?: string | ButtonProps | null
  buttonGroup?: Partial<ButtonGroupProps>
  validateRef?: React.MutableRefObject<() => void>
  className?: {
    form?: string
    group?: string
    field?: string
  }
  recaptcha?: boolean
  getSuccessMessage?: (response: TResponse | null) => string | MessageProps | null
  getErrorMessage?: (err: any) => string | MessageProps | null
  confirmStep?: (data: TData) => Promise<boolean>
}

/**
 * A fully controlled form component with validation, submission, and error handling
 * @param props FormProps
 * @returns fully rendered form component
 */
const FormEl = <TResponse, TData extends NestedData>({
  fields,
  buttonGroup,
  mutation,
  className = {},
  validateRef,
  submitBtn = "Submit",
  recaptcha,
  getSuccessMessage = () => "Submitted!",
  getErrorMessage = () => "We encountered an error. Please try again later.",
  confirmStep,
}: FormProps<TResponse, TData>) => {


  const { data, errors } = useContext(FormContext)
  const [, forceUpdate] = useReducer((x) => x + 1, 0)

  const { mutate, isPending } = mutation

  const isDisabled = false

  const [successMessage, setSuccessMessage] = useState<string | MessageProps | null>(null)
  const [warningMessage, setWarningMessage] = useState<string | MessageProps | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | MessageProps | null>(null)

  const renderField = <P extends FieldProps>(inputProps: P, groupName?: string) => {
    if (inputProps === null) return null
    const fullName = groupName ? `${groupName}.${inputProps.name}` : inputProps.name

    const handleChange = (_value: InputValue<P> | null) => {
      // const change = (_value: any) => i
      if (inputProps.onChange && _value !== undefined) {
        switch (inputProps.type) {
          case "number":
            const num = data.getNumber(fullName)
            if (typeof _value === "number" && num !== _value) inputProps.onChange(_value)
            break
          case "checkbox":
          case "toggle":
            const bool = data.getBoolean(fullName)
            if (typeof _value === "boolean" && bool !== _value) inputProps.onChange(_value)
            break
          case "date":
            const date = data.getDate(fullName)
            if (_value instanceof Date && date !== _value) inputProps.onChange(_value)
            break
          default:
            const str = data.getString(fullName)
            if (typeof _value === "string" && str !== _value) inputProps.onChange(_value)
            break
        }
      }
      if (warningMessage === "No changes made") setWarningMessage(null)
      data.set(fullName, _value)
    }

    const nextClassName = {
      group: className.group,
      input: className.field,
      form: className.form,
      ...inputProps.className,
    }

    switch (inputProps.type) {
      case "image":
        return (
          <ImageInput
            key={fullName}
            {...inputProps}
            // type="image"
            className={nextClassName}
            groupName={groupName}
            onChange={handleChange}
            updateSrc
            defaultValue={data.getString(fullName)}
            error={errors.getString(fullName)}
          />
        )
      case "textarea":
        return <TextArea key={fullName} {...inputProps} className={nextClassName} groupName={groupName} onChange={handleChange} error={errors.getString(fullName)} />
      case "color":
        return <InputColorPicker key={fullName} {...inputProps} className={nextClassName} groupName={groupName} onChange={handleChange} error={errors.getString(fullName)} />
      // case "checkbox":
      // case 'toggle':
      //   return (
      //     <Input
      //       key={fullName}
      //       {...inputProps}
      //       // type="checkbox"
      //       className={nextClassName}
      //       groupName={groupName}
      //       onChange={(bool) => handleChange(bool)}
      //       error={errors.getString(fullName)}
      //     />
      //   )
      case "number":
        return (
          <Input
            key={fullName}
            {...inputProps}
            type="number"
            className={nextClassName}
            groupName={groupName}
            onChange={(num) => handleChange(num.toString())}
            error={errors.getString(fullName)}
          />
        )
      case "select":
        return (
          <Select
            key={fullName}
            showCheckmark={false}
            {...inputProps}
            getLabel={(item) => item}
            getDisplayLabel={(item) => item}
            defaultValue={data.getString(fullName)}
            className={{
              button: "border border-neutral-300 shadow-none pl-2 pr-10 py-[0.4rem]",
              label: "inline-block mt-2 font-normal text-dark-grey-950",
              ...nextClassName,
            }}
            onChange={handleChange}
          />
        )
      case "date":
        return <Input key={fullName} {...inputProps} className={nextClassName} groupName={groupName} onChange={handleChange} error={errors.getString(fullName)} />
      default:
        return (
          <Input
            key={fullName}
            {...inputProps}
            type={inputProps.type}
            className={nextClassName}
            groupName={groupName}
            onChange={handleChange}
            error={errors.getString(inputProps.name)}
          />
        )
    }
  }

  const renderGroup = (fieldGroup: FieldGroup, i: number) => {
    const { name: groupName, label, helper, fields = [] } = fieldGroup
    return (
      <div key={groupName || i} className={fieldGroup.className?.group || className?.group}>
        <div className={fieldGroup.className?.label}>{label}</div>
        <div className={fieldGroup.className?.wrapper}>
          {fields.map((next, i) => {
            if (next === null) return null
            const nextClassName = {
              group: className.group,
              ...next.className,
            }
            return next.fields ? renderGroup({ ...next, className: nextClassName, groupName }, i) : renderField({ ...next, className: nextClassName, groupName }, groupName)
          })}
        </div>
        {helper}
      </div>
    )
  }

  const validate = useCallback(() => {
    const validateField = (field: FieldProps | FieldGroup, groupName?: string) => {
      // TODO: Add type specific validators that already exist in Input.tsx
      if (field === null) return
      if (field.fields) {
        for (let f of field.fields) {
          if (f) validateField(f, field.name)
        }
      } else {
        const { name, required, type, validators = [] } = field
        const fullName = groupName ? `${groupName}.${name}` : name
        const value = data.getString(fullName, "")
        const fieldErrors: string[] = []
        const _error = errors.getString(fullName)
        if (_error) fieldErrors.push(_error)
        if (required && !value) fieldErrors.push(`Required`)
        if (required && type === "checkbox" && value === "false") fieldErrors.push(`Required`)
        validators.forEach((validator) => {
          if (Array.isArray(validator)) {
            const [fn, message] = validator
            if (!fn(value)) fieldErrors.push(message)
          } else {
            if (!validator(value)) fieldErrors.push("Invalid value")
          }
        })
        if (fieldErrors.length > 0) {
          errors.set(fullName, uniq(fieldErrors).join("\n"))
        } else {
          errors.clear(fullName)
        }
      }
    }
    fields.forEach((field) => validateField(field))
    forceUpdate()
  }, [fields, data.value])

  useEffect(() => {
    if (validateRef) validateRef.current = validate
  }, [validate, validateRef])

  const onSubmit: FormEventHandler = (ev) => {
    ev.preventDefault()
    setWarningMessage(null)
    setSuccessMessage(null)
    validate()

    if (!data.hasChanges()) setWarningMessage("No changes made")
    else if (errors.size === 0) {
      if (confirmStep) {
        confirmStep(data.value as TData).then((confirmed) => {
          if (confirmed) submit()
        })
      } else {
        submit()
      }
    }
  }
  const submit = () => {
    mutate(data.value as TData, {
      onSuccess: (response) => {
        setSuccessMessage(getSuccessMessage(response))
      },
      onError: (err) => {
        setErrorMessage(getErrorMessage(err))
      },
    })
  }

  const formError = errorMessage ?? errors.getString("form")

  if (typeof submitBtn === "string")
    submitBtn = {
      content: submitBtn,
      // disabled: isDisabled || isPending || (recaptcha && !validCaptcha),
    }

  const [recaptchaLoaded, setRecaptchaLoaded] = useState(false)

  return (
    <form className={className.form} onSubmit={onSubmit}>
      {fields.map((field, i) => {
        switch (field) {
          case null:
            return null
          default:
            return field.fields ? renderGroup(field, i) : renderField(field)
        }
      })}
      <div className="w-full">
        {formError &&
          (typeof formError === "string" ? (
            <Message type="error" className={{ wrapper: "w-max whitespace-pre" }} content={formError} />
          ) : (
            <Message type="error" className={{ wrapper: "w-max whitespace-pre" }} {...formError} />
          ))}
        {warningMessage &&
          (typeof warningMessage === "string" ? (
            <Message type="warning" className={{ wrapper: "w-max whitespace-pre" }} content={warningMessage} />
          ) : (
            <Message type="warning" className={{ wrapper: "w-max whitespace-pre" }} {...warningMessage} />
          ))}
        {successMessage &&
          (typeof successMessage === "string" ? (
            <Message type="success" className={{ wrapper: "w-max whitespace-pre" }} content={successMessage} />
          ) : (
            <Message type="success" className={{ wrapper: "w-max whitespace-pre" }} {...successMessage} />
          ))}
        <ButtonGroup
          disabled={isDisabled || isPending}
          {...buttonGroup}
          className={{
            ...buttonGroup?.className,
            group: buttonGroup?.className?.group,
          }}
          buttons={[
            ...(buttonGroup?.buttons ?? []),
            ...(submitBtn !== null
              ? [
                {
                  ...submitBtn,
                  useCursorPointer: true,
                  disabled: isDisabled || isPending,
                },
              ]
              : []),
          ]}
        />
      </div>
    </form>
  )
}

interface UseFormOptions<TResponse, TData extends NestedData> extends AppMutationOptions<TResponse, TData> {
  transaction: {
    name: string
    description?: string
    op?: string
  }
  initial?: Partial<TData>
}

// const FormMap = new Map<string,

/**
 * Pass in the mutation options and initial values to get a Form component and a mutation
 * @param options mutation options + initial values
 * @returns an object with a Form component and a mutation
 */
// export const useForm = <TResponse, TData extends NestedData>(options: UseFormOptions<TResponse, TData>): UseForm<TResponse, TData> => {
export const useForm = <TResponse, TData extends NestedData = NestedData>(options: UseFormOptions<TResponse, TData>) => {
  const initialized = React.useRef<boolean>(false)
  const validateRef = React.useRef<() => void>(() => { })
  const { data, errors } = useContext(FormContext)
  const mutation = useMutation({
    ...options,
    onMutate: (_v) => {
      // ** TODO: Reimplement Sentry
      console.log("TODO: Reimplement Sentry")
      // const { name, description = "HTML form submission", op = "form.submit" } = options.transaction
      // const transaction = Sentry.startTransaction({
      //   name,
      //   description,
      //   op,
      // })
      // transaction.setContext("Form Data", _v)
      // return { transaction }
    },
    onSettled: (_data, _error, _variables) => {
      // if (context?.transaction) {
      //   if (_error) {
      //     context.transaction.setStatus("error")
      //   } else {
      //     context.transaction.setStatus("success")
      //   }
      //   context.transaction.finish()
      // }
    },
  })

  if (!initialized.current) {
    if (options.initial) data.initial = merge({}, data._value, data.initial, options.initial)
    // if (options.initial) data.initial = { ...data.initial, ...options.initial }
    initialized.current = true
  }

  return {
    Form: FormEl,
    validateRef,
    mutation,
    data,
    errors,
    hasErrors: () => errors.size > 0,
    validate: () => validateRef.current(),
  }
}
