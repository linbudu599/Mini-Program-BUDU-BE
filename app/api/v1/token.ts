import Koa, { DefaultState, DefaultContext, Next, Context } from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';

import { TokenValidator } from '../../validator';
import User from '../../model/User';

import { LoginType } from '../../validator';

const router = new Router({
  prefix: '/v1/token',
});

router.use(bodyParser());

export const token = (server: Koa<DefaultState, DefaultContext>) => {
  server.use(async (ctx: Context, next: Next) => {
    router.post('/', async (ctx: Context) => {
      const v = new TokenValidator();
      await v.validate(ctx);
      switch (v.get('body.type')) {
        case LoginType.EMAIL:
          break;
        case LoginType.MINI_PROGRAM:
          break;
        case LoginType.MOBILE:
          break;

        default:
          break;
      }
    });

    server.use(router.routes()).use(router.allowedMethods());

    await next();
  });
};

async function loginByEmail(account: string, secret: string) {
   
}
