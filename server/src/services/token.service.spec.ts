import tokenService from '@/services/token.service';
import redisClient from '@/utils/connectRedis';
import config from 'config';

afterAll(async () => {
  await redisClient.quit();
});

describe('TokenService', () => {
  const mockUser = { id: '815d7af0-43b2-4d26-a29f-76de4c51b0f1', email: 'test@example.com', name: 'jan', password: 'hashed-password' };

  it('should generate valid tokens', async () => {
    const { accessToken, refreshToken } = await tokenService.signTokens(mockUser);

    expect(accessToken).toBeDefined();
    expect(refreshToken).toBeDefined();
  });

  it('should verify a valid JWT', () => {
    const token = tokenService.signJwt({ sub: mockUser.id }, 'accessTokenPrivateKey');
    const decoded = tokenService.verifyJwt<{ sub: string }>(token, 'accessTokenPublicKey');

    expect(decoded?.sub).toBe(mockUser.id);
  });

  it('should return null for an invalid JWT', () => {
    const decoded = tokenService.verifyJwt('invalid-token', 'accessTokenPublicKey');
    expect(decoded).toBeNull();
  });
});
