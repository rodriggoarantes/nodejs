import * as firebase from 'firebase-admin';

import { differenceInHours, format, getWeekOfMonth } from 'date-fns';

import City from '@app/models/City';
import Weather from '@app/models/Weather';
import Forecast from '@app/models/Forecast';
import Picture from '@app/models/Picture';

import weatherApi from './WeatherApiService';
import cityService from './CityService';
import pictureService from './PictureService';

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

  /**
   * Busca os registros de clima por cidade, verificando se já existe no banco de dados,
   * caso nao encontrado, ou o registro tiver mais de 3 horas, é feito uma nova busca.
   * @param city
   */
  async weatherByCity(city: City): Promise<Weather> {
    if (city && city._id) {
      const cached: Weather = await this.findByCity(city._id);
      if (cached._id) {
        const cachedDate = new Date(cached.dt);
        const nowDate = new Date();
        const difHours = differenceInHours(cachedDate, new Date());
        console.log(
          `Weather [cached] - Cached:Now :: ${format(
            cachedDate,
            'dd/MM/yyyy HH:mm'
          )} | ${format(nowDate, 'dd/MM/yyyy HH:mm')} | dif ${difHours}`
        );
        if (difHours >= 0) {
          return cached;
        }
      }
    } else {
      throw 'Cidade deve ser informada para busca';
    }

    try {
      const weather: Weather = await weatherApi.getWeather(city.name);
      console.log(`WEATHER: ${JSON.stringify(weather)}`);
      const actualyForecast = await weatherApi.getForecast(weather.city, 1);
      if (actualyForecast && actualyForecast.length) {
        const first = actualyForecast[0];
        weather.temp = first.temp;
        weather.max = first.max;
        weather.min = first.min;
        weather.dt = first.dt;
        console.log(`FORECAST: ${JSON.stringify(first)}`);
      }

      const weatherEntity = <Weather>{
        temp: weather.temp,
        state: weather.state,
        max: weather.max,
        min: weather.min,
        dt: weather.dt,
        city: city.name,
        city_id: city._id
      };
      this.store(weatherEntity);

      return weatherEntity;
    } catch (error) {
      throw `Erro ao buscar previsao do tempo por cidade [${error}]`;
    }
  }

  async weatherSuggested(): Promise<Weather> {
    console.log('weatherSuggested');
    const year = new Date().getFullYear();
    const month = new Date().getMonth();
    const week: number = getWeekOfMonth(new Date());

    const collection = this.ref().collection('suggested');
    const result = await collection
      .where('year', '==', year)
      .where('month', '==', month)
      .where('week', '==', week)
      .limit(1)
      .get();

    const cached: boolean = result && !result.empty;
    let picture: Picture = <Picture>{};
    let city: City = <City>{};
    if (cached) {
      result.forEach((element: any) => {
        const data = element.data();
        city._id = data.city_id;
        city.name = data.city_name;
        picture = data.picture;
        return;
      });
    } else {
      city = await cityService.random();
    }

    let weather: Weather = <Weather>{};
    if (city && city._id) {
      weather = await this.weatherByCity(city);
      if (!cached) {
        picture = await pictureService.getRandom(city.name);

        const ref = collection.doc();
        ref.set({
          _id: ref.id,
          city_id: city._id,
          city_name: city.name,
          year,
          month,
          week,
          picture
        });
      }
      weather.city_picture = picture;
    }

    return weather;
  }
  /**
   * Lista a previsao do tempo para as cidades já cadastradas no sistema (firebase)
   * @param cityId
   */
  private async findByCity(cityId: string): Promise<Weather> {
    if (!cityId || !cityId.length) {
      throw 'Identificador da cidade é obrigatorio';
    }

    const result = await this.collection()
      .where('city_id', '==', cityId)
      .where('dt', '>=', new Date().getTime())
      .orderBy('dt', 'asc')
      .limit(1)
      .get();

    let weather: Weather = <Weather>{};
    if (result && !result.empty) {
      result.forEach((element: any) => {
        weather = element.data();
      });
    }
    return weather;
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

  /**
   * Busca a lista de previsoes do tempo, nos proximos 5 dias.
   * Verifica se há registros ja cadastrados, senao busca novamente da api de
   * previsao do tempo.
   * @param city
   */
  async forecastByCity(city: City): Promise<Array<Forecast>> {
    if (city && city._id) {
      const cached: Array<Forecast> = await this.listForecastByCity(city._id);
      if (cached && cached.length == 5) {
        const lastForecast = cached[0];
        const difHours = differenceInHours(lastForecast.dt, new Date());
        console.log(`cached: : difHours : ${difHours} `);
        if (difHours <= 3) {
          return cached;
        }
      }
    } else {
      throw 'Cidade deve ser informada para busca';
    }

    try {
      // deleta os registros futuros para salvar uma versao mais atualizada
      this.deleteForecasts(city._id, new Date());
      // Busca as novas previsoes
      const list: Array<Forecast> = await weatherApi.getForecast(city.name);
      const datesMap: Map<string, Forecast> = new Map();

      for (let item of list) {
        const dataTxt = format(new Date(item.dt), 'yyyy-MM-dd');
        if (datesMap.has(dataTxt)) {
          const fore: Forecast = datesMap.get(dataTxt) || <Forecast>{};
          fore.counter = (fore.counter || 1) + 1;
          fore.temp += item.temp;
        } else {
          datesMap.set(dataTxt, item);
        }
      }

      const forecasts: Array<Forecast> = [];
      for (let item of datesMap.values()) {
        item.temp = Math.round((item.temp / (item.counter || 1)) * 100) / 100;
        item.city = city.name;
        item.city_id = city._id;
        delete item.counter;
        forecasts.push(item);
      }
      this.storeForecast(forecasts);

      return forecasts;
    } catch (error) {
      throw `Erro ao buscar previsoes do tempo por cidade [forecastByCity][${error}]`;
    }
  }

  /**
   * Armazena uma lista de previsoes do tempo por cidade.
   * @param city
   * @param forecasts
   */
  private async storeForecast(forecasts: Array<Forecast>) {
    if (forecasts && forecasts.length) {
      const collection = this.ref().collection('forecasts');
      forecasts.forEach(forecast => {
        const ref = collection.doc();
        forecast._id = ref.id;
        ref.set(forecast);
      });
    }
  }

  private async deleteForecasts(cityId: string, dateFrom: Date) {
    const collection = this.ref().collection('forecasts');
    const dateTime: number = dateFrom.getTime();
    const result = await collection
      .where('city_id', '==', cityId)
      .where('dt', '>=', dateTime)
      .get();

    if (!result.empty) {
      result.forEach((element: any) => {
        element.ref.delete();
      });
    }
  }

  /**
   * Lista as previsoes do tempo por cidade, podendo ter limitação na busca.
   * @param cityId - codigo da cidade cadastrado no sistema
   * @param limit - limite de resultados por dia para a mesma cidade
   */
  private async listForecastByCity(
    cityId: string,
    limit: number = 5
  ): Promise<Array<Forecast>> {
    if (cityId) {
      const collection = this.ref().collection('forecasts');
      const dateTime = new Date().getTime();
      const result = await collection
        .where('city_id', '==', cityId)
        .where('dt', '>=', dateTime)
        .orderBy('dt', 'asc')
        .limit(limit)
        .get();

      if (!result.empty) {
        const list: Array<Forecast> = new Array();
        result.forEach((element: any) => {
          list.push(element.data());
        });
        return list;
      }
    }
    return [];
  }
}

export default new WeatherService();
