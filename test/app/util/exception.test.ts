import { HttpException, ParamException, Success } from '../../../app/util/exception';

describe('Util: exceptiom', () => {
  it('should throw error whicn is an instance of Error', () => {
    expect(() => {
      throw new HttpException('Msg', 10007);
    }).toThrowError();
    expect(new HttpException('Msg', 10007)).toBeInstanceOf(Error);
  });

  it('should throw a ParamException error whicn is an instance of HttpException', () => {
    expect(() => {
      throw new ParamException('Msg', 10008);
    }).toThrowError();
    expect(new ParamException('Msg', 10008)).toBeInstanceOf(HttpException);
  });

  it('should throw a success whicn is an instance of HttpException', () => {
    expect(() => {
      throw new Success('Msg', 10009);
    }).toThrowError();
    expect(new Success('Msg', 10009)).toBeInstanceOf(HttpException);
  });
});
