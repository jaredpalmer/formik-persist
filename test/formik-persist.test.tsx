import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Persist } from '../src/formik-persist';
import { Formik, FormikProps, Form } from 'formik';

// tslint:disable-next-line:no-empty
const noop = () => {};

describe('Formik Persist', () => {
  it('attempts to rehydrate on mount', () => {
    let node = document.createElement('div');
    (window as any).localStorage = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
    };
    let injected: any;

    ReactDOM.render(
      <Formik
        initialValues={{ name: 'jared' }}
        onSubmit={noop}
        render={(props: FormikProps<{ name: string }>) => {
          injected = props;
          return (
            <div>
              <Persist name="signup" debounce={0} />
            </div>
          );
        }}
      />,
      node
    );
    expect(window.localStorage.getItem).toHaveBeenCalled();
    injected.setValues({ name: 'ian' });
    expect(injected.values.name).toEqual('ian');
  });

  it('attempts to rehydrate on mount if session storage is true on props', () => {
    let node = document.createElement('div');
    (window as any).sessionStorage = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
    };
    let injected: any;

    ReactDOM.render(
      <Formik
        initialValues={{ name: 'Anuj Sachan' }}
        onSubmit={noop}
        render={(props: FormikProps<{ name: string }>) => {
          injected = props;
          return (
            <div>
              <Persist name="signup" debounce={0} isSessionStorage />
            </div>
          );
        }}
      />,
      node
    );
    expect(window.sessionStorage.getItem).toHaveBeenCalled();
    injected.setValues({ name: 'Anuj' });
    expect(injected.values.name).toEqual('Anuj');
  });

  it('omits ignored fields', () => {
    let node = document.createElement('div');
    jest.useFakeTimers();
    let state = null;
    let setItem = (key: string, value: any) => (state = value);
    (window as any).localStorage = {
      getItem: jest.fn(),
      setItem,
      removeItem: jest.fn(),
    };
    let injected: any;
    ReactDOM.render(
      <Formik
        initialValues={{ name: 'Anuj Sachan' }}
        onSubmit={noop}
        render={(props: FormikProps<{ name: string }>) => {
          injected = props;
          return (
            <div>
              <Persist name="signup" debounce={0} />
            </div>
          );
        }}
      />,
      node
    );
    injected.setValues({ name: 'ciaran' }, { email: 'ian@example.com' });
    jest.runAllTimers();
    expect(JSON.parse(state).values).toEqual({ name: 'ciaran' });
  });
});
