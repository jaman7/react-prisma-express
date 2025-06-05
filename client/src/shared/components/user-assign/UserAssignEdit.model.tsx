import { IDictType } from '../select/Select.model';

export interface IUserAssignEdit {
  formControlName?: string;
  placeholder?: string;
  readonly?: boolean;
  disabled?: boolean;
  defaultValue?: number | string;
  dictData?: IDictType[];
  size?: string;
  userLogoSize?: number;
  mode?: 'default';
  display?: string;
  setHeight?: number;
  picklistRows?: number;
  isPicklist?: boolean;
}

export const userAssignEditConfigDefault = (): IUserAssignEdit => ({
  disabled: false,
  readonly: false,
  dictData: [],
  userLogoSize: 50,
  size: 'default',
  mode: 'default',
  placeholder: '',
  display: 'displayName',
  picklistRows: 8,
  setHeight: 10 * 24,
  isPicklist: true,
});
