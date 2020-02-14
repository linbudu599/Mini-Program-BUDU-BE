import { Sequelize, Model, DataTypes, BuildOptions } from 'sequelize';

import bcrypt from 'bcryptjs';

import { AuthorizationFailure } from '../../util/types';

import sequelize from './index';

class User extends Model {
  id!: number;
  openid!: number;
  nickname!: number;
  email!: number;
  password!: string;

  // public createdAt!: Date;
  // public updatedAt!: Date;

  public static async validateEmail(email: string, pwd: string): Promise<User> | never {
    const user = await User.findOne({
      where: { email },
    });
    if (!user) {
      throw new AuthorizationFailure('用户不存在！', 10000);
    }

    const correct: boolean = bcrypt.compareSync(pwd, user.password);
    if (!correct) {
      throw new AuthorizationFailure('密码不正确嗷', 10004);
    }

    return user;
  }

  public static async findByOpenID(openid: string): Promise<null | User> {
    const user = await User.findOne({
      where: { openid },
    });
    return user;
  }

  public static async registerByOpenID(openid: string): Promise<User> {
    const user = await User.create(
      {
        openid,
      },
      {
        benchmark: true,
      },
    );
    return user;
  }
}

User.init(
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
    nickname: {
      type: new DataTypes.STRING(),
      // allowNull: false,
    },
    email: {
      type: new DataTypes.STRING(128),
      unique: true,
      // allowNull: false,
    },
    password: {
      type: new DataTypes.STRING(),
      // allowNull: false,
      set: function(val: string) {
        const salt = bcrypt.genSaltSync(10);
        const safePwd = bcrypt.hashSync(val, salt);
        try {
          // @ts-ignore
          this.setDataValue('password', safePwd);
        } catch (error) {
          console.log(error);
        }
      },
    },
  },
  {
    tableName: 'user',
    sequelize: sequelize,
  },
);

// User.findOrCreate({ where: { nickName: 'sdepold', password: '234234' } }).then(
//   ([user, created]) => {
//     console.log(
//       user.get({
//         plain: true,
//       }),
//     );
//     console.log(created);
//   },
// );

export default User;

// interface MyModel extends Model {
//    id: number;
//    openid: number;
//    nickName: number;
//    email: number;
//    password: number;

//   verifyEmailPwd(email: string, password: string): any;
// }
// type MyModelStatic = typeof Model & {
//   new (values?: object, options?: BuildOptions): MyModel;

// };
// const User = <MyModelStatic>sequelize.define(
//   'user',
//   {
//     openid: {
//       type: new DataTypes.STRING(64),
//       unique: true,
//     },
//     id: {
//       type: new DataTypes.INTEGER(),
//       primaryKey: true,
//       autoIncrement: true,
//       comment: '自增id',
//     },
//     nickName: {
//       type: new DataTypes.STRING(),
//     },
//     email: {
//       type: new DataTypes.STRING(128),
//       unique: true,
//     },
//     password: {
//       type: new DataTypes.STRING(),
//       set(val: string) {
//         const salt = bcrypt.genSaltSync(10);
//         const safePwd = bcrypt.hashSync(val, salt);
//         // @ts-ignore
//         this.setDataValue('password', safePwd);
//       },
//     },
//   },
//   {
//     tableName: 'user',
//   },
// );
