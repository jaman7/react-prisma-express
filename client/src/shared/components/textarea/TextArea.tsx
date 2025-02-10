import { InputTextarea } from 'primereact/inputtextarea';
import { ChangeEvent, forwardRef, useMemo } from 'react';
import { ITextArea, textAreaConfigDefault } from './TextArea.model';
import { useTranslation } from 'react-i18next';
import { classNames } from 'primereact/utils';
import Validator from '../validator/Validator';

interface IProps {
  name?: string;
  config?: Partial<ITextArea>;
  onChange?: (value: string) => void;
  error?: string | null | undefined;
  touched?: boolean;
  value?: string;
}

const TextArea = forwardRef<HTMLInputElement, IProps>(({ name, value, onChange, error, config = {} }, ref) => {
  const { t } = useTranslation();

  const textareaConfig = useMemo(() => ({ ...textAreaConfigDefault(), ...config }), [config]);

  const { disabled, readonly, rows, cols, placeholder } = textareaConfig || {};

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onChange?.(e?.target.value);
  };

  const isInvalid = error && !textareaConfig.disabled;
  const textareaClasses = classNames('textarea-component', {
    invalid: isInvalid,
    'cursor-not-allowed bg-disabled': disabled,
  });

  return (
    <div className="d-flex flex-column w-auto" ref={ref}>
      <InputTextarea
        id={name}
        name={name}
        aria-labelledby={name}
        aria-invalid={!!error}
        placeholder={placeholder ? t(placeholder) : ''}
        disabled={disabled}
        readOnly={readonly}
        className={textareaClasses}
        value={value}
        onChange={handleChange}
        invalid={!!error}
        rows={rows}
        cols={cols}
      />

      {error && <Validator error={t(error)} />}
    </div>
  );
});

export default TextArea;
