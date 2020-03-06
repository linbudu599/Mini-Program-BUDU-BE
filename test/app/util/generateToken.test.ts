import generateToken from '../../../app/util/generateToken';

describe('Util: generateToken', () => {
  it('should generate token by SECURITY', () => {
    expect(!!generateToken(123, 6)).toBeTruthy();
  });
});
