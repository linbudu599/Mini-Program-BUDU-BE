import { Movie, Sentence, Music } from '../model/Classic';
import { NotFound } from '../../util/types';
import { Favor } from './Favor';

class Art {
  art_id: number;
  type: number;
  constructor(art_id: number, type: number) {
    this.art_id = art_id;
    this.type = type;
  }

  static async getData(artId: number, type: number, useScope = true) {
    const condition = {
      where: {
        id: artId,
      },
    };
    let res = null;
    const scope = useScope ? 'bh' : null;
    switch (type) {
      case 100:
        res = await Movie.scope(scope as string).findOne(condition);
        break;
      case 200:
        res = await Music.scope(scope as string).findOne(condition);
        break;
      case 300:
        res = await Sentence.scope(scope as string).findOne(condition);
        break;

      default:
        break;
    }

    return res!;
  }

  async getDetail(uid: number) {
    const art = await Art.getData(this.art_id, this.type);
    console.log(this.art_id, this.type);
    console.log(art);
    if (!art) {
      throw new NotFound('没找到哦');
    }

    const like = await Favor.userLikeIt(this.art_id, this.type, uid);
    return {
      art,
      like_status: like,
    };
  }
}

export default Art;
