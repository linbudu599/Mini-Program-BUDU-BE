import Koa, { Context } from 'koa';
import Router from 'koa-router';
import chalk from 'chalk';
import logger from 'koa-logger';

import CrossOrigin from '../app/middleware/cross-origin';
import { catchError } from '../app/middleware/exception';

import route from '../app/router';
import { classic } from '../app/api/v1/classic';
import { user } from '../app/api/v1/user';
import { token } from '../app/api/v1/token';
import { favor } from '../app/api/v1/like';

import config from '../config/config';
import fs from 'fs';
// import dotenv from 'dotenv';

import path from 'path';

// FIXME: error in inject env var
// dotenv.config({ path: path.resolve(__dirname, '../.env') });
const PORT = process.env.PORT || 8760;
const app = new Koa();
const router = new Router();

import koaStatic from 'koa-static';

// TODO: extract middleware config along

app.use(koaStatic(path.resolve(__dirname, '../build')));
console.log(path.resolve(__dirname, '../build'));
app.use(catchError);
app.use(logger());
app.use(CrossOrigin);

const index = path.resolve(__dirname, '../build', 'index.html');
router.get('/', async (ctx: any) => {
  const test = await new Promise((resolve, reject) => {
    fs.readFile(index, 'utf8', (err, data) => {
      if (err) ctx.throw(err);
      resolve(data.toString());
    });
  });
  ctx.type = 'html';
  ctx.body = test;
});

// (global as any).config = config;

// TODO: extract router config along

route(app);
classic(app);
user(app);
token(app);
favor(app);

app.use(router.routes()).use(router.allowedMethods());

app.listen(PORT, () => {
  console.log(chalk.green(`Server start at http://localhost:${PORT}`));
});
