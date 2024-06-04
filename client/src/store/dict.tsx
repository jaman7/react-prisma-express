import { IDictType } from 'shared/components/select/Select.model';

export const statuses = (): IDictType[] => [
  { id: 1, displayName: 'Todo' },
  { id: 2, displayName: 'Pending' },
  { id: 3, displayName: 'Done' },
];
