export type IModalType = 'ADD' | 'EDIT' | 'VIEW';

export type IModalButtonsType = 'EDIT' | 'DELETE' | 'CANCEL' | 'SAVE' | 'VIEW' | 'ASSIGN';

export interface IModal {
  id?: number | string;
  visible?: boolean;
  type?: IModalType;
}
