export interface IAuthUserProjects {
  projectId?: string;
  role?: string;
  assignedAt?: string;
}

export interface IAuthUserTasks {
  id?: string;
  title?: string;
  status?: string;
  createdAt?: string;
}

export interface IAuthUserNotification {
  id?: string;
  type?: string;
  message?: string;
  createdAt?: string;
  task?: IAuthUserTasks[];
}

export interface IAuthUser {
  id?: string;
  createdAt?: string;
  createdBy?: string;
  deletedAt?: string;
  email?: string;
  password?: string;
  image?: string;
  isDeleted?: boolean;
  lastName?: string;
  location?: string;
  name?: string;
  phone?: string;
  role?: string;
  title?: string;
  updatedAt?: string;
  updatedBy?: string;
  dateSync?: string;
  activeProjectId?: string;
  verificationCode?: string;
  verified?: string;
  projects?: IAuthUserProjects[];
  tasks?: IAuthUserTasks[];
  notification?: IAuthUserNotification[];
}

export interface IAuth {
  accessToken?: string;
  accessTokenExpiresAt?: string;
  refreshToken?: string;
  refreshTokenExpiresAt?: string;
  status?: string;
}

export interface IUseAuth {
  auth?: IAuth | null;
  user?: IAuthUser | null;
  login?: (email: string, password: string) => Promise<void>;
  logout?: () => Promise<void>;
  refreshToken?: () => Promise<void>;
  signup?: (name: string, email: string, password: string, passwordConfirm: string) => Promise<IAuthUser | null>;
  setActivProject?: (activeProjectId: string) => void;
}
