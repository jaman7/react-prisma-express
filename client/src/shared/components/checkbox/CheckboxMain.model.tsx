export interface ICheckbox {
  disabled?: boolean;
  readonly?: boolean;
}

export const checkboxConfigDefault = (): ICheckbox => ({
  disabled: false,
  readonly: false,
});
