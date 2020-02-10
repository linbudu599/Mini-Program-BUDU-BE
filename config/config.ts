export default {
  ENV: 'dev',
  DEV_DB: 'mysql://root:111@localhost:3306/database',
  PROD_DB: 'mysql://root:111@localhost:3306/database',
  // 仅做测试  后续会删除
  security: {
    secretKey: 'aaaa',
    expiresIn: 60 * 60,
  },
};
