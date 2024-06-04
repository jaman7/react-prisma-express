import { FormikErrors, FormikProps } from 'formik';

const Validator = ({ formik, formName }: { formik?: FormikProps<any>; formName?: string }) => {
  const { errors } = formik || {};
  const message = (errors?: FormikErrors<any> | null | any): string => errors?.[formName as string] ?? '';
  return <span className="validator">{message(errors)}</span>;
};
export default Validator;
