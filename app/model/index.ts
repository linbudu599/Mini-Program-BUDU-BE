import { Sequelize, DataTypes, Model, BuildOptions } from 'sequelize';
import config from '../../config/config';
const { DEV_DB, PROD_DB } = config;
const dbUrl = process.env.NODE_ENV === 'development' ? DEV_DB : PROD_DB;

// 在这里定义的配置会适用于所有使用该实例创建的表
// 如果需要针对表进行个性化配置，需要在.define中使用
const sequelize = new Sequelize(dbUrl, {
  dialect: 'mssql',
  timezone: '+08:00',
  logging: true,
  define: {
    timestamps: true,
    paranoid: true,
    freezeTableName: false,
    createdAt: true,
    updatedAt: 'updateTimestamp',
    deletedAt: 'destroyTime',
    charset: 'utf8',
  },
});

export default sequelize;
