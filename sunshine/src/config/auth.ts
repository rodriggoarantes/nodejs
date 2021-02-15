import { Secret } from 'jsonwebtoken';

class Auth {
  secret: string;
  expireIn: string;

  constructor() {
    this.secret = process.env.APP_SECRET || '';
    this.expireIn = '8h';
  }
}

export default new Auth();
