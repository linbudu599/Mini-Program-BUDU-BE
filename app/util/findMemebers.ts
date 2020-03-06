import { Validator } from './validator';

export const findMembers = (
  instance: Validator,
  { prefix, specifiedType, filter }: { [x: string]: Function },
) => {
  // 递归函数
  const find = (instance: any): any => {
    //基线条件（跳出递归）
    if (instance.__proto__ === null) return [];

    let names = Reflect.ownKeys(instance);
    names = names.filter(name => {
      // 过滤掉不满足条件的属性或方法名
      return shouldKeep(name);
    });

    return [...names, ...find(instance.__proto__)];
  };

  const shouldKeep = (value: any) => {
    if (filter) {
      if (filter(value)) {
        return true;
      }
    }
    if (prefix) if (value.startsWith(prefix)) return true;
    if (specifiedType) if (instance[value] instanceof specifiedType) return true;
  };

  return find(instance);
};
