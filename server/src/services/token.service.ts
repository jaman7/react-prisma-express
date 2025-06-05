import jwt, { SignOptions } from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import config from 'config';
import redisClient from '@/utils/connectRedis';
import { Prisma } from '@prisma/client';
import logger from '@/utils/logger';

class TokenService {
  private getPrivateKey(keyName: 'accessTokenPrivateKey' | 'refreshTokenPrivateKey'): string {
    const privateKeyBase64 = config.get<string>(keyName);
    return Buffer.from(privateKeyBase64, 'base64').toString('utf-8');
  }

  private getPublicKey(keyName: 'accessTokenPublicKey' | 'refreshTokenPublicKey'): string {
    const publicKeyBase64 = config.get<string>(keyName);
    return Buffer.from(publicKeyBase64, 'base64').toString('utf-8');
  }

  public signJwt(payload: Object, keyName: 'accessTokenPrivateKey' | 'refreshTokenPrivateKey', options?: SignOptions): string {
    const privateKey = this.getPrivateKey(keyName);
    return jwt.sign(payload, privateKey, {
      ...(options && options),
      algorithm: 'RS256',
      allowInsecureKeySizes: true,
    });
  }

  public verifyJwt<T>(token: string, keyName: 'accessTokenPublicKey' | 'refreshTokenPublicKey'): T | null {
    try {
      const publicKey = this.getPublicKey(keyName);
      return jwt.verify(token, publicKey) as T;
    } catch (error) {
      logger.error('Token verification failed:', error);
      return null;
    }
  }

  public async signTokens(user: Prisma.UserCreateInput) {
    const refreshTokenId = uuidv4();

    await redisClient.set(`${user.id}`, JSON.stringify({ id: user.id, refreshTokenId }), {
      EX: config.get<number>('redisCacheExpiresIn') * 60,
    });

    const accessToken = this.signJwt({ sub: user.id }, 'accessTokenPrivateKey', {
      expiresIn: `${config.get<number>('accessTokenExpiresIn')}m`,
    });

    const refreshToken = this.signJwt({ sub: user.id, jti: refreshTokenId }, 'refreshTokenPrivateKey', {
      expiresIn: `${config.get<number>('refreshTokenExpiresIn')}m`,
    });

    return { accessToken, refreshToken };
  }
}

export default new TokenService();
