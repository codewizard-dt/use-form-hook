// import uniq from "lodash/uniq"
// // import merge from "lodash/merge"
// import { useState, useEffect, useContext, FormEventHandler, useReducer, useRef, useCallback } from "react"

// import ReCAPTCHA from "react-google-recaptcha"

// import { UseMutationResult, useMutation } from "@tanstack/react-query"
// import { useCaptcha } from "./useCaptcha"
// // import * as Sentry from "@sentry/react"
// import { ButtonGroup } from "#src/components/basic/ButtonGroup"
// import { MessageProps, Message } from "#src/components/basic/Message"
// import { ButtonProps, ButtonGroupProps } from "#src/components/basic/types/ButtonTypes"
// import { InputColorPicker } from "#src/components/input/InputColorPicker"
// import { FieldGroup, FieldProps } from "#src/components/input/types/InputProps"
// import { ClassList, getClasses, hasMargin } from "#src/components/theme/helpers"
// import { FormContext } from "#src/context/FormContext"
// import { NestedData } from "#src/util/DotMap"
// import { AppMutationOptions } from "../react-query/AppHelperTypes"
// import { Input } from "#src/components/input/Input"
// import { TextArea } from "#src/components/input/TextArea"

// import { clientOnly } from "vike-react/clientOnly"
// import { SelectTyped } from "#src/components/headless-ui/SelectTyped"

// const ImageInput = clientOnly(() => import("#src/components/input/ImageInput"))

// /**
//  * FormProps
//  * * fields: defines the form input fields
//  * * mutation: defines the action to take when the form is submitted
//  * * submitBtn: the text (or props) for the submit button
//  * * buttonGroup: additional buttons for the form
//  * * className.form: classes for the form element
//  * * className.group: classes for each field group element
//  * * theme.field: theme for each field
//  * * theme.group: theme for each field group
//  * * getSuccessMessage: function to customize success message based on response
//  * * getErrorMessage: function to customize error message based on error
//  * * confirmStep: if defined, promise must resolve to true in order to submit the form
//  */
// export interface FormProps<TResponse, TData extends NestedData> {
//   fields: (FieldProps | FieldGroup)[]
//   mutation: UseMutationResult<TResponse | null, unknown, TData>
//   submitBtn?: string | ButtonProps | null
//   buttonGroup?: Partial<ButtonGroupProps>
//   validateRef?: React.MutableRefObject<() => void>
//   className?: {
//     form?: ClassList
//     group?: ClassList
//     field?: ClassList
//   }
//   recaptcha?: boolean
//   getSuccessMessage?: (response: TResponse | null) => string | MessageProps | null
//   getErrorMessage?: (err: any) => string | MessageProps | null
//   confirmStep?: (data: TData) => Promise<boolean>
// }

// /**
//  * A fully controlled form component with validation, submission, and error handling
//  * @param props FormProps
//  * @returns fully rendered form component
//  */
// const FormEl = <TResponse, TData extends NestedData>({
//   fields,
//   buttonGroup,
//   mutation,
//   className = {},
//   validateRef,
//   submitBtn = "Submit",
//   recaptcha,
//   getSuccessMessage = () => "Submitted!",
//   getErrorMessage = () => "We encountered an error. Please try again later.",
//   confirmStep,
// }: FormProps<TResponse, TData>) => {
//   const [captchaValue, setCaptchaValue] = useState<string | null>(null)
//   const [validCaptcha, setValidCaptcha] = useState<boolean>(false)

//   const verifyCaptcha = useCaptcha({
//     onSuccess: (response) => {
//       console.log(response)
//       if (response) {
//         setValidCaptcha(response.success)
//       }
//     },
//   })

//   useEffect(() => {
//     if (captchaValue) verifyCaptcha.mutate(captchaValue)
//   }, [captchaValue])

//   const { data, errors } = useContext(FormContext)
//   const [, forceUpdate] = useReducer((x) => x + 1, 0)

//   const { mutate, isLoading } = mutation

//   const isDisabled = false

//   const [successMessage, setSuccessMessage] = useState<string | MessageProps | null>(null)
//   const [warningMessage, setWarningMessage] = useState<string | MessageProps | null>(null)
//   const [errorMessage, setErrorMessage] = useState<string | MessageProps | null>(null)

//   const renderField = (inputProps: FieldProps, groupName?: string) => {
//     if (inputProps === null) return null
//     const { name, onChange } = inputProps
//     const fullName = groupName ? `${groupName}.${name}` : name

