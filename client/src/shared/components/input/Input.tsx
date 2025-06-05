import React, { forwardRef, useEffect, useMemo, useRef } from 'react';
import { IInput, inputConfigDefault } from './input.model';
import classNames from 'classnames';
import Validator from '../validator/Validator';
import { FaMinus, FaPlus } from 'react-icons/fa';
import { InputTypeEnum } from './input.types';
import Button, { ButtonVariant } from '../button/Button';
import { mathOperation } from '@/shared/utils/math-operaation';
import { useFallbackTranslation } from '@/hooks/useFallbackTranslation';

interface IProps {
  name?: string;
  config: Partial<IInput>;
  value?: string | number;
  onChange?: (value: string | number) => void;
  error?: string | null | undefined;
  touched?: boolean;
}

const { RANGE, NUMBER, SEARCH } = InputTypeEnum;

const Input = forwardRef<HTMLInputElement, IProps>(({ name, value, onChange, error, config }, ref) => {
  const { t } = useFallbackTranslation();
  const inputConfig = useMemo(() => ({ ...inputConfigDefault(), ...config }), [config]);

  const { type, placeholder, disabled, min, max, step, disableBtnNumbers } = inputConfig;

  const inputRef = useRef<HTMLInputElement | null>(null);

  const isTypeNumber = type === NUMBER && !disableBtnNumbers;
  const isTypeRange = type === RANGE && !disableBtnNumbers;
  const isTypeSearch = type === SEARCH && !disableBtnNumbers;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.value);
  };

  const handleStepChange = (isIncrement: boolean) => {
    const newValue = mathOperation((value as number) ?? 0, step ?? 1, isIncrement);
    console.log(newValue);
    if (typeof newValue === 'number' && newValue >= ((min as number) ?? 0) && newValue <= ((max as number) ?? 100)) {
      onChange?.(newValue);
    }
  };

  const inputClasses = classNames('input-component__input', {
    search: isTypeSearch,
    range: isTypeRange,
    number: isTypeNumber,
    invalid: error && !disabled,
    'cursor-not-allowed bg-disabled': disabled,
  });

  useEffect(() => {
    if (type === RANGE && inputRef.current) {
      const currentValue = Number(value) || 0;
      const minValue = min ?? 0;
      const maxValue = max ?? 100;
      const progress = ((currentValue - minValue) / (maxValue - minValue)) * 100;
      inputRef.current.style.setProperty('--progress-value', `${progress}%`);
    }
  }, [value, min, max, type]);

  return (
    <div className="input-component">
      <div className="input-component__container">
        {isTypeNumber && !disabled ? (
          <Button
            variant={ButtonVariant.PRIMARY}
            size="xs"
            className="btn-minus"
            aria-label="Decrease"
            handleClick={() => handleStepChange(false)}
          >
            <i>
              <FaMinus />
            </i>
          </Button>
        ) : (
          <></>
        )}

        <input
          id={name}
          name={name}
          type={type ?? 'text'}
          placeholder={placeholder ? t(placeholder) : ''}
          value={value ?? ''}
          min={min ?? 0}
          max={max ?? 100}
          step={step}
          disabled={disabled}
          onChange={handleChange}
          className={inputClasses}
          aria-invalid={!!error}
          aria-describedby={error ? `${name}-error` : undefined}
          autoComplete="off"
          ref={(node) => {
            inputRef.current = node;
            if (ref && typeof ref === 'function') ref(node);
          }}
        />
        {isTypeSearch && <i className="icon-search pi pi-search"></i>}

        {isTypeNumber && !disabled ? (
          <Button
            variant={ButtonVariant.PRIMARY}
            size="xs"
            className="btn-plus"
            aria-label="Increase"
            handleClick={() => handleStepChange(true)}
          >
            <FaPlus />
          </Button>
        ) : (
          <></>
        )}

        {isTypeRange ? <span className="range--text">{value}</span> : <></>}
      </div>

      {error && <Validator error={t(error)} />}
    </div>
  );
});

export default Input;
