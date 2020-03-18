import axios from 'axios';

import Weather from 'app/models/Weather';

class WeatherApiService {
  private readonly appID = process.env.WEATHER_API_KEY || '';
  private readonly apiURL = 'https://api.openweathermap.org/data/2.5';
  private readonly weatherURL = `${this.apiURL}/weather?APPID=${this.appID}`;
  private readonly forecastURL = `${this.apiURL}/forecast?APPID=${this.appID}`;

  async getWeather(
    city: string,
    metric: 'metric' | 'imperial' = 'metric'
  ): Promise<Weather> {
    const response = await axios.get(`${this.weatherURL}`, {
      params: {
        q: city,
        units: metric
      }
    });
    return this._mapOpenWeather(response.data);
  }

  async getForecast(
    city: string,
    metric: 'metric' | 'imperial' = 'metric'
  ): Promise<Weather> {
    const response = await axios.get(`${this.forecastURL}`, {
      params: {
        q: city,
        units: metric
      }
    });
    return this._mapOpenWeather(response.data);
  }

  private _mapOpenWeather(openWeatherItem: any): Weather {
    let weather: Weather = <Weather>{};
    if (openWeatherItem) {
      weather = <Weather>{
        city: openWeatherItem.name,
        state:
          openWeatherItem.weather && openWeatherItem.weather[0]
            ? openWeatherItem.weather[0].main
            : 'Clear',
        temp: openWeatherItem.main.temp,
        min: openWeatherItem.main.temp_min,
        max: openWeatherItem.main.temp_max,
        pressure: openWeatherItem.main.pressure,
        humidity: openWeatherItem.main.humidity,
        dt: openWeatherItem.dt
      };
    }
    return weather;
  }
}
export default new WeatherApiService();
