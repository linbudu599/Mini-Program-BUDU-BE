import { Context, Next } from 'koa';
import { HttpException } from '../util/types';

export const catchError = async (ctx: Context, next: Next) => {
  try {
    await next();
  } catch (error) {
    const { errorCode, status, message }: HttpException = error;
    if (error instanceof HttpException) {
      ctx.status = status;
      ctx.body = {
        errorCode,
        requestUrl: `${ctx.method} ${ctx.path}`,
        message,
      };
    } else {
      // unknown error
      ctx.status = 500;
      ctx.body = {
        errorCode: 999,
        requestUrl: `${ctx.method} ${ctx.path}`,
        message: '呜呜呜对不起俺们服务器出错了',
      };
    }
  }
};
