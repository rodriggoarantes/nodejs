interface Forecast {
  _id: string;
  city: string;
  city_id: string;
  dt: number;
  date_txt?: string;
  state: string;
  temp: number;
  min: number;
  max: number;
  pressure: number;
  humidity: number;
  wind_speed: number;
}

export default Forecast;
