import { Model, DataTypes } from 'sequelize';

import sequelize from './index';

class Flow extends Model {
  index!: number;
  art_id!: number;
  type!: number;
}

Flow.init(
  {
    index: {
      type: new DataTypes.INTEGER(),
    },
    art_id: {
      type: new DataTypes.INTEGER(),
    },
    // 100-movie 200-music 300-sentence
    // art_id + type 即可快速定位到唯一数据
    type: {
      type: new DataTypes.INTEGER(),
    },
  },
  {
    sequelize,
    tableName: 'flow',
  },
);

export default Flow;
