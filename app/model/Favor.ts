import { Model, DataTypes } from 'sequelize';
import { LikeError, DislikeError } from '../../util/types';
import ArtSearcher from '../model/Art';
import sequelize from './index';

export class Favor extends Model {
  art_id!: number;
  type!: number;
  uid!: number;

  static async like(art_id: number, type: number, uid: number): Promise<any> {
    const res = await Favor.findOne({
      where: { art_id, type, uid },
    });

    if (res) {
      throw new LikeError('已经点过赞啦', 60001);
    }

    return sequelize.transaction(async (t: any) => {
      await Favor.create(
        {
          art_id,
          type,
          uid,
        },
        { transaction: t },
      );
      const res = await ArtSearcher.getData(art_id, type);
      // @ts-ignore
      await res.increment('fav_nums', { by: 1, transaction: t });
    });
  }
  static async disLike(art_id: number, type: number, uid: number): Promise<any> {}
}

Favor.init(
  {
    uid: new DataTypes.INTEGER(),
    art_id: new DataTypes.INTEGER(),
    type: new DataTypes.INTEGER(),
  },
  {
    sequelize,
    tableName: 'favor',
  },
);
