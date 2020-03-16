export interface Country {
  _id?: string;
  name: string;
  name_search: string;
  capital: string;
  region: string;
  translations: Map<string, string>;
  flag: string;
  code: string;
}

export default Country;
