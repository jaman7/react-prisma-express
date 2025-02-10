import { useMemo } from 'react';
import { IFormElements, IFormElementsEnum } from './FormElements.model';
import { Controller, useFormContext } from 'react-hook-form';
import Input from '../input/Input';
import Select from '../select/Select';
import { useTranslation } from 'react-i18next';
import CheckboxMain from '../checkbox/CheckboxMain';
import DateTimePicker from '../date-time-picker/DateTimePicker';
import classNames from 'classnames';
import TextArea from '../textarea/TextArea';
import TextEditor from '../text-editor/TextEditor';

interface IProps {
  formControlName: string;
  config?: IFormElements;
}

const { SELECT, CHECKBOX, DATETIME, TEXTAREA, TEXT, NUMBER, PASSWORD, SEARCH, RANGE, TEXT_EDITOR } = IFormElementsEnum;

const FormElements = ({ formControlName, config }: IProps) => {
  const { t } = useTranslation();
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const { formCellType, styleClass, header } = config || {};
  const isCheckbox = formCellType === CHECKBOX;

  const elementMap = useMemo(
    () => ({
      [TEXT]: Input,
      [NUMBER]: Input,
      [PASSWORD]: Input,
      [SEARCH]: Input,
      [RANGE]: Input,
      [SELECT]: Select,
      [CHECKBOX]: CheckboxMain,
      [DATETIME]: DateTimePicker,
      [TEXTAREA]: TextArea,
      [TEXT_EDITOR]: TextEditor,
    }),
    []
  );

  const Element = elementMap[formCellType as keyof typeof elementMap];

  const containerClass = classNames('d-block py-1', styleClass, {
    'd-flex align-items-center justify-content-end flex-row-reverse gap-2': isCheckbox,
  });

  return (
    <div className={containerClass}>
      {header && (
        <label className="text-secondary text-sm" htmlFor={formControlName}>
          {t(header)}
        </label>
      )}
      {Element && (
        <Controller
          name={formControlName}
          control={control}
          render={({ field }) => (
            <Element {...field} config={config as Partial<IFormElements>} error={errors[formControlName]?.message as string} />
          )}
        />
      )}
    </div>
  );
};

export default FormElements;
