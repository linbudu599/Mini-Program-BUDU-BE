import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import { PIntegerValidator } from '../../validator';
import Koa, { DefaultState, DefaultContext, Next, Context } from 'koa';
import Auth from '../../middleware/auth';
import Flow from '../../model/Flow';
import ArtSearcher from '../../model/Art';
import { ParamException } from '../../../util/types';

const router = new Router({
  prefix: '/v1/classic',
});

router.use(bodyParser());

export const classic = (server: Koa<DefaultState, DefaultContext>) => {
  server.use(async (ctx, next) => {
    // TODO: Extract Router And API
    router.get('/latest', new Auth().m, async (ctx: Context) => {
      // 先排序 再取最后一条

      // const flow = await User.findAll({});

      const flow = (await Flow.findOne({
        order: [['index', 'DESC']],
      })) as Flow;

      const detail = await ArtSearcher.getData(flow.art_id, flow.type);
      // FIXME: ？？
      // @ts-ignore
      detail.setDataValue('index', flow.index);
      ctx.body = detail;
    });

    router.post('/v1/:id/classic', async (ctx: Context) => {
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
