export interface Country {
  name: string;
  capital: string;
  region: string;
  translations: Map<string, string>;
  flag: string;
}

export default Country;
