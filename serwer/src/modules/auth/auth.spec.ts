import request from 'supertest';
import app from '@/index';
import redisClient from '@/utils/connectRedis';
import tokenService from '@/services/token.service';

let validRefreshToken: string;
let userId: string;
let server: any;

beforeAll(async () => {
  server = app.listen(0);

  const user = {
    id: '815d7af0-43b2-4d26-a29f-76de4c51b0f1',
    email: 'test@example.com',
    name: 'jan',
    password: 'hashed-password',
  };
  userId = user.id;

  const tokens = await tokenService.signTokens(user);
  validRefreshToken = tokens.refreshToken;

  await redisClient.set(
    `${userId}`,
    JSON.stringify({
      id: userId,
      refreshTokenId: JSON.parse(Buffer.from(validRefreshToken.split('.')[1], 'base64').toString()).jti,
    })
  );
});

afterAll(async () => {
  await redisClient.quit();
  server.close();
});

describe('Refresh Access Token Handler', () => {
  it('should refresh tokens with valid refreshToken', async () => {
    const res = await request(app).post('/api/auth/refresh').send({ refreshToken: validRefreshToken });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('accessToken');
    expect(res.body).toHaveProperty('refreshToken');
  });

  it('should reject old refreshToken after refreshing', async () => {
    await request(app).post('/api/auth/refresh').send({ refreshToken: validRefreshToken });

    const res = await request(app).post('/api/auth/refresh').send({ refreshToken: validRefreshToken });

    expect(res.status).toBe(403);
    expect(res.body.message).toBe('Could not refresh access token');
  });
});
