import basicAuth from 'basic-auth';
import { Forbidden } from '../util/exception';
import jwt from 'jsonwebtoken';
import config from '../../config/secret.config';
import { Context, Next } from 'koa';

interface IDecode {
  uid: string;
  scope: number;
}

// usage: new Auth().m
export class Auth {
  level: number;
  static COMMON: number;
  static ADMIN: number;
  static MINI_PROGRAM: number;

  constructor(level?: number) {
    this.level = level || 1;
    Auth.COMMON = 8;
    Auth.MINI_PROGRAM = 8;
    Auth.ADMIN = 16;
  }

  get m() {
    return async (ctx: Context, next: Next) => {
      let decode: IDecode;
      let errMsg = 'Token Uuanthorized';

      // 解密Token
      const userToken = basicAuth(ctx.req);

      if (!userToken || !userToken.name) {
        throw new Forbidden('禁止访问', 10003);
      }

      try {
        decode = jwt.verify(userToken.name, config.SECURITY.secretKey) as IDecode;
      } catch (error) {
        // jwt内置错误
        if (error.name === 'TokenExpiredError') {
          errMsg = 'Token Expired';
        }
        throw new Forbidden(errMsg);
      }

      if (decode.scope < this.level) {
        throw new Forbidden('权限不足');
      }

      const { uid, scope } = decode;

      ctx.auth = {
        uid,
        scope,
      };
      await next();
    };
  }

  static verifyToken(token: string): boolean {
    try {
      jwt.verify(token, config.SECURITY.secretKey);
      return true;
    } catch (error) {
      return false;
    }
  }
}

export default Auth;
