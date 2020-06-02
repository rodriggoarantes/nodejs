import { Secret } from 'jsonwebtoken';

export default <Secret>{
  key: process.env.APP_SECRET
};
