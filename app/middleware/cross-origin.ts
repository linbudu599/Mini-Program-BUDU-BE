import { Context, Next } from 'koa';

export default async (ctx: Context, next: Next) => {
  ctx.set('Access-Control-Allow-Origin', 'http://localhost:8080');
  ctx.set(
    'Access-Control-Allow-Headers',
    'Content-Type, Content-Length, Authorization, Accept, X-Requested-With',
  );
  ctx.set('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  if (ctx.method === 'OPTIONS') {
    ctx.body = 200;
  } else {
    await next();
  }
};
