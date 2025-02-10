import { Editor, EditorTextChangeEvent } from 'primereact/editor';
import { ChangeEvent, forwardRef, useMemo } from 'react';
import { ITextEditor, textEditorDefault } from './TextEditor.model';
import { useTranslation } from 'react-i18next';
import { classNames } from 'primereact/utils';
import Validator from '../validator/Validator';

interface IProps {
  name?: string;
  config?: Partial<ITextEditor>;
  onChange?: (value: string | null) => void;
  error?: string | null | undefined;
  touched?: boolean;
  value?: string;
}

const TextEditor = forwardRef<HTMLInputElement, IProps>(({ name, value, onChange, error, config = {} }, ref) => {
  const { t } = useTranslation();

  const textareaConfig = useMemo(() => ({ ...textEditorDefault(), ...config }), [config]);

  const { disabled, readonly, placeholder } = textareaConfig || {};

  const handleChange = (e: EditorTextChangeEvent) => {
    onChange?.(e?.htmlValue);
  };

  const isInvalid = error && !textareaConfig.disabled;
  const editorClasses = classNames('texteditor-component', {
    invalid: isInvalid,
    'cursor-not-allowed bg-disabled': disabled,
  });

  return (
    <div className="d-flex flex-column w-auto" ref={ref}>
      <Editor
        id={name}
        name={name}
        aria-labelledby={name}
        aria-invalid={!!error}
        placeholder={placeholder ? t(placeholder) : ''}
        disabled={disabled}
        readOnly={readonly}
        className={editorClasses}
        value={value}
        onTextChange={handleChange}
      />

      {error && <Validator error={t(error)} />}
    </div>
  );
});

export default TextEditor;
