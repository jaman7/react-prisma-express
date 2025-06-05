import { IDictionary } from 'shared/components/select/Select.model';

export interface IBoardColumn {
  id?: string;
  name?: string;
  position?: number;
  boardId?: string;
  status?: ColumnStatus;
}

export interface IMoveRulesColumn {
  id?: string;
  boardId?: string;
  rules?: Record<string, string[]>;
}

export interface IBoardTask {
  id?: string;
  title?: string;
  description?: string;
  position?: number;
  columnId?: string;
  boardId?: string;
  userId?: string | null;
  status?: TaskStatus;
  createdAt?: string;
  updatedAt?: string;
  [name: string]: any;
}
export interface IBoard {
  id?: string;
  projectId?: string;
  createdAt?: string;
  updatedAt?: string;
  columns?: IBoardColumn[];
  tasks?: IBoardTask[];
  moveRules?: IMoveRulesColumn;
}
export interface IBoardProject {
  id?: string;
  name?: string;
  description?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  board?: IBoard;
  users?: string[];
}

export type ColumnStatus = 'TO_DO' | 'IN_PROGRESS' | 'CR' | 'READY_FOR_TEST' | 'TESTING' | 'DONE';

export type TaskStatus = ColumnStatus;

export interface IData {
  board?: IBoard;
  dict?: IDictionary;
  isLoading?: boolean;
  isSideBarOpen?: boolean;
  error?: boolean;
}
