export interface Country {
  _id?: string;
  name: string;
  capital: string;
  region: string;
  translations: Map<string, string>;
  flag: string;
}

export default Country;
