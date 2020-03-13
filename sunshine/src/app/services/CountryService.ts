import axios from 'axios';
import Country from 'app/models/Country';

class CountryService {
  private countryApi: string = 'https://restcountries.eu/rest/v2';

  async list(): Promise<Array<Country>> {
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
            translations: item.translations
          }
      );
    }
    return list;
  }
}

export default new CountryService();
