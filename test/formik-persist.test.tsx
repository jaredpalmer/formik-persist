import { act, render } from '@testing-library/react';
import * as React from 'react';
import { Formik, FormikProps } from 'formik';
import Persist from '../src/formik-persist';

// tslint:disable-next-line:no-empty
const noop = () => {};

describe('Formik Persist', () => {
  it('loads data on mount', () => {
    (window as any).localStorage = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
    };

    render(
      <Formik initialValues={{ name: 'jared' }} onSubmit={noop}>
        {() => {
          return (
            <Persist
              name="signup"
              debounceWaitMs={0}
              getData={localStorage.getItem}
              setData={localStorage.setItem}
            />
          );
        }}
      </Formik>
    );
    expect(window.localStorage.getItem).toHaveBeenCalled();
  });

  it('sets data on update', () => {
    (window as any).localStorage = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
    };
    let injectedFormik: FormikProps<any>;

    render(
      <Formik initialValues={{ name: 'jared' }} onSubmit={noop}>
        {formik => {
          injectedFormik = formik;
          return (
            <Persist
              name="signup"
              debounceWaitMs={0}
              getData={localStorage.getItem}
              setData={localStorage.setItem}
            />
          );
        }}
      </Formik>
    );

    act(() => {
      injectedFormik.setValues({
        name: 'test',
      });
    });

    expect(localStorage.setItem).toHaveBeenCalled();
  });

  it('custom parse method works', () => {
    (window as any).localStorage = {
      getItem: () => ({
        name: 'storage',
      }),
      setItem: jest.fn(),
      removeItem: jest.fn(),
    };
    let injectedFormik: FormikProps<any>;

    render(
      <Formik initialValues={{ name: 'jared' }} onSubmit={noop}>
        {formik => {
          injectedFormik = formik;
          return (
            <Persist
              name="signup"
              debounceWaitMs={0}
              getData={localStorage.getItem}
              setData={localStorage.setItem}
              parse={() => ({
                name: 'parse',
              })}
            />
          );
        }}
      </Formik>
    );

    // @ts-ignore
    expect(injectedFormik.values.name).toBe('parse');
  });

  it('custom dump method works', () => {
    (window as any).localStorage = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
    };
    let injectedFormik: FormikProps<any>;

    render(
      <Formik initialValues={{ name: 'jared' }} onSubmit={noop}>
        {formik => {
          injectedFormik = formik;

          return (
            <Persist
              name="signup"
              debounceWaitMs={0}
              getData={localStorage.getItem}
              setData={localStorage.setItem}
              dump={() => 'dump'}
            />
          );
        }}
      </Formik>
    );

    act(() => {
      injectedFormik.setValues({
        name: 'foo',
      });
    });

    expect(window.localStorage.setItem).toHaveBeenCalledWith('signup', 'dump');
  });

  it('clears data when submitted', () => {
    (window as any).localStorage = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
    };
    let injectedFormik: FormikProps<any>;

    const { unmount } = render(
      <Formik initialValues={{ name: 'jared' }} onSubmit={noop}>
        {formik => {
          injectedFormik = formik;

          return (
            <Persist
              name="signup"
              debounceWaitMs={0}
              getData={localStorage.getItem}
              setData={localStorage.setItem}
              clearData={localStorage.removeItem}
            />
          );
        }}
      </Formik>
    );

    act(() => {
      injectedFormik.setSubmitting(true);
    });

    unmount();

    expect(window.localStorage.removeItem).toHaveBeenCalled();
  });

  it('does not clear data when not submitted', () => {
    (window as any).localStorage = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
    };
    let injectedFormik: FormikProps<any>;

    const { unmount } = render(
      <Formik initialValues={{ name: 'jared' }} onSubmit={noop}>
        {formik => {
          injectedFormik = formik;

          return (
            <Persist
              name="signup"
              debounceWaitMs={0}
              getData={localStorage.getItem}
              setData={localStorage.setItem}
              clearData={localStorage.removeItem}
            />
          );
        }}
      </Formik>
    );

    act(() => {
      injectedFormik.setSubmitting(false);
    });

    unmount();

    expect(window.localStorage.removeItem).not.toHaveBeenCalled();
  });

  it('saves on submit when saveOnlyOnSubmit is present', () => {
    (window as any).localStorage = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
    };
    let injectedFormik: FormikProps<any>;

    const { unmount } = render(
      <Formik initialValues={{ name: 'jared' }} onSubmit={noop}>
        {formik => {
          injectedFormik = formik;

          return (
            <Persist
              clearOnOnmount={false}
              saveOnlyOnSubmit={true}
              name="signup"
              debounceWaitMs={0}
              getData={localStorage.getItem}
              setData={localStorage.setItem}
            />
          );
        }}
      </Formik>
    );

    act(() => {
      injectedFormik.setSubmitting(true);
    });

    unmount();

    expect(window.localStorage.setItem).toHaveBeenCalled();
  });

  it('does not save on change when saveOnlyOnSubmit is present', () => {
    (window as any).localStorage = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
    };
    let injectedFormik: FormikProps<any>;

    render(
      <Formik initialValues={{ name: 'jared' }} onSubmit={noop}>
        {formik => {
          injectedFormik = formik;

          return (
            <Persist
              clearOnOnmount={false}
              saveOnlyOnSubmit={true}
              name="signup"
              debounceWaitMs={0}
              getData={localStorage.getItem}
              setData={localStorage.setItem}
            />
          );
        }}
      </Formik>
    );

    act(() => {
      injectedFormik.setValues({
        name: 'foo',
      });
    });

    expect(window.localStorage.setItem).not.toHaveBeenCalled();
  });
});
