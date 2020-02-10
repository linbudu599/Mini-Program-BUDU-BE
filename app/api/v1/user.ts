import Koa, { DefaultState, DefaultContext, Next, Context } from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';

import { successHandler } from '../../helper';
import { RegisterValidator } from '../../validator';

import User from '../../model/User';

const router = new Router({
  prefix: '/v1/user',
});

router.use(bodyParser());

export const user = (server: Koa<DefaultState, DefaultContext>) => {
  server.use(async (ctx: Context, next: Next) => {
    router.post('/register', async (ctx: Context) => {
      const v = new RegisterValidator();

      await v.validate(ctx);

      const user = {
        email: v.get('body.email'),
        password: v.get('body.confirmPwd'),
        nickName: v.get('body.nickName'),
      };
      await User.create(user);
      // TODO: Use A Normal Handler!!
      successHandler();
    });

    server.use(router.routes()).use(router.allowedMethods());

    await next();
  });
};
