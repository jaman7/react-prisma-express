import { IDictionary, IDictType } from '../components/select/Select.model';

export interface IProjectDict {
  id: number | string;
  displayName: string;
  boards?: number[];
}

export interface IBoardsDict {
  id: number | string;
  displayName: string;
  projectId?: number;
}

export interface IDictionaries extends IDictionary {
  usersDict: IDictType[];
  userProjectsDict: IDictType[];
  projectDict: IProjectDict[];
  boardsDict: IBoardsDict[];
  [name: string]: IDictType[];
}
