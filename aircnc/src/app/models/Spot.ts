export interface Spot {
  _id?: string;
  name: string;
  thumbnail: string;
  company: string;
  price: number;
  techs: Array<string>;
  user: string;
}

export default Spot;
