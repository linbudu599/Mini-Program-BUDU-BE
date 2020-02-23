import { Model, DataTypes, Op, Sequelize } from 'sequelize';
import { Favor } from './Favor';
import sequelize from './index';

export class HotBook extends Model {
  index!: number;
  image!: string;
  author!: string;
  title!: string;

  static async getAll() {
    const books = await HotBook.findAll({
      order: ['index'],
    });

    const ids: number[] = [];

    books.forEach(({ id }: any) => {
      ids.push(id);
    });

    const favors = await Favor.findAll({
      where: {
        art_id: {
          [Op.in]: ids,
          type: 400,
        },
      },
      group: ['art_id'],
      attributes: ['art_id', [Sequelize.fn('COUNT', '*'), 'count']],
    });

    books.forEach(book => {
      HotBook.getEachBookStatus(book, favors);
    });

    return books;
  }

  static getEachBookStatus(book: any, favors: any[]) {
    let count: number = 0;
    favors.forEach(favor => {
      if (book.id === favor.art_id) {
        count = favor.get('count');
      }
    });

    book.setDataValue('count', count);
  }
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