import * as React from 'react';
import { FormikProps, connect } from 'formik';
import debounce from 'lodash.debounce';
import isEqual from 'react-fast-compare';

export interface PersistProps {
  name: string;
  debounce?: number;
  isSessionStorage?: boolean;
  clearIfSubmitted?: boolean;
}

class PersistImpl extends React.Component<
  PersistProps & { formik: FormikProps<any> },
  {}
> {
  static defaultProps = {
    debounce: 300,
  };

  saveForm = debounce((data: FormikProps<{}>) => {
    if (this.props.isSessionStorage) {
      window.sessionStorage.setItem(this.props.name, JSON.stringify(data));
    } else {
      window.localStorage.setItem(this.props.name, JSON.stringify(data));
    }
  }, this.props.debounce);

  clearFormState = () => {
    if (this.props.isSessionStorage) {
      window.sessionStorage.removeItem(this.props.name);
    } else {
      window.localStorage.removeItem(this.props.name);
    }
  };

  componentDidUpdate(prevProps: PersistProps & { formik: FormikProps<any> }) {
    if (!isEqual(prevProps.formik, this.props.formik)) {
      this.saveForm(this.props.formik);
    }
  }

  componentDidMount() {
    const maybeState = this.props.isSessionStorage
      ? window.sessionStorage.getItem(this.props.name)
      : window.localStorage.getItem(this.props.name);
    if (maybeState && maybeState !== null) {
      this.props.formik.setFormikState(JSON.parse(maybeState));
    }
  }

  componentWillUnmount() {
    if (this.props.clearIfSubmitted && this.props.formik.isSubmitting) {
      this.saveForm.cancel();
      this.clearFormState();
    }
  }

  render() {
    return null;
  }
}

export const Persist = connect<PersistProps, any>(PersistImpl);
