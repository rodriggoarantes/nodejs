import * as firebase from 'firebase-admin';

import cityService from './CityService';

import City from '@app/models/City';
import { user } from 'firebase-functions/lib/providers/auth';

class CityPreferenceService {
  private db: any = null;

  private collection() {
    if (!this.db) {
      this.db = firebase.firestore();
    }
    return this.db.collection('preferences-cities');
  }

  async findByUser(userId: string): Promise<Array<City>> {
    const result = await this.collection()
      .where('userId', '==', userId)
      .get();

    const list = new Array();
    if (!result.empty) {
      result.forEach((element: any) => {
        const data = element.data();
        list.push(data.cityId);
      });
    }

    const cities: Array<City> = [];
    const promisses = list.map(async id => {
      const city: City = await cityService.findById(id);
      cities.push(city);
    });

    await Promise.all(promisses);

    return cities;
  }

  async store(cityId: string, userId: string): Promise<boolean> {
    const cities = await this.findByUser(userId);
    const exists = cities.map(city => city._id).includes(cityId);

    if (!exists) {
      const ref = this.collection().doc();
      ref.set({
        userId,
        cityId
      });

      return true;
    }
    return false;
  }

  async remove(cityId: string, userId: string) {
    const result = await this.collection()
      .where('userId', '==', userId)
      .where('cityId', '==', cityId)
      .get();

    if (!result.empty) {
      const batch = this.db.batch();
      result.forEach((doc: any) => {
        batch.delete(doc.ref);
      });
      await batch.commit();
    }
  }
}

export default new CityPreferenceService();
