import util from 'util';
import axios from 'axios';
import User from '../model/User';
import config from '../../config/secret.config';
import { Auth } from '../middleware/auth';
import { AuthorizationFailure } from '../util/exception';
import generateToken from '../util/jwt';
const { APP_ID, APP_SECRET, VALIDATE_URL } = config;

class WXManager {
  static async code2Token(code: string) {
    const url = util.format(VALIDATE_URL, APP_ID, APP_SECRET, code);
    const res = await axios.get(url);

    const {
      status,
      data: { errcode },
    } = res;

    if (status !== 200) {
      throw new AuthorizationFailure('openId获取失败', 8080);
    }

    if (errcode) {
      throw new AuthorizationFailure(`openId获取失败，${errcode}`);
    }

    const { openid, session_key } = res.data;

    let user = await User.findByOpenID(openid);

    if (!user) {
      user = await User.registerByOpenID(openid);
    }
    return generateToken(user.id, Auth.MINI_PROGRAM);
  }
}

export default WXManager;
