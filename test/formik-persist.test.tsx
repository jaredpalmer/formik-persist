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

  it('it does not attempt to removeItem on unmount', () => {
    let node = document.createElement('div');
    (window as any).localStorage = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
    };
    let injected: any;

    ReactDOM.render(
      <Formik
        initialValues={{}}
        onSubmit={noop}
        render={(props: FormikProps<{}>) => {
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

    injected.setSubmitting(true);
    ReactDOM.unmountComponentAtNode(node);
    expect(window.localStorage.removeItem).not.toHaveBeenCalled();
  });

  describe('when clearOnSubmit prop is true', () => {
    let node: HTMLDivElement;
    let injected: any;

    beforeEach(() => {
      node = document.createElement('div');
      (window as any).localStorage = {
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn(),
      };

      ReactDOM.render(
        <Formik
          initialValues={{}}
          onSubmit={noop}
          render={(props: FormikProps<{}>) => {
            injected = props;
            return (
              <div>
                <Persist name="signup" debounce={0} clearIfSubmitted />
              </div>
            );
          }}
        />,
        node
      );
    });

    it('when submitted and then unmounted, it attempts to removeItem', () => {
      injected.setSubmitting(true);
      ReactDOM.unmountComponentAtNode(node);
      expect(window.localStorage.removeItem).toHaveBeenCalled();
    });

    it('when unmounted without submission, it does not attempt to removeItem', () => {
      ReactDOM.unmountComponentAtNode(node);
      expect(window.localStorage.removeItem).not.toHaveBeenCalled();
    });
  });
});
