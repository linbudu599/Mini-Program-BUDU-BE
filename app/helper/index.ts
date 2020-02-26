import { Success } from '../../util/exception';
import bcrypt from 'bcryptjs';

export const successHandler = (msg: string = 'OK', errCode?: number): never => {
  throw new Success(msg, errCode);
};

export const encryptor = (pwd: string): string => {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(pwd, salt);
};
