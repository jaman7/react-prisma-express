export interface ITextArea {
  disabled?: boolean;
  readonly?: boolean;
  rows?: number;
  cols?: number;
  placeholder?: string;
}

export const textAreaConfigDefault = (): ITextArea => ({
  disabled: false,
  readonly: false,
  rows: 5,
  cols: 30,
});
