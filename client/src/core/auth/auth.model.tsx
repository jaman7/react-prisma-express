export interface IAuthUser {
  id?: string;
  email?: string;
  name?: string;
  lastName?: string;
  image?: string;
  title?: string;
  phone?: string;
  location?: string;
  role?: string;
  createdAt?: string;
  updatedAt?: string;
  dateSync?: string;
}

export interface IAuth {
  accessToken?: string;
  accessTokenExpiresAt?: string | Date | null;
  refreshToken?: string;
  refreshTokenExpiresAt?: string | Date | null;
  status?: string;
}

export interface IUseAuth {
  auth?: IAuth | null;
  user?: IAuthUser | null;
  login?: (email: string, password: string) => Promise<void>;
  logout?: () => Promise<void>;
  refreshToken?: () => Promise<void>;
}
