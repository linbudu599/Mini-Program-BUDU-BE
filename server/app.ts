import Koa from 'koa';
import Router from 'koa-router';
import chalk from 'chalk';

import route from '../router';

const PORT = process.env.PORT || 8888;

const app = new Koa();

const router = new Router();

app.use(async (ctx, next) => {
  ctx.set('Access-Control-All  ow-Origin', '*');
  ctx.set(
    'Access-Control-Allow-Headers',
    'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild',
  );
  ctx.set('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  if (ctx.method == 'OPTIONS') {
    ctx.body = 200;
  } else {
    await next();
  }
});

router.get('/', async ctx => {
  ctx.body = 'Budu';
});

route(app);

app.use(router.routes()).use(router.allowedMethods());

app.listen(PORT, () => {
  console.log(chalk.green(`Server start at http://localhost:${PORT}`));
});
