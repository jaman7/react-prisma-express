import { IDictType } from '../select/Select.model';

export interface ICheckboxMatrix {
  formControlName?: string;
  placeholder?: string;
  defaultValue?: Record<string, string[]>;
  dictData?: IDictType[];
  disabled?: boolean;
  size?: string;
}

export const checkboxMatrixConfigDefault = (): ICheckboxMatrix => ({
  size: 'default',
  placeholder: '',
  dictData: [],
  disabled: false,
});
