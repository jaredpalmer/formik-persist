import * as React from 'react';
import * as renderer from 'react-test-renderer';

import { Persist } from '../src/formik-persist';
import { Formik, Field, FormikProps, Form } from 'formik';
import { mount, shallow } from 'enzyme';

// tslint:disable-next-line:no-empty
const noop = () => {};

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const InnerForm: React.SFC<any> = ({ handleChange, handleBlur, values }) =>
  <Form>
    <input
      id="name"
      name="name"
      type="text"
      onChange={handleChange}
      onBlur={handleBlur}
      value={values.name}
    />
    <input
      id="email"
      name="email"
      type="text"
      onChange={handleChange}
      onBlur={handleBlur}
      value={values.name}
    />
    <button type="submit">Submit</button>
    <Persist name="signup" debounce={0} ignoreFields={['email']} />
  </Form>;

describe('Formik Persist', () => {
  it('attempts to rehydrate on mount', () => {
    let setItem = jest.fn(() => console.log('hello'));
    (window as any).localStorage = {
      getItem: jest.fn(),
      setItem,
      removeItem: jest.fn(),
    };
    // @todo
    const tree = mount(
      <Formik
        initialValues={{ name: 'jared' }}
        onSubmit={noop}
        component={InnerForm}
      />
    );
    expect(window.localStorage.getItem).toHaveBeenCalled();
    tree.find(InnerForm).props().setValues({ name: 'ian' });
    expect(tree.find(InnerForm).find('#name').props().value).toEqual('ian');
  });
});

describe('Formik Persist', () => {
  it('omits ignored fields', () => {
    jest.useFakeTimers();
    let state = null;
    let setItem = jest.fn((key: string, value: any) => (state = value));
    (window as any).localStorage = {
      getItem: jest.fn(),
      setItem,
      removeItem: jest.fn(),
    };
    const tree = mount(
      <Formik
        initialValues={{ name: 'jared' }}
        onSubmit={noop}
        component={InnerForm}
      />
    );
    tree
      .find(InnerForm)
      .props()
      .setValues({ name: 'ian' }, { email: 'ian@example.com' });
    jest.runAllTimers();
    expect(JSON.parse(state).values).toEqual({ name: 'ian' });
  });
});
