import { IFormElementsConfig, IFormElementsEnum } from '@/shared/components/formElements/FormElements.model';
import { IFormPanelValues } from './ProjectsEditModal.model';
import * as yup from 'yup';
import UserAssignEdit from '@/shared/components/user-assign/UserAssignEdit';

const { TEXTAREA, SORTABLE_COLUMNS, DATETIME, CHECKBOX, CHECKBOX_MATRIX_COLUMN_RULES, USER_ASSIGN_EDIT } = IFormElementsEnum;

export const formModalConfig = (): IFormElementsConfig => ({
  name: {},
  description: { config: { formCellType: TEXTAREA } },
  createdAt: { config: { formCellType: DATETIME, disabled: true } },
  updatedAt: { config: { formCellType: DATETIME, disabled: true } },
  isActive: { config: { formCellType: CHECKBOX, disabled: true, size: 'sm' } },
  users: { config: { formCellType: USER_ASSIGN_EDIT, dictName: 'usersDict', size: 'sm', userLogoSize: 30, isPicklist: false } },
  columns: { config: { formCellType: SORTABLE_COLUMNS } },
  taskColumnsMoveRules: { config: { formCellType: CHECKBOX_MATRIX_COLUMN_RULES, dictName: 'rulesDict' } },
});

export const formDefault: IFormPanelValues = {
  id: null,
  name: null,
  description: null,
  createdAt: null,
  updatedAt: null,
  isActive: null,
  columns: [],

  // [
  //   {
  //     name: 'To Do',
  //     position: 1,
  //     status: 'TO_DO',
  //   },
  //   {
  //     name: 'In Progress',
  //     position: 2,
  //     status: 'IN_PROGRESS',
  //   },
  //   {
  //     name: 'CR',
  //     position: 3,
  //     status: 'CR',
  //   },
  //   {
  //     name: 'Ready for test',
  //     position: 4,
  //     status: 'READY_FOR_TEST',
  //   },
  //   {
  //     name: 'Testing',
  //     position: 5,
  //     status: 'TESTING',
  //   },
  //   {
  //     name: 'Done',
  //     position: 6,
  //     status: 'DONE',
  //   },
  // ],
  taskColumnsMoveRules: {},
  users: [],
};

export const translatePrefix = 'modal';

export const schema = yup.object({
  id: yup.mixed<string | number>().nullable(),
  name: yup.string().required('Nazwa jest wymagana').max(100, 'Nazwa nie może przekraczać 100 znaków').nullable(),
  description: yup.string().nullable(),
  columns: yup
    .array()
    .of(
      yup.object().shape({
        name: yup.string().required('Nazwa kolumny jest wymagana'),
        position: yup.number().required(),
        status: yup.string().required(),
      })
    )
    .min(1, 'Przynajmniej jedna kolumna jest wymagana')
    .nullable(),
  createdAt: yup.date().nullable(),
  updatedAt: yup.date().nullable(),
  isActive: yup.boolean().nullable(),
  taskColumnsMoveRules: yup.object().nullable(),
  users: yup.array().of(yup.string()).nullable(),
});
