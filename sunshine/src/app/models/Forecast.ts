interface Forecast {
  _id: string;
  city: string;
  city_id: string;
  dt: number;
  state: string;
  temp: number;
  min: number;
  max: number;
  pressure: number;
  humidity: number;
  wind_speed: number;
}

export default Forecast;
