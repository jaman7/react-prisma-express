import { DATE_TIME_FORMAT } from '@/shared/enums';
import { IFormElementsTypes } from '../formElements/FormElements.model';

const { FNS_DATE } = DATE_TIME_FORMAT;

export type DatePickerTypes = 'dateTime';

export interface IDateTimePicker {
  formControlName?: string;
  formCellType?: IFormElementsTypes;
  dateFormat?: string;
  showTime?: boolean;
  placeholder?: string;
  inline?: boolean;
  isRangeDate?: boolean;
  defaultValue?: string;
  view?: 'month' | 'year' | 'date';
  selectionMode?: 'single' | 'range';
  disabled?: boolean;
  readonly?: boolean;
}

export const DateTimePickerConfigDefault = (): IDateTimePicker => ({
  showTime: false,
  placeholder: '',
  inline: false,
  dateFormat: 'yy-mm-dd',
  view: 'date',
  selectionMode: 'single',
});
