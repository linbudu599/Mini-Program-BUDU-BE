# Mini-Program-BE

> 小程序项目 服务端部分，前端部分已完成（未上线），地址：[Mini-Program-FE](https://github.com/linbudu599/Mini-Program-BUDU-FE)

## 基于

- Typescript
- Sequelize + MySQL2 驱动
- Koa2

## TODO

- [] 路由集中转发
- [] 重写校验器
- [] 精简冗余代码
- [] 单元测试
- [] 减少代码中的`any`
- [] 函数注释

## 目录结构

```text
| - app ----- 应用主题文件
  | - api ----- api路由
    | - v1 ----- v1版本API
  | - util ----- 工具函数，注意该目录下的validator.ts是校验器的父类
  | - middleware ----- 中间件，处理跨域、鉴权、全局错误处理
  | - model ----- Sequelize模型
  | - router ----- 路由配置
  | - service ----- 处理微信获取openId
  | - validator ----- 校验器，基于Lin-validator二次开发，添加了TS等支持
  | - server ----- 入口文件
| - config ----- 配置文件相关
| - static ----- 静态资源
| - test ----- 测试，目前仅有工具函数与校验器的单元测试

```

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
- 无感刷新 携带令牌访问 过期返回 403，前端重新获取令牌，带着新令牌再请求前面的接口。

- 双令牌 access_token refresh_token，用后者获取一个新的前者，在每次获取 access_token 的时候刷新 refresh_token。太长时间没使用就过期啦。
