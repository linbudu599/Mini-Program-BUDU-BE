import basicAuth from 'basic-auth';
import { Forbidden } from '../../util/types';
import jwt from 'jsonwebtoken';
import config from '../../config/config';
import { Context, Next } from 'koa';

let generalErrMsg = 'Token Uuanthorized';

interface decode {
  uid: string;
  scope: string;
}

class Auth {
  constructor() {}

  get m() {
    return async (ctx: Context, next: Next) => {
      let decode;

      const userToken = basicAuth(ctx.req);
      console.log(userToken);
      // await next();
      if (!userToken || !userToken.name) {
        throw new Forbidden('禁止访问嗷', 10003);
      }
      try {
        decode = jwt.verify(userToken.name, config.security.secretKey) as decode;
      } catch (error) {
        // 合法/过期
        if (error.name === 'TokenExpiredError') {
          generalErrMsg = 'Token Expired';
        }
        throw new Forbidden(generalErrMsg);
      }
      ctx.auth = {
        uid: decode.uid,
        scope: decode.scope,
      };
      ctx.body = userToken;
    };
  }
}

export default Auth;
