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

  async list(): Promise<Array<Spot>> {
    const result = await this.getRef().get();
    if (!result.empty) {
      const listaDevs: Array<Spot> = new Array();
      result.forEach((element: any) => {
        listaDevs.push({ _id: element.id, ...element.data() });
      });
      return listaDevs;
    }
    return [];
  }
}

export default new SpotService();
