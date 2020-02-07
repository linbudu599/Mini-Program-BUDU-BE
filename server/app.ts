import Koa from 'koa';
import Router from 'koa-router';
import chalk from 'chalk';

import logger from 'koa-logger';

// import { handler } from '../middleware/error';
import CrossOrigin from '../middleware/cross-origin';
import { catchError } from '../middleware/exception';

import route from '../router';

import { classic } from '../api/v1/classic';

const PORT = process.env.PORT || 8888;

const app = new Koa();
const router = new Router();

app.use(catchError);

app.use(logger());

app.use(CrossOrigin);
// app.use(handler);

router.get('/', async ctx => {
  ctx.body = 'Budu';
});

route(app);
classic(app);

app.use(router.routes()).use(router.allowedMethods());

app.listen(PORT, () => {
  console.log(chalk.green(`Server start at http://localhost:${PORT}`));
});
