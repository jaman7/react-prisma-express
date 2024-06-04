export interface ICheckbox {
  placeholder?: string;
  checked?: boolean;
  disabled?: boolean;
  readonly?: boolean;
}

export const checkboxConfigDefault = (): ICheckbox => ({
  checked: false,
  disabled: false,
});
