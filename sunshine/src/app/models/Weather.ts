interface Weather {
  _id?: string;
  city: string;
  city_id: string;
  state: string;
  temp: number;
  min: number;
  max: number;
  dt: number;
}

export default Weather;
