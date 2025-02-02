import React, { PropsWithChildren, useState } from 'react'
import { useForm, useFormContext, FormSubmitHandler, FormProvider } from '../src'
import { Message } from '../src/lib/components/Message'
import { FieldGroup, FieldProps } from '../src/lib/types/InputProps'

export interface FormTestsProps extends PropsWithChildren {
  fields: (FieldProps & FieldGroup)[]
}

export const FormTests = ({ fields = [], children }: FormTestsProps) => {
  const { data } = useFormContext()
  const Test = useForm({
    mutationFn: async () => {
      console.log(data)
      return { data }
    },
    transaction: {
      name: 'FormTests',
      description: 'FormTests',
      op: 'form.submit'
    }
  })
  const [message, setMessage] = useState('')
  const submit: FormSubmitHandler = async (data) => {
    setMessage(JSON.stringify(data, null, 2))
    return { data }
  }
  return (
    <FormProvider>
      <Test.Form mutation={Test.mutation} fields={fields} />
      <Message >
        {message}
      </Message>
    </FormProvider>
  )
}

FormTests.defaultProps = {
}

