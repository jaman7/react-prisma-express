import { InputTextarea } from 'primereact/inputtextarea';
import { ChangeEvent, forwardRef, useMemo } from 'react';
import { ITextArea, textAreaConfigDefault } from './TextArea.model';
import { classNames } from 'primereact/utils';
import Validator from '../validator/Validator';
import { useFallbackTranslation } from '@/hooks/useFallbackTranslation';

interface IProps {
  name?: string;
  config?: Partial<ITextArea>;
  onChange?: (value: string) => void;
  error?: string | null | undefined;
  touched?: boolean;
  value?: string | null;
}

const TextArea = forwardRef<HTMLInputElement, IProps>(({ name, value = '', onChange, error, config = {} }, ref) => {
  const { t } = useFallbackTranslation();

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
        value={value || undefined}
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
