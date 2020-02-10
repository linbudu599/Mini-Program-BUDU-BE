import Koa from 'koa';
import Router from 'koa-router';
import chalk from 'chalk';
import logger from 'koa-logger';

import CrossOrigin from '../app/middleware/cross-origin';
import { catchError } from '../app/middleware/exception';

import route from '../app/router';
import { classic } from '../app/api/v1/classic';
import { user } from '../app/api/v1/user';
import { token } from '../app/api/v1/token';

import config from '../config/config';

const PORT = process.env.PORT || 8760;
const app = new Koa();
const router = new Router();

// TODO: extract middleware config along

app.use(catchError);
app.use(logger());
app.use(CrossOrigin);

router.get('/', async ctx => {
  ctx.body = 'Budu';
});

(global as any).config = config;

// TODO: extract router config along

route(app);
classic(app);
user(app);
token(app);

app.use(router.routes()).use(router.allowedMethods());

app.listen(PORT, () => {
  console.log(chalk.green(`Server start at http://localhost:${PORT}`));
});
