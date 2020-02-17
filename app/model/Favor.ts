import { Model, DataTypes,Op } from 'sequelize';
import { LikeError, DislikeError,NotFound } from '../../util/types';
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
      const res = await ArtSearcher.getData(art_id, type, false);
      // @ts-ignore
      await res.increment('fav_nums', { by: 1, transaction: t });
    });
  }
 
  static async disLike(art_id: number, type: number, uid: number): Promise<any> {
    const record = await Favor.findOne({
      where: { art_id, type, uid },
    });

    if (!record) {
      throw new DislikeError('已经取消过赞啦', 60002);
    }

    return sequelize.transaction(async (t: any) => {
      await record.destroy({
        force: false,
        transaction: t,
      });
      const res = await ArtSearcher.getData(art_id, type, false);
      // @ts-ignore
      await res.decrement('fav_nums', { by: 1, transaction: t });
    });
  }

  static async userLikeIt(art_id: number, type: number, uid: number): Promise<any> {
    const favor = await Favor.findOne({
      where: {
        uid,
        art_id,
        type,
      },
    });
    return favor ? true : false;
  }

  static async getMyClassicFavors(uid:number) {
    const arts = await Favor.findAll({
        where: {
            uid,
            type:{
                [Op.not]:400,
            }
        }
    })
    if(!arts){
        throw new NotFound("没找到耶")
    }
   
    return await ArtSearcher.getList(arts)
}

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
