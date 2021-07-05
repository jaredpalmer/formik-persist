import * as React from 'react';
import { FormikProps, connect } from 'formik';
import debounce from 'lodash.debounce';
import isEqual from 'react-fast-compare';

export interface PersistProps {
  name: string;
  debounce?: number;
  isSessionStorage?: boolean;
  confirm?: () => Promise<boolean>;
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

  componentDidUpdate(prevProps: PersistProps & { formik: FormikProps<any> }) {
    if (!isEqual(prevProps.formik, this.props.formik)) {
      this.saveForm(this.props.formik);
    }
  }

  rehydrate = async () => {
    const maybeState = this.props.isSessionStorage
      ? window.sessionStorage.getItem(this.props.name)
      : window.localStorage.getItem(this.props.name);

    if (maybeState && maybeState !== null) {
      if (this.props.confirm) {
        const promptResult = await this.props.confirm();
        if (promptResult) {
          this.props.formik.setFormikState(JSON.parse(maybeState));
        }
      } else {
        this.props.formik.setFormikState(JSON.parse(maybeState));
      }
    }
  };

  componentDidMount() {
    this.rehydrate();
  }

  render() {
    return null;
  }
}

export const Persist = connect<PersistProps, any>(PersistImpl);
