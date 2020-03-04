import bcrypt from 'bcryptjs';

export const encryptor = (pwd: string): string => {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(pwd, salt);
};
