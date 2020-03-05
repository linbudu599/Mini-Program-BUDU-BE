import jwt from 'jsonwebtoken';
import config from '../../config/secret.config';

const generateToken = (uid: any, scope: any) => {
  const secretKey = config.SECURITY.secretKey;
  const expiresIn = config.SECURITY.expiresIn;
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

export default generateToken;
