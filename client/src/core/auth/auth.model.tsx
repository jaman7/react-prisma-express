export interface IUseAuth {
  user?: any;
  login?: (email: string, password: string) => Promise<void>;
  logout?: () => Promise<void>;
  refreshToken?: () => Promise<void>;
}

export interface ILogin {
  accessToken?: string;
  accessTokenExpiresAt?: string;
  refreshToken?: string;
  refreshTokenExpiresAt?: string;
  status?: string;
}
