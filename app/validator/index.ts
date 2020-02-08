import { Validator, Rule } from '../../util/validator';

// 正整数
export class PIntegerValidator extends Validator {
  constructor() {
    super();
    this.id = [
      new Rule('isInt', '需要是正整数', {
        min: 1,
      }),
    ];
  }
}
