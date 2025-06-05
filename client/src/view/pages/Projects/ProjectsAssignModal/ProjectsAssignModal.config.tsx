import { IFormElementsConfig, IFormElementsEnum } from '@/shared/components/formElements/FormElements.model';
import { IFormPanelValues } from './ProjectsAssignModal.model';
import * as yup from 'yup';

const { USER_ASSIGN_EDIT } = IFormElementsEnum;

export const formModalConfig = (): IFormElementsConfig => ({
  name: {},
  users: { config: { formCellType: USER_ASSIGN_EDIT, dictName: 'usersDict', size: 'sm', userLogoSize: 30 } },
});

export const formDefault: IFormPanelValues = {
  users: [],
};

export const translatePrefix = 'modal';

export const schema = yup.object({
  users: yup.array().of(yup.string()).nullable(),
});
