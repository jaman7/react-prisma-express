import { ICheckbox } from '../checkbox/CheckboxComponent.model';
import { IInput } from '../input/input.model';
import { InputTypes } from '../input/input.types';
import { IDictType, ISelect, SelectType } from '../select/Select.model';
import { IFormElementsTypes } from './FormElements.type';

export interface IFormElementsConfig {
  [name: string]: IFormElements;
}

export type IFormElements = Omit<ISelect & IInput & ICheckbox, 'type'> & {
  config?: IFormElements;
  header?: string;
  isHeader?: boolean;
  disabled?: boolean;
  formCellType?: IFormElementsTypes;
  value?: string | number | any | any[];
  type?: SelectType | IFormElementsTypes | InputTypes;
  hidden?: boolean;
  styleClass?: string;
  prefix?: string;
  placeholder?: string;
  isNoPlaceholder?: boolean;
  dictName?: string;
  name?: string;
  max?: number;
  min?: number;
  step?: number;
  dictData?: IDictType[];
  [name: string]: any;
};

export const FormCellConfigDefault = (): IFormElements => ({
  step: 1,
  type: 'text',
});
