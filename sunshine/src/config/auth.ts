import { Secret } from 'jsonwebtoken';

class Auth {
  secret: Secret;
  expireIn: string = '8h';

  constructor() {
    this.secret = <Secret>{
      key: process.env.APP_SECRET
    };
  }
}

export default new Auth();
