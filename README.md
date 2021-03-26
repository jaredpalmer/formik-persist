# Formik Remember

Automatically saves and loads [Formik](https://github.com/jaredpalmer/formik) forms by
using `localStorage`, `sessionStorage`, or your own storage system!

```bash
yarn add formik-remember
```

or

```bash
npm install formik-remember --save
```

# Basic Usage

Just import the `<Remember >` component and put it inside any Formik form. It renders `null`!

```tsx
import React from 'react'
import { Formik, Field, Form } from 'formik'
import Remember from 'formik-remember'

interface IFormikForm {
  firstName: string;
  lastName: string;
  email: string;
}

export const Signup = () => {
  return (
    <Formik<IFormikForm>
      onSubmit={values => console.log(values)}
      initialValues={{ firstName: '', lastName: '', email: '' }}
    >
      {() => (
        <Form>
          <Field name="firstName" placeholder="First Name" />
          <Field name="lastName" placeholder="Last Name" />
          <Field name="email" type="email" placeholder="Email Address" />
          <button type="submit">Submit</button>
          <Remember<IFormikForm> name="signup-form" />
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

## There's already the official formik-persist available

Yes that's true, but that package seems to be unmaintained.
No pull requests are accepted anymore and issues haven't been resolved for over
a year.

This package welcomes pull requests and merges them :) 
