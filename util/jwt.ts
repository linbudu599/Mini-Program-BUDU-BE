import jwt from 'jsonwebtoken';

import config from '../config/config';

const {
  security: { secretKey, expiresIn },
} = config;

const generateToken = (uid: number, scope: number): string => {
  return jwt.sign(
    {
      uid,
      scope,
    },
    secretKey,
    { expiresIn },
  );
};

export default generateToken;
