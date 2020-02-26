# Mini-Program-BUDU-BE

> 小程序项目 服务端部分，前端部分已完成（未上线），地址：[Mini-Program-BUDU-FE](https://github.com/linbudu599/Mini-Program-BUDU-FE)

## 基于

- Typescript
- Sequelize + MySQL2 驱动
- Koa

## Bug

- [x] Sequelize 报错 `Cannot read property 'hooks' of undefined`，关闭 `User.sync({force: true})`
- [x] `Class constructor Model cannot be invoked without 'new'`，在`tsconfig.json`中将编译目标设置为`es6`
- 不要把 Model 作为构造函数
- dataValues 不会受到 set 影响

## 学习

- 业务表与实体表的规划
- 避免循环查询，使用 in 查询
- 数据库事务，保证成批的处理要么全部执行，要么都不执行，保证一致性
- ACID，原子&一致&隔离持久
- 专门整一个业务相关无数据的 Model，封装静态方法，比如根据 art_id 与 type 确定一条唯一数据。
- 自动&无感刷新令牌，

## 开发中

- 在 router 中做 api 版本转发？还是干脆就不要 router？

- 先把逻辑写在 `/api`目录 下，完事了再考虑重构吧

- 自己实现一个简易的 import 版本的`require-directory`，学习写法，抽离到单独文件中，用 `process.cwd()` blabla...

- 实现简易版的 `LinValidator`?

- 无感刷新 携带令牌访问 过期返回 403，前端重新获取令牌，带着新令牌再请求前面的接口。

- 双令牌 access_token refresh_token，用后者获取一个新的前者，在每次获取 access_token 的时候刷新 refresh_token。太长时间没使用就过期啦。
