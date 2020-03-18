export interface Weather {
  _id: string;
  city: string;
  city_id: string;
  state: string;
  temp: number;
  min: number;
  max: number;
  pressure: number;
  humidity: number;
  dt: Date;
}

export default Weather;
