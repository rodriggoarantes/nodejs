import * as firebase from 'firebase-admin';

import User from '@app/models/User';

class UserService {
  private firestoreDb: any = null;

  private getRef() {
    if (!this.firestoreDb) {
      this.firestoreDb = firebase.firestore();
    }
    return this.firestoreDb.collection('users');
  }

  async findById(id: string) {
    const refDoc = this.getRef().doc(id);
    const result = await refDoc.get();

    // TODO
  }

  async findByName(name: string): Promise<User> {
    const ref = this.getRef();
    const findQuery = ref.where('name', '==', name).limit(1);
    const result = await findQuery.get();
    if (result && !result.empty && result.docs[0] && result.docs[0].data()) {
      const doc = result.docs[0];
      return <User>{ _id: doc.id, ...doc.data() };
    }
    return <User>{};
  }

  async findByEmail(email: string): Promise<User> {
    if (!email) throw 'E-mail do usuário deve ser informado';

    const ref = this.getRef();
    const findQuery = ref.where('email', '==', email).limit(1);
    const result = await findQuery.get();
    if (result && !result.empty && result.docs[0] && result.docs[0].data()) {
      const doc = result.docs[0];
      return { id: doc.id, ...doc.data() };
    }
    return <User>{};
  }

  async store(user: User): Promise<User> {
    const doc = await this.getRef().doc();
    await doc.set(user);
    return { _id: doc.id, ...user };
  }

  async list(): Promise<Array<User>> {
    const result = await this.getRef().get();
    if (!result.empty) {
      const listaDevs: Array<User> = new Array();
      result.forEach((element: any) => {
        listaDevs.push({ _id: element.id, ...element.data() });
      });
      return listaDevs;
    }
    return [];
  }
}

export default new UserService();
