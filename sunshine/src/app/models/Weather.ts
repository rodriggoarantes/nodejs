interface Weather {
  _id?: string;
  city: string;
  city_id: string;
  city_picture?: any;
  country: string;
  state: string;
  temp: number;
  min: number;
  max: number;
  dt: number;
}

export default Weather;
