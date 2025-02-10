import { Checkbox, CheckboxChangeEvent } from 'primereact/checkbox';
import { forwardRef, useMemo } from 'react';
import { ICheckbox, checkboxConfigDefault } from './CheckboxMain.model';
import { useTranslation } from 'react-i18next';
import { classNames } from 'primereact/utils';
import Validator from '../validator/Validator';

interface IProps {
  name?: string;
  config?: Partial<ICheckbox>;
  onChange?: (value: boolean) => void;
  error?: string | null | undefined;
  touched?: boolean;
  value?: boolean;
}

const CheckboxMain = forwardRef<HTMLInputElement, IProps>(({ name, value, onChange, error, config }, ref) => {
  const { t } = useTranslation();

  const checkboxConfig = useMemo(() => ({ ...checkboxConfigDefault(), ...config }), [config]);

  const { disabled, readonly } = checkboxConfig || {};

  const handleChange = (e: CheckboxChangeEvent) => {
    onChange?.(e?.checked as boolean);
  };

  const checkboxClasses = classNames('checkbox-component', {
    invalid: error && !disabled,
    'cursor-not-allowed': disabled,
  });

  return (
    <div className="d-flex flex-column w-auto" ref={ref}>
      <Checkbox
        id={name}
        name={name}
        disabled={disabled}
        readOnly={readonly}
        checked={value as boolean}
        className={checkboxClasses}
        value={value}
        onChange={(e) => handleChange(e)}
      />

      {error && <Validator error={t(error)} />}
    </div>
  );
});

export default CheckboxMain;
