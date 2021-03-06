import { Success } from '../util/exception';

export const successHandler = (msg: string = 'OK', errCode?: number): never => {
  throw new Success(msg, errCode);
};
