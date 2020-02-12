import * as firebase from 'firebase-admin';

import Spot from '@app/models/Spot';

class SpotService {
  private firestoreDb: any = null;

  private getRef() {
    if (!this.firestoreDb) {
      this.firestoreDb = firebase.firestore();
    }
    return this.firestoreDb.collection('spots');
  }

  async store(obj: Spot): Promise<Spot> {
    const doc = await this.getRef().doc();
    await doc.set(obj);
    return { _id: doc.id, ...obj };
  }

  async fromUser(user: string): Promise<Array<Spot>> {
    if (!user) throw 'Usuário não informado';

    const spots = this.getRef().where('user', '==', user);
    const result = await spots.get();
    return this.parseResult(result);
  }

  async list(name: string, tech: string): Promise<Array<Spot>> {
    let spots = this.getRef();

    if (name) {
      spots = spots.where('name_search', '==', name.toUpperCase());
    }
    if (tech) {
      spots = spots.where('techs_search', 'array-contains', tech.toUpperCase());
    }

    const result = await spots.get();
    return this.parseResult(result);
  }

  private parseResult(result: any): Array<Spot> {
    if (result && !result.empty) {
      const listaSpots: Array<Spot> = new Array();
      result.forEach((element: any) => {
        const { company, name, user, techs, price, thumbnail } = element.data();
        listaSpots.push({
          _id: element.id,
          company,
          name,
          user,
          techs,
          price,
          thumbnail
        });
      });
      return listaSpots;
    }
    return [];
  }
}

export default new SpotService();
