import { Validator, Rule } from '../../util/validator';
import { Context } from 'koa';
import { ParamException } from '../../util/types';

import User from '../model/User';

// 正整数校验
export class PIntegerValidator extends Validator {
  public constructor() {
    super();
    this.id = [
      new Rule('isInt', '需要是正整数', {
        min: 1,
      }),
    ];
  }
}

export class RegisterValidator extends Validator {
  public constructor() {
    super();
    this.email = [new Rule('isEmail', '无效邮箱')];
    this.pwd = [
      new Rule('isLength', '密码应当为6~32位', { min: 6, max: 32 }),

      new Rule('matches', '无效密码', '^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]'),
    ];
    this.confirmPwd = this.pwd;
    this.nickName = [new Rule('isLength', '昵称长度4~32', { min: 4, max: 32 })];
  }

  public validateSamePwd(vals: Context) {
    const {
      body: { pwd, confirmPwd },
    } = vals;

    if (pwd !== confirmPwd) {
      throw new Error('两次密码不同');
    }
  }

  public async validateEmail(vals: Context) {
    const { email } = vals.body;
    const res = await User.findOne({
      where: {
        email,
      },
    });
    if (res) {
      throw new Error('Email 已存在');
    }
  }
}

export enum LoginType {
  MINI_PROGRAM = 100,
  EMAIL,
  MOBILE,
  ADMIN = 200,
}

export class TokenValidator extends Validator {
  constructor() {
    super();
    this.account = [
      new Rule('isLength', '不符合帐号规则', {
        min: 4,
        max: 32,
      }),
    ];
    this.secret = [
      new Rule('optional'),
      new Rule('isLength', '长度不符，应为6~128', { min: 6, max: 128 }),
    ];
  }

  // type 账号密码登陆/小程序内部登录
  validateLoginType({ body: { type } }: Context) {
    if (!type) {
      throw new Error('type must be specified');
    }
    if (!(type in LoginType)) {
      throw new Error('illegal type argus');
    }
  }
}

export class EmptyValidator extends Validator {
  constructor() {
    super();
    this.token = [new Rule('isLength', '不可为空', { min: 1 })];
  }
}