//     const handleChange = (_value: string) => {
//       const v = data.get(fullName)
//       if (v === _value) return
//       if (onChange) onChange(_value)
//       if (warningMessage === "No changes made") setWarningMessage(null)
//       data.set(fullName, _value)
//     }

//     const nextClassName = {
//       group: className.group,
//       input: className.field,
//       form: className.form,
//       ...inputProps.className,
//     }

//     switch (inputProps.type) {
//       case "image":
//         return (
//           <ImageInput
//             key={fullName}
//             {...inputProps}
//             className={nextClassName}
//             groupName={groupName}
//             onChange={handleChange}
//             updateSrc
//             defaultValue={data.getString(fullName)}
//             error={errors.getString(fullName)}
//           />
//         )
//       case "textarea":
//         return <TextArea key={fullName} {...inputProps} className={nextClassName} groupName={groupName} onChange={handleChange} error={errors.getString(fullName)} />
//       case "color":
//         return <InputColorPicker key={fullName} {...inputProps} className={nextClassName} groupName={groupName} onChange={handleChange} error={errors.getString(fullName)} />
//       case "select":
//         return (
//           <SelectTyped
//             key={fullName}
//             showCheckmark={false}
//             {...inputProps}
//             getLabel={(item) => item}
//             defaultOption={undefined}
//             selectedOption={data.getString(fullName)}
//             className={{
//               button: "border border-neutral-300 shadow-none pl-2 pr-10 py-[0.4rem]",
//               label: "inline-block mt-2 font-normal text-dark-grey-950",
//               ...nextClassName,
//             }}
//             onChange={handleChange}
//           />
//         )
//       default: {
//         return (
//           <Input key={fullName} {...inputProps} type={inputProps.type} className={nextClassName} groupName={groupName} onChange={handleChange} error={errors.getString(name)} />
//         )
//       }
//     }
//   }

//   const renderGroup = (fieldGroup: FieldGroup, i: number) => {
//     const { name: groupName, label, helper, fields = [] } = fieldGroup
//     return (
//       <div key={groupName || i} className={getClasses(["form-group", fieldGroup.className?.group || className?.group])}>
//         <div className={getClasses(["form-group-label", fieldGroup.className?.label])}>{label}</div>
//         <div className={getClasses(["form-group-wrapper", fieldGroup.className?.wrapper])}>
//           {fields.map((next, i) => {
//             if (next === null) return null
//             const nextClassName = {
//               group: className.group,
//               ...next.className,
//             }
//             return next.fields ? renderGroup({ ...next, className: nextClassName, groupName }, i) : renderField({ ...next, className: nextClassName, groupName }, groupName)
//           })}
//         </div>
//         {helper}
//       </div>
//     )
//   }

//   const validate = useCallback(() => {
//     const validateField = (field: FieldProps | FieldGroup, groupName?: string) => {
//       // TODO: Add type specific validators that already exist in Input.tsx
//       if (field === null) return
//       if (field.fields) {
//         for (let f of field.fields) {
//           if (f) validateField(f, field.name)
//         }
//       } else {
//         const { name, required, type, validators = [] } = field
//         const fullName = groupName ? `${groupName}.${name}` : name
//         const value = data.getString(fullName, "")
//         const fieldErrors: string[] = []
//         const _error = errors.getString(fullName)
//         if (_error) fieldErrors.push(_error)
//         if (required && !value) fieldErrors.push(`Required`)
//         if (required && type === "checkbox" && value === "false") fieldErrors.push(`Required`)
//         validators.forEach((validator) => {
//           if (Array.isArray(validator)) {
//             const [fn, message] = validator
//             if (!fn(value)) fieldErrors.push(message)
//           } else {
//             if (!validator(value)) fieldErrors.push("Invalid value")
//           }
//         })
//         if (fieldErrors.length > 0) {
//           errors.set(fullName, uniq(fieldErrors).join("\n"))
//         } else {
//           errors.clear(fullName)
//         }
//       }
//     }
//     fields.forEach((field) => validateField(field))
//     forceUpdate()
//   }, [fields, data.value])

//   useEffect(() => {
//     if (validateRef) validateRef.current = validate
//   }, [validate, validateRef])

//   const onSubmit: FormEventHandler = (ev) => {
//     ev.preventDefault()
//     setWarningMessage(null)
//     setSuccessMessage(null)
//     validate()

//     if (!data.hasChanges()) setWarningMessage("No changes made")
//     else if (errors.size === 0) {
//       if (confirmStep) {
//         confirmStep(data.value as TData).then((confirmed) => {
//           if (confirmed) submit()
//         })
//       } else {
//         submit()
//       }
//     }
//   }
//   const submit = () => {
//     mutate(data.value as TData, {
//       onSuccess: (response) => {
//         setSuccessMessage(getSuccessMessage(response))
//       },
//       onError: (err) => {
//         setErrorMessage(getErrorMessage(err))
//       },
//     })
//   }

