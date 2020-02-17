import { Model, DataTypes } from 'sequelize';

import sequelize from './index';

class HotBook extends Model {
  index!: number;
  image!: string;
  author!: string;
  title!: string;
}

HotBook.init(
  {
    // 主要用于排序
    index: {
      type: new DataTypes.INTEGER(),
    },
    image: {
      type: new DataTypes.STRING(),
    },
    author: {
      type: new DataTypes.STRING(),
    },
    title: {
      type: new DataTypes.STRING(),
    },
  },
  {
    sequelize,
    tableName: 'hot_book',
  },
);

export default HotBook;
