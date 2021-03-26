import { useCallback, useEffect, useLayoutEffect } from 'react';
import { useFormikContext } from 'formik';
import isEqual from 'react-fast-compare';

export interface FormikRememberProps<T> {
  name: string;

  debounceWaitMs?: number;
  clearOnOnmount?: boolean;
  saveOnlyOnSubmit?: boolean;

  parse?: (rawString: string) => T;
  dump?: (data: T) => string;

  setData?: (name: string, stringData: string) => void;
  getData?: (name: string) => string | undefined | null;
  clearData?: (name: string) => void;
}

const DEFAULT_PROPS = {
  debounceWaitMs: 300,
  clearOnOnmount: true,
  saveOnlyOnSubmit: false,
  parse: JSON.parse,
  dump: JSON.stringify,
};

const FormikRemember = <T extends any = any>(props: FormikRememberProps<T>) => {
  const {
    getData = window.localStorage.getItem.bind(window.localStorage),
    setData = window.localStorage.setItem.bind(window.localStorage),
    clearData = window.localStorage.removeItem.bind(window.localStorage),
    name,
    parse,
    dump,
    clearOnOnmount,
    saveOnlyOnSubmit,
  } = Object.assign(DEFAULT_PROPS, props);

  const { setValues, values, isSubmitting } = useFormikContext<T>();

  // Debounce doesn't work with tests
  const saveForm = useCallback(
    (data: T) => {
      const stringData = dump(data);

      setData(name, stringData);
    },
    [dump, setData, name]
  );

  // Load state from storage
  useLayoutEffect(
    () => {
      const stringData = getData(name);

      if (stringData) {
        const savedValues = parse(stringData);

        if (!isEqual(savedValues, values)) {
          setValues(savedValues);
        }
      }
    },
    [getData, name, parse, setValues]
  );

  // Save state
  useEffect(
    () => {
      if (!saveOnlyOnSubmit) {
        saveForm(values);
      }
    },
    [values, saveForm, saveOnlyOnSubmit]
  );

  // Clear data after unmount
  useEffect(
    () => () => {
      if (clearOnOnmount && isSubmitting) {
        clearData(name);
      }
    },
    [clearOnOnmount, isSubmitting, clearData, name]
  );

  // saveOnlyOnSubmit
  useEffect(
    () => () => {
      if (saveOnlyOnSubmit && isSubmitting) {
        saveForm(values);
      }
    },
    [saveOnlyOnSubmit, isSubmitting, saveForm, values]
  );

  return null;
};

export default FormikRemember;
