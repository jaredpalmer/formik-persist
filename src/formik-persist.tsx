import * as React from 'react';
import { FormikProps } from 'formik';
import * as PropTypes from 'prop-types';
import debounce from 'lodash.debounce';
import isEqual from 'lodash.isequal';

export interface FormikPersistProps {
  name: string;
  debounce?: number;
}

export class FormikPersist extends React.Component<FormikPersistProps, {}> {
  static defaultProps = {
    debounce: 300,
  };

  static contextTypes = {
    formik: PropTypes.object,
  };

  componentWillReceiveProps(
    _nextProps: FormikPersistProps,
    nextContext: { formik: FormikProps<{}> }
  ) {
    if (!isEqual(nextContext.formik, this.context.formik)) {
      this.saveForm(nextContext.formik);
    }
  }

  componentDidMount() {
    const maybeState = window.localStorage.getItem(this.props.name);
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
  }

  saveForm = debounce((data: FormikProps<{}>) => {
    window.localStorage.setItem(this.props.name, JSON.stringify(data));
  }, this.props.debounce);

  render() {
    return null;
  }
}
