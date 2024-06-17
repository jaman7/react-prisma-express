import { IDictionary } from 'shared/components/select/Select.model';

export interface IBoardTask {
  id?: string;
  boardId?: string;
  title?: string;
  description?: string;
  status?: number | null;
  taskIdentifier?: string;
  dateCreated?: string;
  userId?: number;
  position?: number;
}

export interface IColumns {
  id?: string;
  boardId?: string;
  name?: string;
  position?: number;
  dateCreated?: string;
}

export interface IBoardOnUser {
  assignedAt?: string;
  assignedBy?: string;
  boardId?: string;
  userId?: string;
}

export interface IBoard {
  id?: string;
  name?: string;
  isActive?: boolean;
  columns?: IColumns[];
  tasks?: IBoardTask[];
  dateCreated?: string;
  BoardOnUser?: IBoardOnUser[];
  [name: string]: any;
}

export interface IFakeUsers {
  id?: number;
  _id?: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  email?: string;
  image?: string;
}

export interface IUser {
  id?: number;
  createdAt?: string;
  email?: string;
  name?: string;
  lastName?: string;
  image?: string;
  role?: string;
  dateSync?: string;
  title?: string;
  phone?: string;
  location?: string;
}

export interface IData {
  dict?: IDictionary;
  boards?: IBoard[];
  fakeUsers?: IFakeUsers[];
  isLoading?: boolean;
  isSideBarOpen?: boolean;
  error?: boolean;
  users?: IUser[];
  user?: IUser;
}
