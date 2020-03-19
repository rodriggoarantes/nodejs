import axios from 'axios';

import Weather from 'app/models/Weather';
import Forecast from 'app/models/Forecast';

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

    const weather = this._mapOpenWeather(response.data);
    weather.forecasts = await this.getForecast(weather.city);
    return weather;
  }

  async getForecast(
    city: string,
    metric: 'metric' | 'imperial' = 'metric'
  ): Promise<Array<Forecast>> {
    const response = await axios.get(`${this.forecastURL}`, {
      params: {
        q: city,
        units: metric
      }
    });

    const listForecasts: Array<Forecast> = [];
    if (response.data) {
      const { list, city } = response.data;
      if (list) {
        list.array.forEach((item: any) => {
          item.name = city;
          listForecasts.push(this._mapOpenForecast(response.data));
        });
      }
    }
    return listForecasts;
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
        dt: openWeatherItem.dt
      };
    }
    return weather;
  }

  private _mapOpenForecast(item: any): Forecast {
    let forecast: Forecast = <Forecast>{};
    if (item) {
      const dataIso = parseInt(item.dt.padEnd(13, '1').substring(0, 13), 10);
      forecast = <Forecast>{
        city: item.name,
        state: item.weather && item.weather[0] ? item.weather[0].main : 'Clear',
        temp: item.main.temp,
        min: item.main.temp_min,
        max: item.main.temp_max,
        pressure: item.main.pressure,
        humidity: item.main.humidity,
        wind_speed: item.wind.speed,
        dt: dataIso
      };
    }
    return forecast;
  }
}
export default new WeatherApiService();
