// @ts-nocheck
import { Movie, Sentence, Music } from '../model/Classic';
import { NotFound } from '../../util/types';
import { Op } from 'sequelize';
import { Book } from './Book';
import { Favor } from './Favor';
import { flatten } from 'lodash';

class Art {
  [x: string]: any;
  art_id: number;
  type: number;
  constructor(art_id: number, type: number) {
    this.art_id = art_id;
    this.type = type;
  }

  static async getData(artId: number, type: number, useScope?: boolean = true) {
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
      case 400:
        res = await Book.scope(scope as string).findOne(condition);
        if (!res) {
          res = await Book.create({ id: art_id });
        }
        break;

      default:
        break;
    }
    return res!;
  }

  async getDetail(uid: number) {
    const art = await Art.getData(this.art_id, this.type);
    if (!art) {
      throw new NotFound('没找到哦');
    }

    const like = await Favor.userLikeIt(this.art_id, this.type, uid);
    return {
      art,
      like_status: like,
    };
  }

  // 查询集合！
  static async getList(artInfoList: Favor[]) {
    const artInfoObj = {
      100: [],
      200: [],
      300: [],
    };
    for (let artInfo of artInfoList) {
      artInfoObj[artInfo.type].push(artInfo.art_id);
    }
    const arts = [];
    for (let key in artInfoObj) {
      const ids = artInfoObj[key];
      if (ids.length === 0) {
        continue;
      }

      // 由于做了键名会被转为字符串
      key = parseInt(key);
      arts.push(await Art.getListByType(ids, key));
    }
    // [[],[],[]]
    return flatten(arts);
  }

  /**
   *
   *
   * @static
   * @param {number[]} ids
   * @param {number} type
   * @returns
   * @memberof Art
   */
  static async getListByType(ids: number[], type: number) {
    let arts = [];
    const finder = {
      where: {
        id: {
          [Op.in]: ids,
        },
      },
    };
    const scope = 'bh';
    switch (type) {
      case 100:
        arts = await Movie.scope(scope as string).findAll(finder);
        break;
      case 200:
        arts = await Music.scope(scope as string).findAll(finder);
        break;
      case 300:
        arts = await Sentence.scope(scope as string).findAll(finder);
      case 400:
        break;
      default:
        break;
    }
    return arts;
  }
}

export default Art;
