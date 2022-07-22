import React, { PropsWithChildren, useState } from 'react'
import { Container, Header, Message } from 'semantic-ui-react'
import { Field, FieldGroup } from 'src/context'
import { useForm } from '../lib/hooks/useForm'
import 'semantic-ui-css/semantic.min.css'
import { FormProvider } from '../context/form'
import { FormSubmitHandler } from '../lib'

export interface FormTestsProps extends PropsWithChildren {
  fields: (Field & FieldGroup)[]
}

export const FormTests = ({ fields = [], children }: FormTestsProps) => {
  const { Form } = useForm()
  const [message, setMessage] = useState('')
  const submit: FormSubmitHandler = async (data) => {
    setMessage(JSON.stringify(data, null, 2))
    return { data }
  }
  return (
    <FormProvider>
      <Container>
        <Header content='@codewizard-dt/use-form-hook' />
        <Form fields={fields} />
        <Message >
          {message}
        </Message>
      </Container>
    </FormProvider>
  )
}

FormTests.defaultProps = {
}

