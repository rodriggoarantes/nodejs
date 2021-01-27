import * as firebase from 'firebase-admin';
import axios from 'axios';

import countryService from './CountryService';
import utilService from './UtilService';

import City from '@app/models/City';
import Country from '@app/models/Country';

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
    console.log(`findByName: ${filter}`);
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
          console.log(`findByName -> geoData: ${geoData.length}`);
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
          await this.store(list);
        }
        return list;
      }
    } catch (error) {
      throw 'Erro ao buscar cidades por nome';
    }
  }

  async findById(id: string): Promise<City> {
    console.log(`byId: ${id}`);
    const refDoc = this.collection().doc(id);
    const result = await refDoc.get();

    if (result && result.exists) {
      const objData: City = result.data();
      return <City>{ _id: result.id, ...objData };
    }
    return <City>{};
  }

  async random(): Promise<City> {
    console.log(`city:random`);
    let city: City = <City>{};

    let hasResult = false;
    do {
      let country = await countryService.random();
      let cities: Array<City> = await this.findByName(country.capital);

      console.log(`city: ${country.capital} | founded: ${cities.length}`);

      hasResult =
        country && country.capital.length > 0 && cities && cities.length > 0;
      if (hasResult) {
        city = cities[0];
      }
    } while (!hasResult);

    return city;
  }

  private async store(list: Array<City>) {
    for (let item of list) {
      if (item.countryCode) {
        const country: Country = await countryService.findByCode(
          item.countryCode
        );
        if (country && country._id) {
          item.country_id = country._id;
        }
      }

      const ref = await this.collection().doc();
      item._id = ref.id;

      ref.set({
        ...item,
        name_search: utilService.normalizeValue(item.name)
      });
    }
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
