export type IModalType = 'ADD' | 'EDIT' | 'VIEW';

export type IModalButtonsType = 'EDIT' | 'DELETE' | 'CANCEL' | 'SAVE' | 'VIEW';

export interface IModal {
  id?: string;
  visible?: boolean;
  type?: IModalType;
}
