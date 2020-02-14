import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import { LikeValidator } from '../../validator';
import Koa, { DefaultState, DefaultContext, Next, Context } from 'koa';
import Auth from '../../middleware/auth';
import Flow from '../../model/Flow';
import ArtSearcher from '../../model/Art';
import { successHandler } from '../../helper';
import { Favor } from '../../model/Favor';
import { ParamException } from '../../../util/types';

const router = new Router({
  prefix: '/v1/like',
});

router.use(bodyParser());

export const favor = (server: Koa<DefaultState, DefaultContext>) => {
  server.use(async (ctx, next) => {
    router.post('/', new Auth().m, async (ctx: Context) => {
      const v = await new LikeValidator().validate(ctx, { id: 'art_id' });
      // uid可伪造  不允许被显示传递
      Favor.like(v.get('body.art_id'), v.get('body.type'), ctx.auth.uid);
    });

    server.use(router.routes()).use(router.allowedMethods());

    await next();
  });
};
