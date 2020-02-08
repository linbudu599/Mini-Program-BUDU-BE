import Koa from 'koa';
import Router from 'koa-router';
import chalk from 'chalk';
import logger from 'koa-logger';

import CrossOrigin from '../app/middleware/cross-origin';
import { catchError } from '../app/middleware/exception';

import route from '../app/router';
import { classic } from '../app/api/v1/classic';

import config from '../config/config';

const PORT = process.env.PORT || 8888;
const app = new Koa();
const router = new Router();

app.use(catchError);
app.use(logger());
app.use(CrossOrigin);

router.get('/', async ctx => {
  ctx.body = 'Budu';
});

(global as any).config = config;

route(app);
classic(app);

app.use(router.routes()).use(router.allowedMethods());

app.listen(PORT, () => {
  console.log(chalk.green(`Server start at http://localhost:${PORT}`));
});
