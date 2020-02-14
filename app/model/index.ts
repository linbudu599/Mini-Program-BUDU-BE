import { Sequelize } from 'sequelize';
import config from '../../config/config';
const { DEV_DB, PROD_DB } = config;
const dbUrl = process.env.NODE_ENV === 'development' ? DEV_DB : PROD_DB;

// 在这里定义的配置会适用于所有使用该实例创建的表
// 如果需要针对表进行个性化配置，需要在.define中使用
const sequelize = new Sequelize(dbUrl, {
  dialect: 'mysql',
  timezone: '+08:00',
  logging: console.log,
  // logging-options:
  define: {
    timestamps: true,
    paranoid: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    underscored: true,
    freezeTableName: true,
    scopes: {
      bh: {
        attributes: {
          exclude: ['updated_at', 'deleted_at', 'created_at'],
        },
      },
    },
  },
});

export default sequelize;
