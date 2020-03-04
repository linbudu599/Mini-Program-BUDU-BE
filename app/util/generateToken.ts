import jwt from 'jsonwebtoken';

export const generateToken = (uid: any, scope: any) => {
  const secretKey = (global as any).config.security.secretKey;
  const expiresIn = (global as any).config.security.expiresIn;
  const token = jwt.sign(
    {
      uid,
      scope,
    },
    secretKey,
    {
      expiresIn,
    },
  );
  return token;
};
