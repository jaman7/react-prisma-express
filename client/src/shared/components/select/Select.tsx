import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { MultiSelect, MultiSelectChangeEvent } from 'primereact/multiselect';
import { forwardRef, useMemo } from 'react';
import { ISelect, selectConfigDefault } from './Select.model';
import Validator from '../validator/Validator';
import classNames from 'classnames';
import { useFallbackTranslation } from '@/hooks/useFallbackTranslation';

interface IProps {
  name?: string;
  config?: Partial<ISelect>;
  value?: string | number | number[] | string[] | null;
  onChange?: (value: string | number | number[] | string[]) => void;
  error?: string | null | undefined;
  touched?: boolean;
}

const Select = forwardRef<HTMLDivElement, IProps>(({ name, value = null, onChange, error, config }, ref) => {
  const { t } = useFallbackTranslation();

  const selectConfig = useMemo(() => ({ ...selectConfigDefault(), ...config }), [config]);

  const { dictData, placeholder, disabled, checkmark, mode } = selectConfig || {};

  const handleChange = (e: DropdownChangeEvent | MultiSelectChangeEvent) => {
    onChange?.(e.value);
  };

  const selectClasses = classNames('select-component', {
    invalid: error && !disabled,
    'cursor-not-allowed bg-disabled': disabled,
  });

  const resolvedValue = useMemo(() => {
    return mode === 'multiple' ? (Array.isArray(value) ? value : value != null ? [value] : []) : (value ?? null);
  }, [value, mode, dictData]);

  const resolvedOptions = useMemo(() => dictData ?? [], [dictData]);

  return (
    <div className="d-block">
      <div className="d-flex flex-column" ref={ref}>
        {mode === 'default' ? (
          <Dropdown
            className={selectClasses}
            id={name ?? ''}
            name={name ?? ''}
            value={value ?? null}
            onChange={handleChange}
            options={dictData ?? []}
            optionLabel={'displayName'}
            optionValue="id"
            placeholder={placeholder ? t(placeholder as string) : ''}
            panelClassName="select-component-panel"
            disabled={disabled}
            checkmark={checkmark}
          />
        ) : (
          <MultiSelect
            className={selectClasses}
            id={name ?? ''}
            name={name ?? ''}
            value={mode === 'multiple' ? (resolvedValue ?? []) : (resolvedValue ?? null)}
            onChange={handleChange}
            options={resolvedOptions}
            optionLabel={'displayName'}
            optionValue="id"
            placeholder={placeholder ? t(placeholder as string) : ''}
            panelClassName="select-component-panel"
            disabled={disabled}
          />
        )}
      </div>

      {error && <Validator error={error} />}
    </div>
  );
});

export default Select;
