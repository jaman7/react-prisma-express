export type SelectType = 'Select';

export interface IDictType {
  displayName?: string;
  id?: number | string;
  [name: string]: any;
}

export interface IDictionary {
  [name: string]: IDictType[];
}

export interface ISelect {
  formControlName?: string;
  placeholder?: string;
  readonly?: boolean;
  field?: string;
  type?: SelectType;
  defaultValue?: number;
  dictData?: IDictType[];
  disabled?: boolean;
  [name: string]: any;
}

export const selectConfigDefault = (): ISelect => ({
  size: 'default',
  mode: 'default',
  placeholder: '',
  dictData: [],
  formCellClass: '',
  customClass: '',
});
