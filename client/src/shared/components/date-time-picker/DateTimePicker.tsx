import { forwardRef, useMemo } from 'react';
import { classNames } from 'primereact/utils';
import Validator from '../validator/Validator';
import { Calendar } from 'primereact/calendar';
import { FormEvent } from 'primereact/ts-helpers';
import { DateTimePickerConfigDefault, IDateTimePicker } from './DateTimePicker.models';
import { useFallbackTranslation } from '@/hooks/useFallbackTranslation';

interface IProps {
  name?: string;
  config?: Partial<IDateTimePicker>;
  value?: any;
  onChange?: (value: Date) => void;
  error?: string | null | undefined;
  touched?: boolean;
}

const DateTimePicker = forwardRef<HTMLInputElement, IProps>(({ name, value, onChange, error, config }, ref) => {
  const { t } = useFallbackTranslation();

  const dateTimeConfig: IDateTimePicker = useMemo(() => ({ ...DateTimePickerConfigDefault(), ...config }), [config]);

  const { disabled, readonly, placeholder, dateFormat, view, inline, selectionMode, formCellType } = dateTimeConfig || {};

  const handleChange = (e: FormEvent) => {
    console.log(e.value);
    onChange?.(e.value);
  };

  const parsedValue = useMemo(() => {
    if (value && typeof value === 'string') {
      return new Date(value);
    }
    return value;
  }, [value]);

  const dateClasses = classNames('datepicker-component__date', { invalid: error && !disabled, 'cursor-not-allowed bg-disabled': disabled });

  return (
    <div className="datepicker-component">
      <div className="datepicker-component__container" ref={ref}>
        <Calendar
          className={dateClasses}
          panelClassName="datepicker-panel"
          id={name}
          name={name}
          value={parsedValue}
          onChange={handleChange}
          showButtonBar={true}
          disabled={disabled}
          dateFormat={dateFormat}
          view={view}
          inline={inline}
          selectionMode={selectionMode}
          placeholder={placeholder ? t(placeholder) : ''}
          viewDate={parsedValue}
          showIcon={true}
          variant="filled"
        />
      </div>

      {error && <Validator error={t(error)} />}
    </div>
  );
});

export default DateTimePicker;
