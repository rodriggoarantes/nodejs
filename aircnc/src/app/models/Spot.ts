import User from './User';

export interface Spot {
  _id?: string;
  name: string;
  thumbnail: string;
  company: string;
  price: number;
  techs: Array<string>;
  user: User;
}

export default Spot;
