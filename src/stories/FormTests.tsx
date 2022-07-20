import React, { PropsWithChildren } from 'react'
import { Container, Header } from 'semantic-ui-react'
import { Field, FieldGroup } from 'src/context'
import { useForm } from '../lib/hooks/useForm'
import 'semantic-ui-css/semantic.min.css'

export interface FormTestsProps extends PropsWithChildren {
  fieldsOrGroups: (Field & FieldGroup)[]
}

export const FormTests = ({ fieldsOrGroups = [], children }: FormTestsProps) => {
  const { Form } = useForm()
  return (
    <Container>
      <Header content='Headers' />
      <Form fields={fieldsOrGroups} />

    </Container>
  )
}

FormTests.defaultProps = {
}

