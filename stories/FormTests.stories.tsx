import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { FormTests } from './FormTests';
import { FormProvider, useFormContext } from '../src/context/form';
import { FormSubmitHandler, useForm } from '../src/lib';
import { Message } from '../src/lib/components/Message';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a shared QueryClient configuration
const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    }
  }
});

const meta: Meta<typeof FormTests> = {
  title: 'Example/Form',
  component: FormTests,
  parameters: {
    layout: 'fullscreen'
  },
  // Add a decorator that provides both QueryClient and FormProvider
  decorators: [
    (Story) => {
      const queryClient = createTestQueryClient();
      return (
        <QueryClientProvider client={queryClient}>
          <FormProvider>
            <Story />
          </FormProvider>
        </QueryClientProvider>
      );
    }
  ]
};

export default meta;
type Story = StoryObj<typeof FormTests>;

export const Fields: Story = {
  render: () => {
    const Test = useForm({
      mutationFn: async () => {
        console.log(data);
        return { data };
      },
      transaction: {
        name: 'FormTests',
        description: 'FormTests',
        op: 'form.submit'
      }
    });
    const { data } = useFormContext();
    const [message, setMessage] = useState('');
    const submit: FormSubmitHandler = async (data) => {
      setMessage(JSON.stringify(data, null, 2));
      return { data };
    };

    return (
      <div>
        <Test.Form mutation={Test.mutation} fields={[
          { name: 'best_restaurant', label: 'Best Restaurant', type: 'text', required: true },
          { name: 'worst_restaurant', label: 'Worst Restaurant', type: 'text' }
        ]}
        />
      </div>
    );
  }
};

export const DropdownField: Story = {
  render: () => {
    const Test = useForm({
      mutationFn: async () => {
        console.log(data);
        return { data };
      },
      transaction: {
        name: 'FormTests',
        description: 'FormTests',
        op: 'form.submit'
      }
    });
    const { data } = useFormContext();
    const [message, setMessage] = useState('');
    const submit: FormSubmitHandler = async (data) => {
      setMessage(JSON.stringify(data, null, 2));
      return { data };
    };

    return (
      <div>
        <Test.Form mutation={Test.mutation} fields={[
          { name: 'username', label: 'Username', type: 'text', },
          {
            name: 'best_restaurant', label: 'Best Restaurant', type: 'select',
            getLabel: (value) => value,
            list: [
              'Chipotle',
              'Olive Garden'
            ]
          },
        ]}
        />
        {message !== '' && <Message>
          <pre>{message}</pre>
        </Message>}
      </div>
    );
  }
};

export const RatingField: Story = {
  render: () => {
    const Test = useForm({
      mutationFn: async () => {
        console.log(data);
        return { data };
      },
      transaction: {
        name: 'FormTests',
        description: 'FormTests',
        op: 'form.submit'
      }
    });
    const { data } = useFormContext();
    const [message, setMessage] = useState('');
    const submit: FormSubmitHandler = async (data) => {
      setMessage(JSON.stringify(data, null, 2));
      return { data };
    };

    return (
      <div>
        <Test.Form mutation={Test.mutation} fields={[
          { name: 'rating', label: 'Rating', type: 'number', min: 1, max: 5 },
          {
            name: 'best_restaurant', label: 'Best Restaurant', type: 'select',
            getLabel: (value) => value,
            list: ['Chipotle', 'Olive Garden']
          }
        ]}
        />
        {message !== '' && <Message>
          <pre>{message}</pre>
        </Message>}
      </div>
    );
  }
};

export const Validators: Story = {
  render: () => {
    const Test = useForm({

      mutationFn: async () => {
        console.log(data);
        return { data };
      },
      transaction: {
        name: 'FormTests',
        description: 'FormTests',
        op: 'form.submit'
      }
    });
    const { data } = useFormContext();
    const [message, setMessage] = useState('');
    const submit: FormSubmitHandler = async (data) => {
      setMessage(JSON.stringify(data, null, 2));
      return { data };
    };

    return (
      <div>
        <Test.Form mutation={Test.mutation} fields={[
          { name: 'best_restaurant', label: 'Best Restaurant', type: 'text', required: true },
          { name: 'email', label: 'Email', type: 'text', required: true }
        ]}
        />
        {message !== '' && <Message>
          <pre>{message}</pre>
        </Message>}
      </div>
    );
  }
};

