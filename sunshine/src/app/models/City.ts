export interface City {
  _id?: string;
  name: string;
  name_search: string;
  country_id: string;
  country: string;
  countryCode: string;
  latitude: number;
  longitude: number;
  region?: string;
}

export default City;
