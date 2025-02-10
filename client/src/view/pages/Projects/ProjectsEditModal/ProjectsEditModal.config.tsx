import { IFormElementsConfig } from '@/shared/components/formElements/FormElements.model';

export const formUserModalConfig = (): IFormElementsConfig => ({
  name: {},
  lastName: {},
  email: {},
  password: { config: { formCellType: 'input-password', value: 'Kanban1!' } },
  title: {},
  phone: {},
  location: {},
});

export const translatePrefix = 'modal';
