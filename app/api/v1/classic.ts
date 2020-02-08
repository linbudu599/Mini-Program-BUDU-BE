import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import { PIntegerValidator } from '../../validator';
import Koa from 'koa';

import { ParamException } from '../../../util/types';

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

      const v = new PIntegerValidator();

      v.validate(ctx);
      // 会自动根据入参类型做转换
      // 加入false则不会进行转化
      // 由于内部使用了Lodash方法实现，还可以通过`a.b.c.d.e`获取嵌套的对象属性值
      // 遇到空值会返回空 
      console.log(v.get('path.id', false));
      // if (query) {
      //   throw new ParamException('error!', 10001);
      // }
      ctx.body = 'V1 classsic';
    });

    server.use(router.routes()).use(router.allowedMethods());

    await next();
  });
};
