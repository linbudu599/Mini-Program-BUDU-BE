import { Context, Next } from 'koa';
import { HttpException } from '../util/exception';

const dev: boolean = process.env.NODE_ENV === 'development';

// 全局异常处理
export const catchError = async (ctx: Context, next: Next) => {
  try {
    await next();
  } catch (error) {
    // console.log(error);
    const isHttpException = error instanceof HttpException;
    // 在生产环境下非预置错误类型直接抛错
    if (!dev && !isHttpException) {
      throw error;
    }
    const { errorCode, status, message } = error;

    // 对于预置错误，返回较详细的信息
    if (isHttpException) {
      ctx.status = status;
      ctx.body = {
        errorCode,
        requestUrl: `${ctx.method} ${ctx.path}`,
        message,
      };
    } else {
      ctx.status = 500;
      ctx.body = {
        errorCode: 999,
        requestUrl: `${ctx.method} ${ctx.path}`,
        message: '呜呜呜对不起俺们服务器出错了',
      };
    }
  }
};
