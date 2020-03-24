import axios from 'axios';
import { format } from 'date-fns';

import Weather from './../models/Weather';
import Forecast from './../models/Forecast';

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
    cityName: string,
    count: number = 40,
    metric: 'metric' | 'imperial' = 'metric'
  ): Promise<Array<Forecast>> {
    const listForecasts: Array<Forecast> = [];
    try {
      const response = await axios.get(`${this.forecastURL}`, {
        params: {
          q: cityName,
          units: metric,
          cnt: count
        }
      });

      if (response.data) {
        const { list, city } = response.data;
        if (list && list.length) {
          for (let item of list) {
            item.name = city.name;
            listForecasts.push(this._mapOpenForecast(item));
          }
        }
      }
    } catch (error) {
      console.log(
        `Previsao do Tempo nao econtrada para cidade ${cityName} :: ${error}`
      );
    }
    return listForecasts;
  }

  private _mapOpenWeather(openWeatherItem: any): Weather {
    let weather: Weather = <Weather>{};
    if (openWeatherItem) {
      const dataIso = parseInt(
        String(openWeatherItem.dt)
          .padEnd(13, '1')
          .substring(0, 13),
        10
      );
      weather = <Weather>{
        city: openWeatherItem.name,
        state:
          openWeatherItem.weather && openWeatherItem.weather[0]
            ? openWeatherItem.weather[0].main
            : 'Clear',
        temp: openWeatherItem.main.temp,
        min: openWeatherItem.main.temp_min,
        max: openWeatherItem.main.temp_max,
        dt: dataIso
      };
    }
    return weather;
  }

  private _mapOpenForecast(item: any): Forecast {
    let forecast: Forecast = <Forecast>{};
    if (item) {
      const dataIso = parseInt(
        String(item.dt)
          .padEnd(13, '1')
          .substring(0, 13),
        10
      );
      const date_txt = format(new Date(dataIso), 'yyyy-MM-dd');
      forecast = <Forecast>{
        city: item.name,
        state: item.weather && item.weather[0] ? item.weather[0].main : 'Clear',
        temp: Math.round(item.main.temp * 100) / 100,
        min: item.main.temp_min,
        max: item.main.temp_max,
        pressure: item.main.pressure,
        humidity: item.main.humidity,
        wind_speed: item.wind.speed,
        date_txt,
        dt: dataIso
      };
    }
    return forecast;
  }
}
export default new WeatherApiService();
