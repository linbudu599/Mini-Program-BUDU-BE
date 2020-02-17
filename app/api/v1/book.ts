import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import Koa, { DefaultState, DefaultContext, Next, Context } from 'koa';
import Auth from '../../middleware/auth';

const router = new Router({
  prefix: '/v1/book',
});

router.use(bodyParser());

// 图书的基础数据是另外一个API，公用性API

export const favor = (server: Koa<DefaultState, DefaultContext>) => {
  server.use(async (ctx, next) => {
    // like
    router.post('/hot_list', new Auth().m, async (ctx: Context) => {
      ctx.body = {
        key: 'book',
      };
    });

    server.use(router.routes()).use(router.allowedMethods());

    await next();
  });
};
