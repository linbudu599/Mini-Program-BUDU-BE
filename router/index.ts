import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import Koa from 'koa';

const router = new Router();

router.use(bodyParser());

const route = (server: Koa<Koa.DefaultState, Koa.DefaultContext>) => {
  server.use(async (ctx, next) => {
    router.get('/router', async (ctx: any) => {
      ctx.body = "It's Router Here";
    });

    server.use(router.routes()).use(router.allowedMethods());

    await next();
  });
};

export default route;
