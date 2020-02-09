import { Success } from '../../util/types';

export const successHandler = (msg: string = 'OK', errCode?: number): never => {
  throw new Success(msg, errCode);
};
