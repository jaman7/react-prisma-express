import { FormikProps } from 'formik';
import { Dispatch, SetStateAction, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Input from '../input/Input';
import { IInput } from '../input/input.model';
import Select from '../select/Select';
import { ISelect } from '../select/Select.model';
import { FormCellConfigDefault, IFormElements } from './FormElements.model';
import { ICheckbox } from '../checkbox/CheckboxComponent.model';
import CheckboxComponent from '../checkbox/CheckboxComponent';
import Validator from '../Validator';

interface IProps {
  formControl?: any;
  formControlName?: string;
  config?: IFormElements;
  formik?: FormikProps<any>;
  valueChange?: Dispatch<SetStateAction<any>>;
  [name: string]: any;
}

const FormCell = (props: IProps) => {
  const { t } = useTranslation();
  const { config, formControlName, formik, valueChange } = props || {};

  const formCellConfig = useMemo(() => ({ ...FormCellConfigDefault(), ...config }), [config, formControlName]);

  const itemsConfig = (data: IInput): Partial<IInput> => {
    const { formCellType } = data;
    const dataTmp: Partial<IInput> = data;

    switch (formCellType) {
      case 'input':
        dataTmp.type = 'text';
        break;
      case 'input-number':
        dataTmp.type = 'number';
        break;
      case 'input-range':
        dataTmp.type = 'range';
        break;
      case 'input-switch':
        dataTmp.type = 'switch';
        break;
      case 'input-password':
        dataTmp.type = 'password';
        break;
      default:
        break;
    }
    return dataTmp;
  };

  const { formCellType, header, isHeader, placeholder, formCellClass } = formCellConfig || {};

  const headerElement: JSX.Element = useMemo(
    () => (isHeader ? <span className="label">{t(header as string)}</span> : <></>),
    [isHeader, header]
  );

  const checboxLabel: JSX.Element = useMemo(
    () => (formCellType === 'checkbox' ? <span className="label">{t(placeholder as string)}</span> : <></>),
    [formCellType, placeholder]
  );

  const formTypes = (): JSX.Element | JSX.Element[] => {
    switch (formCellConfig?.formCellType) {
      case 'input':
      case 'input-number':
      case 'input-range':
      case 'input-switch':
      case 'input-password':
        return (
          <Input
            formik={formik}
            valueChange={valueChange}
            formControlName={formControlName}
            config={itemsConfig?.(formCellConfig as IInput)}
          />
        );
      case 'select':
        return <Select formik={formik} valueChange={valueChange} formControlName={formControlName} config={formCellConfig as ISelect} />;
      case 'checkbox':
        return (
          <CheckboxComponent
            formik={formik}
            valueChange={valueChange}
            formControlName={formControlName}
            config={formCellConfig as ICheckbox}
          />
        );
      default:
        return <></>;
    }
  };

  return (
    <div className={`form-cell-component ${formCellClass}`}>
      {headerElement}
      {formTypes()}
      {checboxLabel}

      <Validator formName={formControlName} formik={formik} />
    </div>
  );
};

export default FormCell;
