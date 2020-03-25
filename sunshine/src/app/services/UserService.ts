import * as firebase from 'firebase-admin';
import * as jwt from 'jsonwebtoken';
import * as crypto from 'crypto';

import UtilService from './UtilService';

import auth from '@config/auth';
import User from '@app/models/User';
import UserToken from '@app/models/UserToken';

class UserService {
  private db: any = null;

  private collection() {
    if (!this.db) {
      this.db = firebase.firestore();
    }
    return this.db.collection('users');
  }

  async list(): Promise<Array<User>> {
    const result = await this.collection()
      .orderBy('name', 'asc')
      .get();
    const list: Array<User> = new Array();
    if (!result.empty) {
      result.forEach((element: any) => {
        const u: User = element.data();
        delete u.pass;
        list.push(u);
      });
    }
    return list;
  }

  async find({ name = '', email = '' }): Promise<User> {
    let ref = this.collection();
    if (name && name.length) {
      ref = ref.where('name_search', '==', UtilService.normalizeValue(name));
    }
    if (email && email.length) {
      ref = ref.where('email', '==', email);
    }
    const result = await ref.limit(1).get();
    let user: User = <User>{};
    if (!result.empty) {
      result.forEach((element: any) => {
        user = element.data();
        delete user.pass;
        return;
      });
    }
    return user;
  }

  async store(user: User): Promise<User> {
    const passhash = crypto
      .createHash('md5')
      .update(user.pass || '')
      .digest('hex');

    delete user.pass;
    delete user.confirmPass;

    const ref = this.collection().doc();
    user._id = ref.id;
    ref.set({
      ...user,
      pass: passhash,
      name_search: UtilService.normalizeValue(user.name)
    });
    return user;
  }

  async login(user: User): Promise<UserToken> {
    const result = await this.collection()
      .where('email', user.email)
      .where('pass', user.pass || '')
      .limit(1)
      .get();

    let userToken: UserToken = <UserToken>{};
    if (!result.empty) {
      result.forEach((element: any) => {
        const user: User = element.data();
        userToken.id = user._id || '';
        userToken.name = user.name;
        userToken.email = user.email;
        return;
      });

      userToken.token = jwt.sign(
        { id: userToken.id, name: userToken.name },
        auth.secret,
        {
          expiresIn: auth.expireIn
        }
      );
    }
    return userToken;
  }
}

export default new UserService();
