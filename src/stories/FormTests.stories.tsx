import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { within, userEvent } from '@storybook/testing-library';
import { FormTests } from './FormTests';

export default {
  title: 'Example/Form',
  component: FormTests,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof FormTests>;

const Template: ComponentStory<typeof FormTests> = (args) => <FormTests {...args} />;

export const FieldsOnly = Template.bind({});
FieldsOnly.args = {
  fieldsOrGroups: [
    { name: 'name' },
    { name: 'password' }
  ]
}
export const Groups = Template.bind({});
Groups.args = {
  fieldsOrGroups: [
    {
      name: 'user',
      fields: [
        { name: 'name', width: '10', initial: 'Sally' },
        { name: 'password', width: '6' }
      ],
    },
  ]
}

