# Formik Persist

Persist and rehydrate a Formik form.

```
npm install formik-persist --save
```

# Basic Usage

Just import the `<Persist >` component and put it inside any Formik form. It renders `null`!

```js
import React from 'react'
import { Formik, Field, Form } from 'formik'
import { Persist } from 'formik-persist'

export const Signup = () =>
  <div>
    <h1>My Cool Persisted Form</h1>
    <Formik
      onSubmit={values => console.log(values)}
      initialValues={{ firstName: '', lastName: '', email: '' }}
      render={props =>
        <Form className="whatever">
          <Field name="firstName" placeholder="First Name" />
          <Field name="lastName" placeholder="Last Name" />
          <Field name="email" type="email" placeholder="Email Address" />
          <button type="submit">Submit</button>
          <Persist name="signup-form" />
        </Form>}
    />
  </div>;
```

### Props

Only two props! 

- `name: string`: LocalStorage key to save form state to
- `debounce:? number`: Default is `300`. Number of ms to debounce the function that saves form state.


## Author

- Jared Palmer [@jaredpalmer](https://twitter.com/jaredpalmer)


## Todo

- Alternative storages (localForage, sessionStorage)
- Support AsyncStorage for React Native
