import React from 'react';
import { FormikProps } from 'formik';
import * as PropTypes from 'prop-types';
import debounce from 'lodash.debounce';
import isEqual from 'lodash.isequal';

import { Storage, LocalStorage } from './Storages';

export interface PersistProps {
  name: string;
  debounce?: number;
  storage?: Storage;
}

export class Persist extends React.Component<PersistProps, {}> {
  static defaultProps = {
    debounce: 300,
    storage: new LocalStorage(),
  };

  static contextTypes = {
    formik: PropTypes.object,
  };

  saveForm = debounce((data: FormikProps<{}>) => {
    (this.props.storage as Storage).setItem(
      this.props.name,
      JSON.stringify(data)
    );
  }, this.props.debounce);

  componentWillReceiveProps(
    _nextProps: PersistProps,
    nextContext: { formik: FormikProps<{}> }
  ) {
    if (!isEqual(nextContext.formik, this.context.formik)) {
      this.saveForm(nextContext.formik);
    }
  }

  componentDidMount() {
    (this.props.storage as Storage)
      .getItem(this.props.name)
      .then(maybeState => {
        if (maybeState && maybeState !== null) {
          const { values, errors, touched, isSubmitting, status } = JSON.parse(
            maybeState
          );

          const { formik } = this.context;

          if (values) {
            formik.setValues(values);
          }

          if (errors) {
            formik.setErrors(errors);
          }

          if (touched) {
            formik.setTouched(touched);
          }

          if (isSubmitting) {
            formik.setSubmitting(isSubmitting);
          }

          if (status) {
            formik.setStatus(status);
          }
        }
      });
  }

  render() {
    return null;
  }
}
