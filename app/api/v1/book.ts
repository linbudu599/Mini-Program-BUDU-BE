import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import Koa, { DefaultState, DefaultContext, Next, Context } from 'koa';
import Auth from '../../middleware/auth';
import { HotBook } from '../../model/Hot-Book';
import { Book } from '../../model/Book';
import { PIntegerValidator } from '../../validator';

const router = new Router({
  prefix: '/v1/book',
});

router.use(bodyParser());

// 图书的基础数据是另外一个API，公用性API

export const book = (server: Koa<DefaultState, DefaultContext>) => {
  server.use(async (ctx, next) => {
    // like
    const books = await HotBook.getAll();

    router.get('/hot_list', new Auth().m, async (ctx: Context) => {
      ctx.body = {
        books,
      };
    });

    router.get(': id/detail', new Auth().m, async (ctx: Context) => {
      const v = await new PIntegerValidator().validate(ctx);
      const book = new Book(v.get('path.id'));
      ctx.body = await book.detail();
    });

    server.use(router.routes()).use(router.allowedMethods());

    await next();
  });
};
