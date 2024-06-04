import { Checkbox } from 'primereact/checkbox';
import { FormikProps } from 'formik';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { ICheckbox, checkboxConfigDefault } from './CheckboxComponent.model';
import { useTranslation } from 'react-i18next';
import { ifChanged, usePrevious } from 'shared/utils/helpers';
import { classNames } from 'primereact/utils';

interface IProps {
  config?: ICheckbox;
  formik?: FormikProps<any>;
  valueChange?: Dispatch<SetStateAction<any>>;
  [name: string]: any;
}

const CheckboxComponent = (props: IProps) => {
  const { t } = useTranslation();
  const { config, formControlName, formik } = props || {};
  const value = formik?.values?.[formControlName] ?? null;
  const [checkboxConfig, setCheckboxConfig] = useState<Partial<ICheckbox>>(checkboxConfigDefault());
  const { disabled, readonly } = checkboxConfig || {};
  const prevConfig = usePrevious({ config });

  useEffect(() => {
    ifChanged(prevConfig?.config, config, () => {
      setCheckboxConfig({ ...checkboxConfigDefault(), ...config });
    });
  }, [config]);

  const setChange = (e: any) => {
    formik?.setFieldValue?.(formControlName, e.checked);
    e.preventDefault();
  };

  const isFormFieldInvalid = (name: string): boolean => !!(formik?.touched?.[name] && formik?.errors?.[name]);

  const nameClass = `checkbox-component ${classNames({ 'p-invalid': isFormFieldInvalid('checked') })}`;

  return (
    <>
      <Checkbox
        id={formControlName ?? ''}
        name={formControlName ?? ''}
        disabled={disabled}
        readOnly={readonly}
        checked={value}
        className={nameClass}
        onChange={(e: any) => setChange(e)}
      ></Checkbox>
    </>
  );
};

export default CheckboxComponent;
