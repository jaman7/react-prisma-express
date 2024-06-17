import { IModalType } from 'shared';

export interface IModal {
  id?: string;
  visible?: boolean;
  type?: IModalType;
}
