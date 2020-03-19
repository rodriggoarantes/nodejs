import Forecast from './Forecast';

interface Weather {
  _id?: string;
  city: string;
  city_id: string;
  state: string;
  temp: number;
  min: number;
  max: number;
  dt: Date;
  forecasts?: Array<Forecast>;
}

export default Weather;
