import Koa, { DefaultState, DefaultContext, Next, Context } from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import generateToken from '../../../util/jwt';
import { TokenValidator, LoginType } from '../../validator';
import { ParamException } from '../../../util/types';
import { Auth } from '../../middleware/auth';
import User from '../../model/User';

const router = new Router({
  prefix: '/v1/token',
});

router.use(bodyParser());

export const token = (server: Koa<DefaultState, DefaultContext>) => {
  server.use(async (ctx: Context, next: Next) => {
    router.post('/', async (ctx: Context) => {
      const v = new TokenValidator();
      await v.validate(ctx);

      let token;

      switch (v.get('body.type')) {
        case LoginType.EMAIL:
          token = await loginByEmail(v.get('body.account'), v.get('body.secret'));
          break;
        case LoginType.MINI_PROGRAM:
          break;
        case LoginType.MOBILE:
          break;
        case LoginType.ADMIN:
          break;
        default:
          throw new ParamException('请查看type是否正确~', 9090);
      }

      ctx.body = { token };
    });

    server.use(router.routes()).use(router.allowedMethods());

    await next();
  });
};

async function loginByEmail(account: string, secret: string) {
  console.log(account, secret);
  const res = await User.validateEmail(account, secret);
  // 普通用户登陆，权限8
  return generateToken(res.id, Auth.COMMON);
}
