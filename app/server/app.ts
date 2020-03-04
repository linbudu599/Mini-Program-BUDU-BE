import Koa from 'koa';
import Router from 'koa-router';
import chalk from 'chalk';
import logger from 'koa-logger';

import CrossOrigin from '../middleware/cross-origin';
import { catchError } from '../middleware/exception';

import route from '../router';
import { classic } from '../api/v1/classic';
import { user } from '../api/v1/user';
import { token } from '../api/v1/token';
import { favor } from '../api/v1/like';
import { book } from '../api/v1/book';

import path from 'path';

const PORT = process.env.PORT || 8760;
const app = new Koa();
const router = new Router();

import koaStatic from 'koa-static';

app.use(koaStatic(path.join(__dirname, '../static')));
console.log(path.join(__dirname, '../static'));
app.use(catchError);
app.use(logger());
app.use(CrossOrigin);

route(app);
classic(app);
user(app);
token(app);
favor(app);
book(app);

app.use(router.routes()).use(router.allowedMethods());

app.listen(PORT, () => {
  console.log(chalk.green(`Server start at http://localhost:${PORT}`));
});
