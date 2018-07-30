import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Persist } from '../src/formik-persist';
import { Formik, FormikProps, Form } from 'formik';

// tslint:disable-next-line:no-empty
const noop = () => {};

describe('Formik Persist', () => {
  let node = document.createElement('div');
  it('attempts to rehydrate on mount', () => {
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
});
