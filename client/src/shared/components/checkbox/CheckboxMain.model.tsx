export interface ICheckbox {
  disabled?: boolean;
  readonly?: boolean;
  size?: 'xxs' | 'xs' | 'sm' | 'lg';
}

export const checkboxConfigDefault = (): ICheckbox => ({
  disabled: false,
  readonly: false,
});
