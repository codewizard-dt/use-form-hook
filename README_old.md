<!-- @format -->

# EASY Forms in React (with Semantic UI)

This package provides a component that automatically handles form data, submission, and error handling. The component is createdy by and returned by a hook. That component relies on a React Context.Provider for state management.

## The Hook Response

The hook returns an object that fits the `UseForm` interface. The only property that you **NEED** to use is the `Form` property, which is a functional arrow component

```typescript
export interface UseForm {
  Form: React.FC<FormProps>;
  data: ApiFormData;
  setData(data: ApiFormData): void;
  errors: ApiFormData;
  setError(data: ApiFormData): void;
}
```

## Calling the Hook

```typescript
import { useForm } from "@codewizard-dt/use-form-hook";

const YourComponent = (props) => {
  const { Form } = useForm();
  ...
};
```

# Using The Form Component

The `Form` component is returned as a property from the `useForm` hooke. It must be a child of the `FormProvider`. You can put the `Form` component anywhere in the DOM as long as it is a child of the `FormProvider` component.

## Parent Component

```tsx
import { FormProvider } from "@codewizard-dt/use-form-hook";
const LayoutComponent = ({ children }) => {
  return (
    <FormProvider>
      /** Any child of `FormProvider` can use the hook */
      {children}
    </FormProvider>
  );
};
```

## Child Component

```tsx
import { useForm } from "@codewizard-dt/use-form-hook";
const ChildComponent = (props) => {
  const { Form } = useForm();
  return <Form />;
};
```

# Form Component and FormProps

The only required property is `fields`, in which you define the input fields of the form. The `fields` property is an array of objects that implement the `Field` interface. The `submit` property is the action of the form (ie POST data). The `respond` property is the callback that handles the response. The `buttons` property is an array of [ButtonProps](https://react.semantic-ui.com/elements/button/) that will render additional buttons. A submit button is rendered by default. The `submitBtnText` property overrides the default 'submit' text in the button.

```tsx
<Form fields={} submit={} respond={} buttons={} submitBtnText={}></Form>
```

## Fields property

Each field can receive any of the [FormFieldProps](https://react.semantic-ui.com/collections/form/) in addition to the properties from the `Field` interface.

```tsx
<Form
  fields={[
    { name: "username" }, // this is the minimum you need for each field
    { name: "password", type: "password" },
  ]}
  submit={}
  respond={}
  buttons={}
  submitBtnText={}
></Form>
```

## Submit property

The submit property must be of the type `FormSubmitHandler` which is defined by this package. This is a function that receives the form data and return a promise.

```typescript
interface FormResponse<T> {
  data?: T;
  error?: string;
  errors?: { [key: string]: string };
}
// the data object passed to the `submit` function is a map of all the `Fields`
// data = {[fieldName]: fieldValue}
type FormSubmitHandler = (data: ApiFormData) => Promise<FormResponse<any>>;
```

```tsx
// If you don't include the `submit` property, you will see your data in the console
const defaultSubmit: FormSubmitHandler = async (data) => {
  console.log("Submit data", data);
  console.log("Define an onSubmit value for your form");
  return data;
};

// The `submit` function must ultimately return a promise
<Form
  fields={}
  submit={(data) => {
    return post(data);
  }}
  respond={}
  buttons={}
  submitBtnText={}
></Form>;
```

## Respond property

The respond property must be of the type `FormResponseHandler` which is defined by this package. This is a function that receives the response object and does something with it.

```typescript
interface FormResponse<T> {
  data?: T;
  error?: string;
  errors?: { [key: string]: string };
}
type FormResponseHandler<T> = (response: FormResponse<T>) => void;
```

```tsx
// If you don't include a `respond` property, you will see the response in the console
const defaultRespond: FormResponseHandler<any> = (data) => {
  console.log("Response data", data);
};
```

```tsx
<Form
  fields={}
  submit={}
  respond={(response) => {
    const { data, error, errors } = response;
    // Do some action on the page based on the data
  }}
  buttons={}
  submitBtnText={}
></Form>
```
