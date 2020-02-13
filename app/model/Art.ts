import { Movie, Sentence, Music } from '../model/Classic';

class Art {
  static async getData(artId: number, type: number) {
    const condition = {
      where: {
        id: artId,
      },
    };
    let res = null;
    switch (type) {
      case 100:
        res = await Movie.findOne(condition);
        break;

      case 200:
        res = await Music.findOne(condition);
        break;

      case 300:
        res = await Sentence.findOne(condition);
        break;

      case 400:
        res = await Movie.findOne(condition);
        break;

      default:
        break;
    }

    // FIXME: should assert ?
    return res!;
  }
}

export default Art;
