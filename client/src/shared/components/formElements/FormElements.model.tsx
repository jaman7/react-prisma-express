import { IInput } from '../input/input.model';
import { IDictType, ISelect, SelectType } from '../select/Select.model';
import { ICheckbox } from '../checkbox/CheckboxMain.model';
import { InputTypes } from '../input/input.types';
import { IDateTimePicker } from '../date-time-picker/DateTimePicker.models';
import { IFormSortableColumns } from '../FormSortableColumns/FormSortableColumns.model';
import { ICheckboxMatrix } from '../CheckboxMatrix/CheckboxMatrix.model';
import { IUserAssignEdit } from '../user-assign/UserAssignEdit.model';

export type IFormElementsTypes =
  | 'select'
  | 'checkbox'
  | 'dateTime'
  | 'text'
  | 'number'
  | 'search'
  | 'password'
  | 'range'
  | 'input-text'
  | 'input-number'
  | 'input-search'
  | 'input-password'
  | 'input-range'
  | 'textarea'
  | 'text-editor'
  | 'sortable-columns'
  | 'checkbox-matrix-column-rules'
  | 'user-assign-edit-component';

export enum IFormElementsEnum {
  SELECT = 'select',
  CHECKBOX = 'checkbox',
  DATETIME = 'dateTime',
  TEXTAREA = 'textarea',
  TEXT = 'input-text',
  NUMBER = 'input-number',
  SEARCH = 'input-search',
  PASSWORD = 'input-password',
  RANGE = 'input-range',
  TEXT_EDITOR = 'text-editor',
  SORTABLE_COLUMNS = 'sortable-columns',
  CHECKBOX_MATRIX_COLUMN_RULES = 'checkbox-matrix-column-rules',
  USER_ASSIGN_EDIT = 'user-assign-edit-component',
}

export type IFormElements = Omit<
  ISelect & IInput & ICheckbox & IDateTimePicker & IFormSortableColumns & ICheckboxMatrix & IUserAssignEdit,
  'type'
> & {
  formControlName?: string;
  header?: string;
  isHeader?: boolean;
  iconComponent?: React.JSX.Element;
  disabled?: boolean;
  formCellType?: IFormElementsTypes;
  value?: string | number | string[] | number[] | null;
  type?: InputTypes;
  hidden?: boolean;
  styleClass?: string;
  prefix?: string;
  placeholder?: string;
  name?: string;
  max?: number;
  min?: number;
  step?: number;
  rows?: number;
  cols?: number;
  dictName?: string;
  dictData?: IDictType[];
  config?: IFormElements;
  defaultValue?: number | string;
  size?: string;
  mode?: string;
};

export interface IFormElementsConfig {
  [name: string]: IFormElements;
}

export const FormCellConfigDefault = (): IFormElements => ({
  step: 1,
  type: 'text',
});
