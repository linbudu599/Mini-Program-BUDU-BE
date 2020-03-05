import { encryptor } from '../../../app/util/encryptor';

describe('Util: encryptor', () => {
  it('should encrypte pwd', () => {
    expect(!!encryptor('randomstring')).toBeTruthy();
  });
});
