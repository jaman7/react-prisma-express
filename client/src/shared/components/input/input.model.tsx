import { IFormElementsTypes } from '../formElements/FormElements.model';
import { InputTypes } from './input.types';

export interface IInput {
  type?: InputTypes;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  disableBtnNumbers?: boolean;
  disabled?: boolean;
  value?: string | number;
}

export const inputConfigDefault = (): IInput => ({
  placeholder: '',
  step: 1,
  type: 'text',
  disableBtnNumbers: false,
});
