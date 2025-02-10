import { readFileSync } from 'fs';
import { resolve } from 'path';

export default {
  redisCacheExpiresIn: 5, // 5 minut dla Redis TTL
  refreshTokenExpiresIn: 5, // 5 minut
  accessTokenExpiresIn: 5, // 5 minut
  accessTokenPrivateKey: readFileSync(resolve(__dirname, './keys/private.key')).toString('base64'),
  accessTokenPublicKey: readFileSync(resolve(__dirname, './keys/public.key')).toString('base64'),
  refreshTokenPrivateKey: readFileSync(resolve(__dirname, './keys/private.key')).toString('base64'),
  refreshTokenPublicKey: readFileSync(resolve(__dirname, './keys/public.key')).toString('base64'),
  origin: 'http://localhost:3000',
};
