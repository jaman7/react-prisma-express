import jwt, { SignOptions } from "jsonwebtoken";
import config from "config";

export const signJwt = (
  payload: Object,
  keyName: "accessTokenPrivateKey" | "refreshTokenPrivateKey",
  options: SignOptions
) => {
  const privateKey = Buffer.from(
    config.get<string>(keyName),
    "base64"
  ).toString("ascii");
  return jwt.sign(payload, privateKey, {
    ...(options && options),
    algorithm: "RS256",
    allowInsecureKeySizes: true,
  });
};

export const verifyJwt = <T>(
  token: string,
  keyName: "accessTokenPublicKey" | "refreshTokenPublicKey"
): T | null => {
  try {
    const publicKey = Buffer.from(
      config.get<string>(keyName),
      "base64"
    ).toString("ascii");
    const decoded = jwt.verify(token, publicKey) as T;
    return decoded ?? null;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      console.error("Token has expired");
    } else if (error instanceof jwt.JsonWebTokenError) {
      console.error("Invalid token");
    } else {
      console.error("Token verification error", error);
    }
    return null;
  }
};
