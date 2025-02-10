import { IFormElementsConfig } from 'shared/components/formElements/FormElements.model';

export const loginConfig = (): IFormElementsConfig => ({
  email: {},
  password: { config: { formCellType: 'input-password' } },
});

export const defaultConfig = (): IFormElementsConfig => ({
  email: {},
  password: { config: { formCellType: 'input-password' } },
  passwordConfirm: { config: { formCellType: 'input-password' } },
});

export const forgotPasswordConfig = (): IFormElementsConfig => ({
  email: {},
});

export const updateProfileConfig = (): IFormElementsConfig => ({
  email: {},
  password: { config: { formCellType: 'input-password' } },
  passwordConfirm: { config: { formCellType: 'input-password' } },
});
