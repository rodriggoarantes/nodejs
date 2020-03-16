export interface City {
  _id?: string;
  name: string;
  name_search: string;
  country_id: string;
  country: string;
  countryCode: string;
  region: string;
  latitude: number;
  longitude: number;
}

export default City;
