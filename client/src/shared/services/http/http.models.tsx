export interface IParams {
  [key: string]: any;
}

export interface ITokens {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt: string;
  refreshTokenExpiresAt: string;
}
