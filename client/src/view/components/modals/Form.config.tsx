import { IFormElementsConfig } from 'shared/components/formElements/FormElements.model';

export const formConfigDefault = (): IFormElementsConfig => ({ boardName: { config: { isHeader: true } } });

export const formTaskConfigDefault = (): IFormElementsConfig => ({
  status: { config: { formCellType: 'select', dictName: 'statusesDict' } },
});

export const boardDefault = {
  boardName: null,
};

export const formUserModalConfig = (): IFormElementsConfig => ({
  name: {},
  lastName: {},
  email: {},
  title: {},
  phone: {},
  location: {},
});
