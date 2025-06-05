import { ITableColumns } from '@/shared/components/table/table.model';

export const apiUsers = 'users';

export const columnConfig: { [name: string]: ITableColumns } = {
  name: {},
  lastName: {},
  email: {},
  location: {},
  phone: {},
  createdAt: { type: 'DateTime' },
  updatedAt: { type: 'DateTime' },
};
