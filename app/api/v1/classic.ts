import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import { ClassicValidator, PIntegerValidator } from '../../validator';
import Koa, { DefaultState, DefaultContext, Next, Context } from 'koa';
import Auth from '../../middleware/auth';
import Flow from '../../model/Flow';
import ArtSearcher from '../../model/Art';
import { Favor } from '../../model/Favor';
import { ParamException, NotFound } from '../../util/exception';

const router = new Router({
  prefix: '/v1/classic',
});

router.use(bodyParser());

export const classic = (server: Koa<DefaultState, DefaultContext>) => {
  server.use(async (ctx, next) => {
    // TODO: Extract Router And API
    // 获取最新一期
    router.get('/latest', new Auth().m, async (ctx: Context) => {
      // 降序下第一条
      const flow = (await Flow.findOne({
        order: [['index', 'DESC']],
      })) as Flow;

      const detail = await ArtSearcher.getData(flow.art_id, flow.type);

      const likeLatest = await Favor.userLikeIt(flow.art_id, flow.type, ctx.auth.uid);
      // 在实例上添加数据的方式
      // @ts-ignore
      detail.setDataValue('index', flow.index);
      // @ts-ignore
      detail.setDataValue('like_status', likeLatest);
      ctx.body = detail;
    });

    router.get('/:type/:id', new Auth().m, async (ctx: Context) => {
      const v = await new ClassicValidator().validate(ctx);
      const id = v.get('path.id');
      const type = parseInt(v.get('path.type'));
      const artDetail = await new ArtSearcher(id, type).getDetail(ctx.auth.uid);

      // @ts-ignore
      artDetail.art.setDataValue('like_status', artDetail.like_status);
      ctx.body = artDetail.art;
    });

    // 获取下一期，通过index
    router.get('/:index/next', new Auth().m, async ctx => {
      const v = await new PIntegerValidator().validate(ctx, {
        id: 'index',
      });
      const index = v.get('path.index');
      const flow = await Flow.findOne({
        where: {
          index: index + 1,
        },
      });
      if (!flow) {
        throw new NotFound('没找到啊呜呜呜');
      }
      const detail = await ArtSearcher.getData(flow.art_id, flow.type);
      const likeNext = await Favor.userLikeIt(flow.art_id, flow.type, ctx.auth.uid);
      // @ts-ignore
      detail.setDataValue('index', flow.index);
      // @ts-ignore
      detail.setDataValue('like_status', likeNext);
      ctx.body = detail;
    });

    // 获取上一期
    router.get('/:index/previous', new Auth().m, async ctx => {
      const v = await new PIntegerValidator().validate(ctx, {
        id: 'index',
      });
      const index = v.get('path.index');
      const flow = await Flow.findOne({
        where: {
          index: index - 1,
        },
      });
      if (!flow) {
        throw new NotFound('没找到啊呜呜呜');
      }
      const detail = await ArtSearcher.getData(flow.art_id, flow.type);
      const likeNext = await Favor.userLikeIt(flow.art_id, flow.type, ctx.auth.uid);
      // @ts-ignore
      detail.setDataValue('index', flow.index);
      // @ts-ignore
      detail.setDataValue('like_status', likeNext);
      ctx.body = detail;
    });

    // 获取用户点赞期刊
    router.get('/favor', new Auth().m, async ctx => {
      const uid = ctx.auth.uid;
      ctx.body = await Favor.getMyClassicFavors(uid);
    });

    router.get('/:type/:id/favor', new Auth().m, async ctx => {
      const v = await new ClassicValidator().validate(ctx);
      const id = v.get('path.id');
      const type = parseInt(v.get('path.type'));
      console.log(id);
      const detail = await new ArtSearcher(id, type).getDetail(ctx.auth.uid);

      ctx.body = {
        // @ts-ignore
        fav_nums: detail.art.fav_nums,
        like_status: detail.like_status,
      };
    });

    // 期刊点赞情况
    // router.post('/v1/:id/classic', async (ctx: Context) => {
    //   const {
    //     params,
    //     request,
    //     request: { body, header, query },
    //   } = ctx;

    //   const v = new PIntegerValidator();

    //   v.validate(ctx);
    //   // 会自动根据入参类型做转换
    //   // 加入false则不会进行转化
    //   // 由于内部使用了Lodash方法实现，还可以通过`a.b.c.d.e`获取嵌套的对象属性值
    //   // 遇到空值会返回空
    //   console.log(v.get('path.id', false));
    //   // if (query) {
    //   //   throw new ParamException('error!', 10001);
    //   // }
    //   ctx.body = 'V1 classsic';
    // });

    server.use(router.routes()).use(router.allowedMethods());

    await next();
  });
};
