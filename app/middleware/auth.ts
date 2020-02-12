import basicAuth from 'basic-auth';
import { Forbidden } from '../../util/types';
import jwt from 'jsonwebtoken';
import config from '../../config/config';
import { Context, Next } from 'koa';

interface IDecode {
  uid: string;
  scope: string;
}

export class Auth {
  static COMMON: number;
  static ADMIN: number;
  static MINI_PROGRAM: number;
  [X: string]: any;
  constructor(level?: number) {
    this.level = level || 1;
    this.COMMON = 8;
    this.MINI_PROGRAM = 8;
    this.ADMIN = 16;
  }

  // !get
  get m() {
    return async (ctx: Context, next: Next) => {
      let decode;
      let errMsg = 'Token Uuanthorized';

      const userToken = basicAuth(ctx.req);
      // await next();
      if (!userToken || !userToken.name) {
        throw new Forbidden('禁止访问嗷', 10003);
      }
      try {
        decode = jwt.verify(userToken.name, config.security.secretKey) as IDecode;
      } catch (error) {
        // 不合法/过期
        if (error.name === 'TokenExpiredError') {
          errMsg = 'Token Expired';
        }
        throw new Forbidden(errMsg);
      }

      if (decode.scope < this.level) {
        throw new Forbidden('权限不足');
      }

      ctx.auth = {
        uid: decode.uid,
        scope: decode.scope,
      };
      await next();
    };
  }

  static verifyToken(token:string) {
    console.log(token);
    try {
      jwt.verify(token, config.security.secretKey);
      return true;
    } catch (error) {
      return false;
    }
  }
}

export default Auth;
