import { FormikProps } from 'formik';
import { InputSwitch, InputSwitchChangeEvent } from 'primereact/inputswitch';
import { classNames } from 'primereact/utils';
import { ChangeEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaMinus, FaPlus } from 'react-icons/fa';
import { IInput, inputConfigDefault } from './input.model';
import { InputType } from './input.types';
import Button from '../Button';
import { ifChanged, isNumeric, mathSubtraction, usePrevious } from 'shared/utils/helpers';

const { RANGE, NUMBER, PASSWORD, SWITCH } = InputType;

interface IProps {
  config?: Partial<IInput>;
  formik?: FormikProps<any>;
  [name: string]: any;
}

const Input = (props: IProps) => {
  const { t } = useTranslation();
  const { config, formControlName, formik } = props || {};
  const value = formik?.values?.[formControlName] ?? null;

  const prevConfig = usePrevious({ config });

  const [inputConfig, setInputConfig] = useState<IInput>(inputConfigDefault());

  const { type, placeholder, readonly, inputClass, maxLength, min = 0, max = 0, step = 0, disableBtnNumbers, disabled } = inputConfig || {};

  useEffect(() => {
    ifChanged(prevConfig?.config, config, () => {
      setInputConfig({ ...inputConfigDefault(), ...config });
    });
  }, [config]);

  const isTypeNumber = type === NUMBER && !disableBtnNumbers;
  const isTypeRange = type === RANGE && !disableBtnNumbers;
  const isTypeSwitch = type === SWITCH && !disableBtnNumbers;

  const setChange = (e: ChangeEvent<HTMLInputElement> | InputSwitchChangeEvent) => {
    formik?.setFieldValue?.(formControlName, isTypeNumber || isTypeRange ? +e.target.value : e.target.value);
    e.preventDefault();
  };

  const setStepNumberValue = (e: { preventDefault: () => void }, isIncrement: boolean): void => {
    if (typeof value !== 'number' && isNumeric(value)) {
      formik?.setFieldValue?.(formControlName, Number(value) ?? 0);
    }

    formik?.setFieldValue?.(formControlName, +mathSubtraction((value as number) ?? 0, step ?? 1, isIncrement));
    if (typeof value === 'number') {
      switch (true) {
        case value > max:
          formik?.setFieldValue?.(formControlName, max);
          break;
        case value < min:
          formik?.setFieldValue?.(formControlName, min);
          break;
        default:
          break;
      }
    }
    e.preventDefault();
  };

  const nameClass = `input-component ${isTypeRange ? 'input-component__range' : ''}`;
  const isFormFieldInvalid = (name: string): boolean => !!(formik?.dirty && formik?.errors?.[name]);

  return (
    <>
      <div className={nameClass}>
        <div className={`input-component--content ${classNames({ invalid: isFormFieldInvalid(formControlName) })}`}>
          {isTypeNumber ? (
            <Button handleClick={(e: any) => setStepNumberValue(e, false)}>
              <i className="aa">
                <FaMinus />
              </i>
            </Button>
          ) : (
            <></>
          )}

          {isTypeSwitch ? (
            <InputSwitch id={formControlName ?? ''} name={formControlName ?? ''} checked={value} onChange={e => setChange(e)} />
          ) : (
            <input
              id={formControlName ?? ''}
              name={formControlName ?? ''}
              className={`input ${inputClass ?? ''} ${classNames({ invalid: isFormFieldInvalid(formControlName) })}`}
              type={type ?? 'text'}
              min={`${min ?? 0}`}
              max={`${max ?? 1000}`}
              value={value ?? ''}
              step={step}
              placeholder={placeholder ? t(placeholder ?? '') : ''}
              readOnly={readonly}
              autoComplete="off"
              maxLength={maxLength}
              onChange={e => setChange(e)}
              disabled={disabled}
            />
          )}
          {isTypeNumber ? (
            <Button handleClick={(e: any) => setStepNumberValue(e, true)}>
              <i>
                <FaPlus />
              </i>
            </Button>
          ) : (
            <></>
          )}
        </div>

        {isTypeRange ? <span className="input-container__range--text">{value}</span> : <></>}
      </div>
    </>
  );
};

export default Input;
