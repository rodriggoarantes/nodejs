import * as firebase from 'firebase-admin';

import City from 'app/models/City';
import Weather from 'app/models/Weather';
import Forecast from 'app/models/Forecast';

import weatherApi from './WeatherApiService';

class WeatherService {
  private db: any = null;

  private ref() {
    if (!this.db) {
      this.db = firebase.firestore();
    }
    return this.db;
  }
  private collection() {
    return this.ref().collection('weathers');
  }

  async weatherByCity(city: City): Promise<Weather> {
    try {
      if (city && city._id) {
        const cached: Weather = await this.findById(city._id);
        if (cached) {
          // TODO calcular diferença entre as datas
        }
      }

      const obj: Weather = await weatherApi.getWeather(city.name);

      console.log(`WEATHER: ${JSON.stringify(obj)}`);

      const actualyForecast = await weatherApi.getForecast(obj.city, 1);

      if (actualyForecast && actualyForecast.length) {
        const first = actualyForecast[0];
        obj.temp = first.temp;
        obj.state = first.state;
        obj.max = first.max;
        obj.min = first.min;
        console.log(`FORECAST: ${JSON.stringify(first)}`);
      }

      const weatherEntity = <Weather>{
        temp: obj.temp,
        state: obj.state,
        max: obj.max,
        min: obj.min,
        dt: obj.dt,
        city: city.name,
        city_id: city._id
      };
      this.store(weatherEntity);

      return weatherEntity;
    } catch (error) {
      throw `Erro ao buscar cidades por nome [${error}]`;
    }
  }

  async listByCity(cityId: string): Promise<Array<Weather>> {
    const result = await this.collection()
      .where('city_id', '==', cityId)
      .orderBy('city_id')
      .orderBy('dt')
      .get();
    if (!result.empty) {
      const list: Array<Weather> = new Array();
      result.forEach((element: any) => {
        list.push(element.data());
      });
      return list;
    }
    return [];
  }

  private async findById(id: string): Promise<Weather> {
    const refDoc = this.collection().doc(id);
    const result = await refDoc.get();

    if (result && result.exists) {
      const objData: Weather = result.data();
      return <Weather>{ _id: result.id, ...objData };
    }
    return <Weather>{};
  }

  private async store(weather: Weather) {
    const ref = this.collection().doc();
    ref.set({
      _id: ref.id,
      ...weather
    });
  }

  private async storeForecast(city: City, forecasts: Array<Forecast>) {
    if (forecasts && forecasts.length) {
      const collection = this.ref().collection('forecasts');
      forecasts.forEach(forecast => {
        const ref = collection.doc();
        ref.set({
          _id: ref.id,
          city: city.name,
          city_id: city._id,
          ...forecast
        });
      });
    }
  }
}

export default new WeatherService();
