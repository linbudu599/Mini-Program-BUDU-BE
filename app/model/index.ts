import { Sequelize, Model } from 'sequelize';
import config from '../../config';
import secretConfig from '../../config/secret.config';
import { unset, cloneDeep, isArray } from 'lodash';
const { DEV_DB, PROD_DB } = config;
const { HOST } = secretConfig;
const dbUrl = process.env.NODE_ENV === 'development' ? DEV_DB : PROD_DB;

// 在这里定义的配置会适用于所有使用该实例创建的表
// 如果需要针对表进行个性化配置，需要在.define中使用
const sequelize = new Sequelize(dbUrl, {
  dialect: 'mysql',
  timezone: '+08:00',
  logging: console.log,
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

Model.prototype.toJSON = function() {
  // @ts-ignore
  let data = cloneDeep(this.dataValues);
  unset(data, 'updated_at');
  unset(data, 'created_at');
  unset(data, 'deleted_at');

  for (let key in data) {
    if (key === 'image') {
      if (!data[key].startsWith('http')) {
        data[key] = `${secretConfig.HOST}/${data[key]}`;
      }
    }
  }

  // @ts-ignore
  if (isArray(this.exclude)) {
    // @ts-ignore
    this.exclude.forEach((prop: string) => {
      unset(data, prop);
    });
  }

  return data;
};

export default sequelize;
