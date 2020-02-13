import { Sequelize, Model, DataTypes, BuildOptions } from 'sequelize';

import sequelize from './index';

const publicFields = {
  image: new DataTypes.STRING(),
  content: new DataTypes.STRING(),
  pubdate: new DataTypes.DATEONLY(),
  fav_nums: new DataTypes.INTEGER(),
  title: new DataTypes.STRING(),
  type: new DataTypes.TINYINT(),
};

export class Movie extends Model {
  image!: string;
  content!: string;
  pubdate!: Date;
  fav_nums!: number;
  title!: string;
  type!: number;

  public createdAt!: Date;
  public updatedAt!: Date;
}

Movie.init(publicFields, {
  sequelize,
  tableName: 'movie',
});

export class Sentence extends Model {}

Sentence.init(publicFields, {
  sequelize,
  tableName: 'sentence',
});

export class Music extends Model {}

Music.init(
  Object.assign({}, publicFields, {
    url: new DataTypes.STRING(),
  }),
  {
    sequelize,
    tableName: 'music',
  },
);
