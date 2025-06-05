import { Checkbox, CheckboxChangeEvent } from 'primereact/checkbox';
import { Tooltip } from 'primereact/tooltip';
import { forwardRef, useId, useMemo } from 'react';
import classNames from 'classnames';
import { ICheckbox, checkboxConfigDefault } from './CheckboxMain.model';
import Validator from '../validator/Validator';
import { FaCheck, FaRegCheckCircle, FaRegTimesCircle } from 'react-icons/fa';
import { useFallbackTranslation } from '@/hooks/useFallbackTranslation';

interface IProps {
  name?: string;
  config?: Partial<ICheckbox>;
  onChange?: (value: boolean) => void;
  error?: string | null | undefined;
  touched?: boolean;
  value?: boolean;
  tooltip?: string;
}

const CheckboxMain = forwardRef<HTMLInputElement, IProps>(({ name, value, onChange, error, config, tooltip }, ref) => {
  const { t } = useFallbackTranslation();

  const checkboxConfig = useMemo(() => ({ ...checkboxConfigDefault(), ...config }), [config]);

  const { disabled, readonly, size } = checkboxConfig || {};

  const tooltipId = useId();

  const handleChange = (e: CheckboxChangeEvent) => {
    onChange?.(e?.checked as boolean);
  };

  const sizeClasses = {
    xxs: 'xxs',
    xs: 'xs',
    sm: 'sm',
    lg: 'lg',
  };

  const checkboxClasses = classNames('checkbox-component', sizeClasses[size || 'sm'], {
    invalid: error && !disabled,
    'cursor-not-allowed': disabled,
  });

  return (
    <>
      <div className="d-flex flex-column w-auto" ref={ref}>
        <Checkbox
          id={`${name?.toLowerCase() ?? ''}`}
          inputId={`${name?.toLowerCase() ?? ''}`}
          name={`${name?.toLowerCase() ?? ''}`}
          disabled={disabled}
          readOnly={readonly}
          checked={value as boolean}
          className={`${checkboxClasses} target-tooltip-checkbox-${name?.toLowerCase() ?? ''}`}
          value={value}
          onChange={(e) => handleChange(e)}
          icon={<FaCheck />}
          data-pr-tooltip={t(tooltip || '')}
          data-pr-classname={`shadow-none`}
          data-pr-position="top"
        />
        {tooltip && <Tooltip target={`.target-tooltip-checkbox-${name?.toLowerCase() ?? ''}`} autoHide={false} />}
        {error && <Validator error={t(error)} />}
      </div>
    </>
  );
});

export default CheckboxMain;