//   const formError = errorMessage ?? errors.getString("form")

//   if (typeof submitBtn === "string")
//     submitBtn = {
//       content: submitBtn,
//       // disabled: isDisabled || isLoading || (recaptcha && !validCaptcha),
//     }

//   return (
//     <form className={getClasses(className.form)} onSubmit={onSubmit}>
//       {fields.map((field, i) => {
//         switch (field) {
//           case null:
//             return null
//           default:
//             return field.fields ? renderGroup(field, i) : renderField(field)
//         }
//       })}
//       <div className="w-full">
//         {formError &&
//           (typeof formError === "string" ? (
//             <Message type="error" className={{ wrapper: "w-max whitespace-pre" }} content={formError} />
//           ) : (
//             <Message type="error" className={{ wrapper: "w-max whitespace-pre" }} {...formError} />
//           ))}
//         {warningMessage &&
//           (typeof warningMessage === "string" ? (
//             <Message type="warning" className={{ wrapper: "w-max whitespace-pre" }} content={warningMessage} />
//           ) : (
//             <Message type="warning" className={{ wrapper: "w-max whitespace-pre" }} {...warningMessage} />
//           ))}
//         {successMessage &&
//           (typeof successMessage === "string" ? (
//             <Message type="success" className={{ wrapper: "w-max whitespace-pre" }} content={successMessage} />
//           ) : (
//             <Message type="success" className={{ wrapper: "w-max whitespace-pre" }} {...successMessage} />
//           ))}
//         {recaptcha && (
//           <div className="pt-4">
//             <ReCAPTCHA sitekey={"6Le4zgMqAAAAAOMr493cqFquSpQoGjKmzDUkCPDB"} onChange={(value) => setCaptchaValue(value)} />
//           </div>
//         )}
//         <ButtonGroup
//           disabled={isDisabled || isLoading}
//           {...buttonGroup}
//           className={{
//             ...buttonGroup?.className,
//             group: getClasses([buttonGroup?.className?.group, (c) => !hasMargin(c) && "mt-4"]),
//           }}
//           buttons={[
//             ...(buttonGroup?.buttons ?? []),
//             ...(submitBtn !== null
//               ? [
//                 {
//                   ...submitBtn,
//                   useCursorPointer: true,
//                   disabled: isDisabled || isLoading || (recaptcha && !validCaptcha),
//                 },
//               ]
//               : []),
//           ]}
//         />
//       </div>
//     </form>
//   )
// }

// interface UseFormOptions<TResponse, TData extends NestedData> extends AppMutationOptions<TResponse, TData> {
//   transaction: {
//     name: string
//     description?: string
//     op?: string
//   }
//   initial?: Partial<TData>
// }

// /**
//  * Pass in the mutation options and initial values to get a Form component and a mutation
//  * @param options mutation options + initial values
//  * @returns an object with a Form component and a mutation
//  */
// // export const useForm = <TResponse, TData extends NestedData>(options: UseFormOptions<TResponse, TData>): UseForm<TResponse, TData> => {
// export const useForm = <TResponse, TData extends NestedData>(options: UseFormOptions<TResponse, TData>) => {
//   const initialized = useRef<boolean>(false)
//   const validateRef = useRef<() => void>(() => { })
//   const { data, errors } = useContext(FormContext)
//   const mutation = useMutation({
//     ...options,
//     onMutate: (_v) => {
//       // ** TODO: Reimplement Sentry
//       console.log("TODO: Reimplement Sentry")
//       // const { name, description = "HTML form submission", op = "form.submit" } = options.transaction
//       // const transaction = Sentry.startTransaction({
//       //   name,
//       //   description,
//       //   op,
//       // })
//       // transaction.setContext("Form Data", _v)
//       // return { transaction }
//     },
//     onSettled: (_data, _error, _variables) => {
//       // if (context?.transaction) {
//       //   if (_error) {
//       //     context.transaction.setStatus("error")
//       //   } else {
//       //     context.transaction.setStatus("success")
//       //   }
//       //   context.transaction.finish()
//       // }
//     },
//   })

//   if (!initialized.current) {
//     if (options.initial) data.initial = options.initial
//     initialized.current = true
//   }

//   return {
//     Form: FormEl,
//     validateRef,
//     mutation,
//     data,
//     errors,
//     hasErrors: () => errors.size > 0,
//     validate: () => validateRef.current(),
//   }
// }
