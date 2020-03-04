import validator from 'validator';
import { Context } from 'koa';
import { ParamException } from './exception';
import { get, last, set, cloneDeep } from 'lodash';
import { findMembers } from './findMemebers';

// FIXME: refractor by generics

export class Validator {
  [prop: string]: any;
  constructor() {
    this.data = {};
    this.parsed = {};
  }

  private assembleAllParams({ request: { header, query, body }, params }: Context): any {
    return {
      body,
      query,
      path: params,
      header,
    };
  }

  public get(path: string, parsed: boolean = true): any {
    if (parsed) {
      // 获取解析对象的值
      const value = get(this.parsed, path, null);
      if (value === null) {
        const keys = path.split('.');
        const key = last(keys);
        return get(this.parsed.default, key!);
      }
      return value;
    } else {
      return get(this.data, path);
    }
  }

  private findMembersFilter(key: string): boolean {
    if (/validate([A-Z])\w+/g.test(key)) {
      return true;
    }
    if (this[key] instanceof Array) {
      this[key].forEach((value: any) => {
        if (!(value instanceof Rule)) {
          throw new Error('验证数组必须全部为Rule类型');
        }
      });
      return true;
    }
    return false;
  }

  public async validate(ctx: Context, alias = {}) {
    this.alias = alias;
    let params = this.assembleAllParams(ctx);

    this.data = cloneDeep(params);
    this.parsed = cloneDeep(params);

    const memberKeys = findMembers(this, {
      filter: this.findMembersFilter.bind(this),
    });

    const errorMsgs = [];
    for (let key of memberKeys) {
      const result = await this.check(key, alias);
      if (!result.success) {
        errorMsgs.push(result.msg);
      }
    }
    if (errorMsgs.length != 0) {
      throw new ParamException((errorMsgs as unknown) as string);
    }
    ctx.v = this;
    return this;
  }

  private async check(key: string, alias = {}) {
    const isCustomFunc = typeof this[key] == 'function' ? true : false;
    let result;
    if (isCustomFunc) {
      try {
        await this[key](this.data);
        result = new RuleResult(true);
      } catch (error) {
        result = new RuleResult(false, error.msg || error.message || '参数错误');
      }
      // 函数验证
    } else {
      // 属性验证, 数组，内有一组Rule
      const rules = this[key];
      const ruleField = new RuleField(rules);
      // 别名替换
      // @ts-ignore
      key = alias[key] ? alias[key] : key;
      const param = this.findParam(key);

      result = ruleField.validate(param.value);

      if (result.pass) {
        // 如果参数路径不存在，往往是因为用户传了空值，而又设置了默认值
        if (param.path.length === 0) {
          set(this.parsed, ['default', key], result.legalValue);
        } else {
          set(this.parsed, param.path, result.legalValue);
        }
      }
    }
    if (!result.pass) {
      const msg = `${isCustomFunc ? '' : key}${result.msg}`;
      return {
        msg,
        success: false,
      };
    }
    return {
      msg: 'ok',
      success: true,
    };
  }

  private findParam(key: any) {
    let value;
    value = get(this.data, ['query', key]);
    if (value) {
      return {
        value,
        path: ['query', key],
      };
    }
    value = get(this.data, ['body', key]);
    if (value) {
      return {
        value,
        path: ['body', key],
      };
    }
    value = get(this.data, ['path', key]);
    if (value) {
      return {
        value,
        path: ['path', key],
      };
    }
    value = get(this.data, ['header', key]);
    if (value) {
      return {
        value,
        path: ['header', key],
      };
    }
    return {
      value: null,
      path: [],
    };
  }
}

class RuleResult {
  [x: string]: any;
  constructor(pass: any, msg = '') {
    Object.assign(this, {
      pass,
      msg,
    });
  }
}

class RuleFieldResult extends RuleResult {
  [x: string]: null;
  constructor(pass: boolean, msg: string = '', legalValue = null) {
    super(pass, msg);
    this.legalValue = legalValue;
  }
}

export class Rule {
  [x: string]: any;
  constructor(name: string, msg?: string, ...params: any) {
    Object.assign(this, {
      name,
      msg,
      params,
    });
  }

  validate(field: Context) {
    // 对于可选参数不校验
    if (this.name === 'optional') return new RuleResult(true);
    // @ts-ignore
    if (!validator[this.name](field + '', ...this.params)) {
      return new RuleResult(false, this.msg || this.message || '参数错误');
    }
    return new RuleResult(true, '');
  }
}

class RuleField {
  [x: string]: any;
  constructor(rules: any) {
    this.rules = rules;
  }

  validate(field: any) {
    if (field == null) {
      // 如果字段为空
      const allowEmpty = this.allowEmpty();
      const defaultValue = this.hasDefault();
      if (allowEmpty) {
        return new RuleFieldResult(true, '', defaultValue);
      } else {
        return new RuleFieldResult(false, '字段是必填参数');
      }
    }

    const filedResult = new RuleFieldResult(false);
    for (let rule of this.rules) {
      let result = rule.validate(field);
      if (!result.pass) {
        filedResult.msg = result.msg;
        filedResult.legalValue = null;
        // 一旦一条校验规则不通过，则立即终止这个字段的验证
        return filedResult;
      }
    }
    return new RuleFieldResult(true, '', this.convert(field));
  }

  private convert(value: any) {
    for (let rule of this.rules) {
      if (rule.name == 'isInt') {
        return parseInt(value);
      }
      if (rule.name == 'isFloat') {
        return parseFloat(value);
      }
      if (rule.name == 'isBoolean') {
        return value ? true : false;
      }
    }
    return value;
  }

  private allowEmpty() {
    for (let rule of this.rules) {
      if (rule.name == 'optional') {
        return true;
      }
    }
    return false;
  }

  private hasDefault() {
    for (let rule of this.rules) {
      const defaultValue = rule.params[0];
      if (rule.name == 'optional') {
        return defaultValue;
      }
    }
  }
}
