export interface IUser {
  id?: string;
  email?: string;
  name?: string;
  lastName?: string;
  image?: string | null;
  role?: string;
}

export interface IProject {
  id?: string;
  name?: string;
  description?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  users?: IUser[] | string[]; // Can hold detailed user objects or transformed strings
  countAll?: number;
  countDone?: number;
  countNotDone?: number;
}
