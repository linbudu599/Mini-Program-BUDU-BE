import { DataTypes, Model, BuildOptions } from 'sequelize';
import bcrypt from 'bcryptjs';

import sequelize from './index';

interface MyModel extends Model {
  readonly id: number;
  readonly openid: number;
  readonly nickName: number;
  readonly email: number;
  readonly password: number;

  verifyEmailPwd(email: string, password: string): any;
}
type MyModelStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): MyModel;

};
const User = <MyModelStatic>sequelize.define(
  'user',
  {
    openid: {
      type: new DataTypes.STRING(64),
      unique: true,
    },
    id: {
      type: new DataTypes.INTEGER(),
      primaryKey: true,
      autoIncrement: true,
      comment: '自增id',
    },
    nickName: {
      type: new DataTypes.STRING(),
    },
    email: {
      type: new DataTypes.STRING(128),
      unique: true,
    },
    password: {
      type: new DataTypes.STRING(),
      set(val: string) {
        const salt = bcrypt.genSaltSync(10);
        const safePwd = bcrypt.hashSync(val, salt);
        // @ts-ignore
        this.setDataValue('password', safePwd);
      },
    },
  },
  {
    tableName: 'user',
  },
);

export default User;
