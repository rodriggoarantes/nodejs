import * as firebase from 'firebase-admin';
import axios from 'axios';

import utilService from './UtilService';

import City from 'app/models/City';

class CityService {
  private readonly api: string =
    'http://geodb-free-service.wirefreethought.com/v1/geo/cities?languageCode=pt&limit=5&sort=name';

  private db: any = null;

  private collection() {
    if (!this.db) {
      this.db = firebase.firestore();
    }
    return this.db.collection('cities');
  }

  async list(): Promise<Array<City>> {
    return await this.listLocal();
  }

  async findByName(filter: string): Promise<Array<City>> {
    try {
      const listLocal = await this.searchLocal(filter);

      if (listLocal && listLocal.length) {
        return listLocal;
      } else {
        const response = await axios.get(`${this.api}`, {
          params: {
            namePrefix: filter
          }
        });

        let list: Array<City> = [];
        if (response.data) {
          const geoData = response.data.data;
          list = geoData.map(
            (item: any) =>
              <City>{
                name: item.name,
                country: item.country,
                countryCode: item.countryCode,
                latitude: item.latitude,
                longitude: item.longitude,
                region: item.region
              }
          );
          this.store(list);
        }
        return list;
      }
    } catch (error) {
      throw 'Erro ao buscar cidades por nome';
    }
  }

  private async store(cities: Array<City>) {
    console.log('cadastrando-cidades');
    cities.forEach(item => {
      // TODO buscar pais existente
      const ref = this.collection().doc();
      ref.set({
        _id: ref.id,
        ...item,
        name_search: utilService.normalizeValue(item.name)
      });
    });
  }

  private async searchLocal(filter: string): Promise<Array<City>> {
    const normalizeFilter = utilService.normalizeValue(filter);
    const result = await this.collection()
      .orderBy('name_search')
      .startAt(normalizeFilter)
      .endAt(`${normalizeFilter}\uf8ff`)
      .get();
    if (!result.empty) {
      const list: Array<City> = new Array();
      result.forEach((element: any) => {
        list.push(element.data());
      });
      return list;
    }
    return [];
  }

  private async listLocal(): Promise<Array<City>> {
    const result = await this.collection()
      .orderBy('name', 'asc')
      .get();
    if (!result.empty) {
      const list: Array<City> = new Array();
      result.forEach((element: any) => {
        list.push(element.data());
      });
      return list;
    }
    return [];
  }
}

export default new CityService();
