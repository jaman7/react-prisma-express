export interface ITextEditor {
  disabled?: boolean;
  readonly?: boolean;
  placeholder?: string;
}

export const textEditorDefault = (): ITextEditor => ({
  disabled: false,
  readonly: false,
});
