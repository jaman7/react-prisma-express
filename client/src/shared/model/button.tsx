import { MouseEventHandler } from 'react';

export interface IButtons {
  children?: string | JSX.Element;
  className?: string;
  customClass?: string;
  tooltip?: string;
  round?: boolean;
  action?: (e?: MouseEventHandler<HTMLButtonElement>) => void;
  disabled?: boolean;
}

export type IButtonsType = 'EDIT' | 'DELETE' | 'CANCEL' | 'SAVE';
