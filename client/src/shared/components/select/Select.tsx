import { FormikProps } from 'formik';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ISelect, selectConfigDefault } from './Select.model';
import { ifChanged, usePrevious } from 'shared/utils/helpers';

interface IProps {
  config?: ISelect;
  formik?: FormikProps<any>;
  [name: string]: any;
}

const Select = (props: IProps) => {
  const { t } = useTranslation();
  const { config, formControlName, formik } = props || {};
  const value = formik?.values?.[formControlName] ?? null;
  const [selectConfig, setSelectConfig] = useState<Partial<ISelect>>(selectConfigDefault());
  const prevConfig = usePrevious({ config });

  useEffect(() => {
    ifChanged(prevConfig?.config, config, () => {
      setSelectConfig({ ...selectConfigDefault(), ...config });
    });
  }, [config]);

  const { dictData, placeholder, disabled } = selectConfig || {};

  const setChange = (e: DropdownChangeEvent) => {
    formik?.setFieldValue?.(formControlName, e.value);
    e.preventDefault();
  };

  return (
    <>
      <Dropdown
        className="select-component"
        id={formControlName ?? ''}
        name={formControlName ?? ''}
        value={value}
        onChange={e => setChange(e)}
        options={dictData ?? []}
        optionLabel={'displayName'}
        optionValue="id"
        placeholder={placeholder ? t(placeholder as string) : ''}
        panelClassName="select-component-panel"
        disabled={disabled}
      />
    </>
  );
};

export default Select;
