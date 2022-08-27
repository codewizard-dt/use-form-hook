import React, { useState } from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { within, userEvent } from '@storybook/testing-library';
import { FormTests } from './FormTests';
import { Container, Dropdown, Header, Message } from 'semantic-ui-react';
import { FormProvider } from '../context/form'
import { FormSubmitHandler, useForm } from '../lib'

export default {
  title: 'Example/Form',
  component: FormTests,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof FormTests>;

const Template: ComponentStory<typeof FormTests> = (args) => <FormTests {...args} />;

export const Fields = () => {
  const { Form, data } = useForm()
  const [message, setMessage] = useState('')
  const submit: FormSubmitHandler = async (data) => {
    setMessage(JSON.stringify(data, null, 2))
    return { data }
  }

  return (
    <FormProvider>
      <Container style={{ marginTop: '1rem' }}>
        <Header content='@codewizard-dt/use-form-hook' />
        <Form display='edit' submit={submit} fields={[
          { name: 'best_restaurant', required: true },
          { name: 'worst_restaurant' }
        ]}
        />
        {message !== '' && <Message>
          <pre>{message}</pre>
        </Message>}
      </Container>
    </FormProvider>
  )
}
export const GroupWithName = () => {
  const { Form } = useForm()
  const [message, setMessage] = useState('')
  const submit: FormSubmitHandler = async (data) => {
    setMessage(JSON.stringify(data, null, 2))
    return { data }
  }
  return (
    <FormProvider>
      <Container style={{ marginTop: '1rem' }}>
        <Header content='@codewizard-dt/use-form-hook' />
        <Header content='Nested Field Groups with Names' />
        <Form display='edit' submit={submit} fields={[
          {
            name: 'user', label: 'User',
            fields: [
              { name: 'name', initial: 'David' },
              { name: 'password', type: 'password' },
              { name: 'favorite_food', control: 'select', options: ['apples', 'bananas', { value: 'string cheese', label: 'StRiNg CheeSe' }] },
              {
                name: 'settings', label: 'Settings',
                fields: [
                  { name: 'contact_pref', control: 'select', options: ['phone', 'email', 'smoke signal'] },
                  { name: 'email', control: 'select', options: ['none', 'marketing', 'all'] },
                ],
              },
            ],
          },
        ]} />
        {message !== '' && <Message>
          <pre>{message}</pre>
        </Message>}
      </Container>
    </FormProvider>
  )
}
export const GroupsWithoutNames = () => {
  const { Form } = useForm()
  const [message, setMessage] = useState('')
  const submit: FormSubmitHandler = async (data) => {
    setMessage(JSON.stringify(data, null, 2))
    return { data }
  }
  return (
    <FormProvider>
      <Container style={{ marginTop: '1rem' }}>
        <Header content='@codewizard-dt/use-form-hook' />
        <Header content='Nested Field Groups without `names`' />
        <Form submit={submit} fields={
          [
            {
              name: '',
              label: 'User',
              fields: [
                { name: 'name', initial: 'Sally' },
                { name: 'password', type: 'password' },
                { name: 'favorite_food', control: 'select', options: ['apples', 'bananas', { value: 'string cheese', label: 'StRiNg CheeSe' }] },
                {
                  name: '',
                  label: 'Settings',
                  fields: [
                    { name: 'contact_pref', control: 'select', options: ['phone', 'email', 'smoke signal'] },
                    { name: 'email', control: 'select', options: ['none', 'marketing', 'all'] },
                  ],
                },

              ],
            },
          ]
        } />
        {message !== '' && <Message>
          <pre>{message}</pre>
        </Message>}
      </Container>
    </FormProvider>
  )
}
export const DateTime = () => {
  const { Form } = useForm()
  const [message, setMessage] = useState('')
  const submit: FormSubmitHandler = async (data) => {
    setMessage(JSON.stringify(data, null, 2))
    return { data }
  }

  return (
    <FormProvider>
      <Container style={{ marginTop: '1rem' }}>
        <Header content='@codewizard-dt/use-form-hook' />
        <Form display='edit' submit={submit} fields={[
          { name: 'start', type: 'datetime' },
          // { name: 'finish' }
        ]}
        />
        {message !== '' && <Message>
          <pre>{message}</pre>
        </Message>}
      </Container>
    </FormProvider>
  )

}
export const Disabled = () => {
  const { Form, data } = useForm()
  const [message, setMessage] = useState('')
  const submit: FormSubmitHandler = async (data) => {
    setMessage(JSON.stringify(data, null, 2))
    return { data }
  }

  return (
    <FormProvider>
      <Container style={{ marginTop: '1rem' }}>
        <Header content='@codewizard-dt/use-form-hook' />
        <Form display='disabled' submit={submit} fields={[
          {
            name: "",
            widths: 'two',
            fields: [
              { name: 'best_restaurant' },
              { name: 'worst_restaurant' }
            ]
          },
          {
            name: 'Reviews', control: 'textarea', initial: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas eu ultrices diam. Suspendisse venenatis quam ac ultricies gravida. Quisque fringilla metus massa, vitae vestibulum augue faucibus eget. Nam nec libero placerat, porta nulla et, pellentesque metus. Pellentesque vulputate dui et consequat convallis. Proin facilisis sem eu sem sodales, vel iaculis risus gravida. Vivamus quis orci blandit, venenatis nisi rhoncus, porta quam. Morbi quis efficitur massa. Morbi pharetra laoreet laoreet. Quisque egestas dolor ac massa tincidunt, sed aliquet odio suscipit. Praesent enim eros, vestibulum a erat scelerisque, bibendum sollicitudin enim. Aliquam non libero vel magna bibendum eleifend. Sed bibendum ipsum ac orci sodales, sit amet luctus neque iaculis. Vivamus mauris eros, porta vitae erat eget, luctus feugiat nunc.'
          }
        ]}
        />
        {message !== '' && <Message>
          <pre>{message}</pre>
        </Message>}
      </Container>
    </FormProvider>
  )

}
export const Toggleable = () => {
  const { Form, data } = useForm()
  const [message, setMessage] = useState('')
  const submit: FormSubmitHandler = async (data) => {
    setMessage(JSON.stringify(data, null, 2))
    return { data }
  }

  return (
    <FormProvider>
      <Container style={{ marginTop: '1rem' }}>
        <Header content='@codewizard-dt/use-form-hook' />
        <Form display='toggle' submit={submit} fields={[
          {
            name: "",
            widths: 'two',
            fields: [
              { name: 'best_restaurant' },
              { name: 'worst_restaurant' }
            ]
          }
        ]}
        />
        {message !== '' && <Message>
          <pre>{message}</pre>
        </Message>}
      </Container>
    </FormProvider>
  )

}
export const SuccessMessage = () => {
  const { Form, data } = useForm()
  const [message, setMessage] = useState('')
  const submit: FormSubmitHandler = async (data) => {
    setMessage(JSON.stringify(data, null, 2))
    return { data }
  }

  return (
    <FormProvider>
      <Container style={{ marginTop: '1rem' }}>
        <Header content='@codewizard-dt/use-form-hook' />
        <Form successMessage='Success!' display='edit' submit={submit} fields={[
          { name: 'best_restaurant' },
          { name: 'worst_restaurant' }
        ]}
        />
        {message !== '' && <Message>
          <pre>{message}</pre>
        </Message>}
      </Container>
    </FormProvider>
  )
}
