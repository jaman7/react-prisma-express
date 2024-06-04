export type IFileUploadTypes = 'basic' | 'advanced';

export interface IFileUpload {
  mode?: IFileUploadTypes;
  accept?: string | boolean;

  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  disableBtnNumbers?: boolean;
  disabled?: boolean;
  [name: string]: any | any[];
}

export const inputConfigDefault = (): IFileUpload => ({
  placeholder: '',
  step: 1,
  type: 'text',
  disableBtnNumbers: false,
});
