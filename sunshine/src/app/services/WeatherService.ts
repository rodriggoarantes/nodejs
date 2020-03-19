import * as firebase from 'firebase-admin';

import City from 'app/models/City';
import Weather from 'app/models/Weather';

import weatherApi from 'app/services/WeatherApiService';

class WeatherService {
  private db: any = null;

  private collection() {
    if (!this.db) {
      this.db = firebase.firestore();
    }
    return this.db.collection('weathers');
  }

  async weatherByCity(city: City): Promise<Weather> {
    try {
      const weather: Weather = await weatherApi.getWeather(city.name);

      // TODO obter os dados do primeiro forecast e persistir os forecasts
      const weatherEntity = <Weather>{
        ...weather,
        city: city.name,
        city_id: city._id
      };
      this.store(weatherEntity);

      return weatherEntity;
    } catch (error) {
      throw 'Erro ao buscar cidades por nome';
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

  private async store(weather: Weather) {
    const ref = this.collection().doc();
    ref.set({
      _id: ref.id,
      ...weather
    });
  }
}

export default new WeatherService();
