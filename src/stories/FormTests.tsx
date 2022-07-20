import React, { PropsWithChildren } from 'react'
import { Container, Header } from 'semantic-ui-react'
import { Field, FieldGroup } from 'src/context'
import { useForm } from '../lib/hooks/useForm'
import 'semantic-ui-css/semantic.min.css'
import { FormProvider } from '../context/form'

export interface FormTestsProps extends PropsWithChildren {
  fieldsOrGroups: (Field & FieldGroup)[]
}

export const FormTests = ({ fieldsOrGroups = [], children }: FormTestsProps) => {
  const { Form } = useForm()
  return (
    <FormProvider>
      <Container>
        <Header content='Headers' />
        <Form fields={fieldsOrGroups} />
      </Container>
    </FormProvider>
  )
}

FormTests.defaultProps = {
}

