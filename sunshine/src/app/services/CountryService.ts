import * as firebase from 'firebase-admin';
import axios from 'axios';

import Country from '@app/models/Country';

import UtilService from './UtilService';

class CountryService {
  private readonly countryApi: string = 'https://restcountries.eu/rest/v2';

  private db: any = null;

  private collection() {
    if (!this.db) {
      this.db = firebase.firestore();
    }
    return this.db.collection('countries');
  }

  async list(): Promise<Array<Country>> {
    let list: Array<Country> = [];
    list = await this.listCache();

    if (list.length === 0) {
      list = await this.search();
      this.store(list);
    }
    return list;
  }

  async random(): Promise<Country> {
    const list: Array<Country> = await this.listCache();
    const tamanho = list.length;
    let randomItem = <Country>{};
    if (tamanho) {
      const random = Math.random();
      const floored = Math.floor(random * tamanho);
      randomItem = list[floored];
    }
    return randomItem;
  }

  async findByCode(code: string): Promise<Country> {
    const result = await this.collection()
      .where('code', '==', code.toUpperCase())
      .limit(1)
      .get();

    let country = <Country>{};
    if (!result.empty) {
      result.forEach((element: any) => {
        country = { ...country, ...element.data() };
      });
    }
    return country;
  }

  private async store(countries: Array<Country>) {
    countries.forEach(item => {
      const ref = this.collection().doc();
      ref.set({
        _id: ref.id,
        ...item,
        name_search: UtilService.normalizeValue(item.name)
      });
    });
  }

  private async search(): Promise<Array<Country>> {
    const response = await axios.get(`${this.countryApi}/all`);

    let list: Array<Country> = [];
    if (response.data && response.data.length > 0) {
      list = response.data.map(
        (item: any) =>
          <Country>{
            name: item.name,
            capital: item.capital,
            flag: item.flag,
            region: item.region,
            translations: item.translations,
            code: item.alpha2Code
          }
      );
    }
    return list;
  }

  private async listCache(): Promise<Array<Country>> {
    const result = await this.collection()
      .orderBy('name', 'asc')
      .get();
    if (!result.empty) {
      const list: Array<Country> = new Array();
      result.forEach((element: any) => {
        list.push(element.data());
      });
      return list;
    }
    return [];
  }
}

export default new CountryService();
