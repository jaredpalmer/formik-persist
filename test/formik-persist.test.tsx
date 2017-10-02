import * as React from 'react';
import * as renderer from 'react-test-renderer';

import { FormikPersist } from '../src/formik-persist';
import { Formik, Field, FormikProps, Form } from 'formik';
import { mount, shallow } from 'enzyme';

// tslint:disable-next-line:no-empty
const noop = () => {};

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const InnerForm: React.SFC<any> = ({ handleChange, handleBlur, values }) =>
  <Form>
    <input
      name="name"
      type="text"
      onChange={handleChange}
      onBlur={handleBlur}
      value={values.name}
    />
    <button type="submit">Submit</button>
    <FormikPersist name="signup" debounce={0} />
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
    expect(tree.find(InnerForm).find('input').props().value).toEqual('ian');
  });
});
