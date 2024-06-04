import { InputTypes } from './input.types';

export interface IInput {
  type?: InputTypes;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  disableBtnNumbers?: boolean;
  disabled?: boolean;
  [name: string]: any | any[];
}

export const inputConfigDefault = (): IInput => ({
  placeholder: '',
  step: 1,
  type: 'text',
  disableBtnNumbers: false,
});
