export type SelectType = 'select';

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
  defaultValue?: number | string;
  dictData?: IDictType[];
  disabled?: boolean;
  size?: string;
  mode?: string;
}

export enum SelectEnum {
  SELECT = 'select',
}

export const selectConfigDefault = (): ISelect => ({
  size: 'default',
  mode: 'default',
  placeholder: '',
  dictData: [],
});
