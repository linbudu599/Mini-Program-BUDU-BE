import { Sequelize, Model, DataTypes } from 'sequelize';
import sequelize from './index';

export class Comment extends Model {

  static async addComment(book_id: number, content: string) {
    const comment = await Comment.findOne({
      where: {
        book_id,
        content,
      },
    });
    if (!comment) {
      return Comment.create({
        book_id,
        content,
        nums: 1,
      });
    } else {
      return await comment.increment<any>('nums', { by: 1 });
    }
  }

  static async getComment(book_id: number) {
    const comments = await Comment.findAll({
      where: {
        book_id,
      },
    });

    return comments;
  }
}

// @ts-ignore
Comment.init(
  {
    content: {
      type: DataTypes.STRING(12),
    },
    nums: {
      type: DataTypes.INTEGER(),
      defaultValue: 0,
    },
    book_id: {
      type: DataTypes.INTEGER(),
    },
  },
  {
    sequelize,
    tableName: 'comment',
  },
);
