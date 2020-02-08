import { DataTypes, Model, BuildOptions } from 'sequelize';
import sequelize from './index';

interface MyModel extends Model {
  readonly id: number;
  readonly firstName: number;
  readonly lastName: number;
}
type MyModelStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): MyModel;
};
const User = <MyModelStatic>sequelize.define(
  'user',
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      comment: '自增id',
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        // 自定义验证器
        customValidator(value: string) {
          if (value === null && this.age !== 10) {
            throw new Error("name can't be null unless age is 10");
          }
        },
        // 错误消息
        notNull: {
          msg: 'Please enter your name',
        },
      },
    },
  },
  {
    tableName: 'useeeeeeer',
  },
);

(async () => {
  await User.sync({ force: true });
  await User.create({
    firstName: 'John',
    lastName: 'Hancock',
  });
  await User.create({ firstName: 'Jane', lastName: 'Doe' }).then(jane => {
    console.log("Jane's auto-generated ID:", jane.id);
  });
  await User.findAll().then(users => {
    console.log('All users:', JSON.stringify(users));
  });
  await User.create({ firstName: 'fnord', lastName: 'omnomnom' })
    .then(() =>
      User.findOrCreate({
        where: { firstName: 'fnord' },
        defaults: { lastName: 'something else' },
      }),
    )
    .then(([user, created]) => {
      console.log(
        user.get({
          plain: true,
        }),
      );
      console.log(created); // false 因为已经有啦
    });

  await User.count().then(c => {
    console.log('There are ' + c + ' projects!');
  });

  await User.bulkCreate([
    { firstName: 'barfooz', lastName: true },
    { firstName: 'foo', lastName: true },
    { firstName: 'bar', lastName: false },
  ])
    .then(() => {
      return User.findAll();
    })
    .then(users => {
      console.log(users.length); // ... 以获取 user 对象的数组
    });
})();
