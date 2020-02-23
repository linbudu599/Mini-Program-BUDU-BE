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

function checkType({ body, path }: any) {
  let type = body.type || path.type;
  if (!type) {
    throw new Error('type must be specified');
  }
  type = parseInt(type);
  if (!(type in LoginType)) {
    throw new Error('illegal type argus');
  }
}

function checkArtType({ body, path }: any) {
  let type = body.type || path.type;
  if (!type) {
    throw new Error('type是必须参数');
  }
  type = parseInt(type);

  if (!(type in ArtType)) {
    throw new Error('type参数不合法');
  }
}

export enum ArtType {
  MOVIE = 100,
  MUSIC = 200,
  SENTENCE = 300,
  BOOK = 400,
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

export class LikeValidator extends PIntegerValidator {
  constructor() {
    super();
    this.validateType = checkArtType;
  }
}

export class ClassicValidator extends LikeValidator {
  constructor() {
    super();
  }
}

export class SearchValidator extends Validator {
  constructor() {
    super();
    this.q = [new Rule('isLength', '关键词不能为空', { min: 1, max: 16 })];
    // 不传要给默认值 传了要校验
    this.start = [
      new Rule('isInt', '不符规范 ', { min: 0, max: 6000 }),
      new Rule('optional', '', 0),
    ];
    this.count = [
      new Rule('isInt', '不符规范 ', { min: 1, max: 20 }),
      new Rule('optional', '', 20),
    ];
  }
}
