import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import Koa from 'koa';

import { HttpException, ParamException } from '../../util/types';

const router = new Router();

router.use(bodyParser());

export const classic = (server: Koa<Koa.DefaultState, Koa.DefaultContext>) => {
  server.use(async (ctx, next) => {
    // TODO: Extract Router And API
    router.get('/v1/classic', async (ctx: Koa.Context) => {
      ctx.body = 'V1 classsic';
      throw new Error('A');
    });

    router.post('/v1/:id/classic', async (ctx: Koa.Context) => {
      const {
        params,
        request,
        request: { body, header, query },
      } = ctx;

      if (query) {
        throw new ParamException('error!', 10001);
      }
      ctx.body = 'V1 classsic';
    });

    server.use(router.routes()).use(router.allowedMethods());

    await next();
  });
};
