# Formik Persist

Persist and rehydrate a [Formik](https://github.com/jaredpalmer/formik) form.

```
npm install formik-persist --save
```

# Basic Usage

Just import the `<Persist >` component and put it inside any Formik form. It renders `null`!

```tsx
import React from 'react'
import { Formik, Field, Form } from 'formik'
import Persist from 'formik-persist'

interface IFormikForm {
  firstName: string;
  lastName: string;
  email: string;
}

export const Signup = () => {
  return (
    <Formik
      onSubmit={values => console.log(values)}
      initialValues={{ firstName: '', lastName: '', email: '' }}
    >
      {() => (
        <Form<IFormikForm>>
          <Field name="firstName" placeholder="First Name" />
          <Field name="lastName" placeholder="Last Name" />
          <Field name="email" type="email" placeholder="Email Address" />
          <button type="submit">Submit</button>
          <Persist<IFormikForm> name="signup-form" />
        </Form>
      )}
    </Formik>
  );
}
```

### Props

#### `name: string`
Key to save form state to

#### `parse: (rawString: string) => T`
Custom parse method for your data (T is your data type).

default: `JSON.parse`

#### `clearOnOnmount: boolean`
Whether the data should be cleared after the form is submitted.

default: `true`

#### `saveOnlyOnSubmit: boolean`
Whether the data should ONLY be saved after the form is submitted.

default: `false`

#### `dump: (data: T) => string`
Custom dump method for your data (T is your data type).

default: `JSON.stringify`

#### `setData: (name: string, stringData: string) => void`
The method which sets your data.
This method should NOT dump it, that's what `dump` is for.

This function should ONLY set the raw output of `parse`.

default: `localStorage.setItem`

#### `getData: (name: string) => string | undefined | null`
The method which returns your data.
This method should NOT parse it, that's what `parse` is for.

This function should ONLY return your data in a raw string format.

default: `localStorage.setItem`

#### `clearData: (name: string) => void`
The method which clears your data.

default: `localStorage.removeItem`

## Author

- Jared Palmer [@jaredpalmer](https://twitter.com/jaredpalmer)


## Todo

- Support AsyncStorage for React Native
