import { useCallback, useEffect, useLayoutEffect } from 'react';
import { useFormikContext } from 'formik';
import isEqual from 'react-fast-compare';

export interface PersistProps<T> {
  name: string;

  debounceWaitMs?: number;
  clearOnOnmount?: boolean;

  parse?: (rawString: string) => T;
  dump?: (data: T) => string;

  setData?: (name: string, stringData: string) => void;
  getData?: (name: string) => string | undefined | null;
  clearData?: (name: string) => void;
}

const DEFAULT_PROPS = {
  debounceWaitMs: 300,
  clearOnOnmount: true,
  parse: JSON.parse,
  dump: JSON.stringify,
  setData: window.localStorage && window.localStorage.setItem,
  getData: window.localStorage && window.localStorage.getItem,
  clearData: window.localStorage && window.localStorage.removeItem,
};

const FormikPersist = <T extends any = any>(props: PersistProps<T>) => {
  const {
    parse,
    getData,
    setData,
    name,
    dump,
    clearData,
    clearOnOnmount,
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
      saveForm(values);
    },
    [values, saveForm]
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

  return null;
};

export default FormikPersist;
