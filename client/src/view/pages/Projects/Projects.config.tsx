import { ITableColumns } from '@/shared/components/table/table.model';

export const apiProjects = 'projects';

export const columnConfig: { [name: string]: ITableColumns } = {
  name: {},
  isActive: { type: 'Boolean', diableFiltrSort: true },
  users: { type: 'UserList', userLogoSize: 24, diableFiltrSort: true },
  taskCountAll: { diableFiltrSort: true },
  taskCountDone: { diableFiltrSort: true },
  taskCountNotDone: { diableFiltrSort: true },
  createdAt: { type: 'DateTime' },
  updatedAt: { type: 'DateTime' },
};
