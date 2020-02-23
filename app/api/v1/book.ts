import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import Koa, { DefaultState, DefaultContext, Next, Context } from 'koa';
import Auth from '../../middleware/auth';
import { HotBook } from '../../model/Hot-Book';
import { Book } from '../../model/Book';
import { Favor } from '../../model/Favor';
import { successHandler } from '../../helper';
import { Comment } from '../../model/Comment';
import { PIntegerValidator, SearchValidator, AddShortCommentValidator } from '../../validator';

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

    router.get('/:id/detail', new Auth().m, async (ctx: Context) => {
      const v = await new PIntegerValidator().validate(ctx);
      const book = new Book(v.get('path.id'));
      ctx.body = await book.detail();
    });

    router.get('/search', new Auth().m, async (ctx: Context) => {
      const v = await new SearchValidator().validate(ctx);

      const detail = await Book.searchFromServer(
        v.get('query.q'),
        v.get('query.start'),
        v.get('query.count'),
      );

      ctx.body = { detail };
    });

    router.get('/favor/count', new Auth().m, async (ctx: Context) => {
      const count = await Book.getMyFavorBookCount(ctx.auth.uid);

      ctx.body = { count };
    });

    router.get('/:book_id/favor', new Auth().m, async (ctx: Context) => {
      const v = await new PIntegerValidator().validate(ctx, { id: 'book_id' });

      const detail = await Favor.getBookFavor(ctx.auth.uid, v.get('path.book_id'));
      ctx.body = { ...detail };
    });

    router.get('/add/short_comment', new Auth().m, async (ctx: Context) => {
      const v = await new AddShortCommentValidator().validate(ctx, { id: 'book_id' });

      await Comment.addComment(v.get('body.book_id'), v.get('body.content'));

      successHandler();
    });

    router.get('/:book_id/short_comment', new Auth().m, async (ctx: Context) => {
      const v = await new PIntegerValidator().validate(ctx, { id: 'book_id' });

      const res = await Comment.getComment(v.get('path.id'));

      ctx.body = { res };
    });

    router.get('/hot_keyword', async (ctx: Context) => {
      ctx.body = {
        hot: ['Python', '哈利·波特', '金庸', '村上春树', '东野圭吾', '韩寒', '白夜行'],
      };
    });

    server.use(router.routes()).use(router.allowedMethods());

    await next();
  });
};
