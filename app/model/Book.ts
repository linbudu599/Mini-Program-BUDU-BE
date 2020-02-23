import { Sequelize, Model, DataTypes } from 'sequelize';
import sequelize from './index';
import util from 'util';
import axios from 'axios';
import { Favor } from '../model/Favor';

export class Book extends Model {
  id: number;
  constructor(id: number) {
    super();
    this.id = id;
  }
  async detail() {
    const url = util.format('http://t.yushu.im/v2/book/id/%s', this.id);
    const detail = await axios.get(url);
    return detail.data;
  }

  static async searchFromServer(q: string, start: number, count: number, summary: number = 1) {
    const url = util.format(
      'http://t.yushu.im/v2/book/search?q=%s&count=%s&start=%s&summary=%s',
      encodeURI(q),
      count,
      start,
      summary,
    );
    const detail = await axios.get(url);
    return detail.data;
  }

  static async getMyFavorBookCount(uid: number) {
    const count = await Favor.count({
      where: {
        type: 400,
        uid,
      },
    });
    return count;
  }
}
// @ts-ignore
Book.init(
  {
    id: {
      type: DataTypes.INTEGER(),
      autoIncrement: false,
      primaryKey: true,
    },
    fav_nums: {
      type: DataTypes.INTEGER(),
      defaultValue: 0,
    },
  },
  {
    sequelize,
    tableName: 'name',
  },
);
