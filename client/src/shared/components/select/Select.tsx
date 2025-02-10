import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { forwardRef, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ISelect, selectConfigDefault } from './Select.model';
import Validator from '../validator/Validator';
import classNames from 'classnames';

interface IProps {
  name?: string;
  config?: Partial<ISelect>;
  value?: string | number;
  onChange?: (value: string | number) => void;
  error?: string | null | undefined;
  touched?: boolean;
}

const Select = forwardRef<HTMLDivElement, IProps>(({ name, value, onChange, error, config }, ref) => {
  const { t } = useTranslation();

  const selectConfig = useMemo(() => ({ ...selectConfigDefault(), ...config }), [config]);

  const { dictData, placeholder, disabled } = selectConfig || {};

  const handleChange = (e: DropdownChangeEvent) => {
    onChange?.(e.value);
  };

  const selectClasses = classNames('select-component', {
    invalid: error && !disabled,
    'cursor-not-allowed bg-disabled': disabled,
  });

  return (
    <div className="block">
      <div className="d-flex flex-column" ref={ref}>
        <Dropdown
          className={selectClasses}
          id={name ?? ''}
          name={name ?? ''}
          value={value}
          onChange={handleChange}
          options={dictData ?? []}
          optionLabel={'displayName'}
          optionValue="id"
          placeholder={placeholder ? t(placeholder as string) : ''}
          panelClassName="select-component-panel"
          disabled={disabled}
        />
      </div>

      {error && <Validator error={error} />}
    </div>
  );
});

export default Select;
