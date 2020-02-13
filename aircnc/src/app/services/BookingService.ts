import * as firebase from 'firebase-admin';

import { Booking } from '@app/models/Booking';

class BookingService {
  private firestoreDb: any = null;

  private getRef() {
    if (!this.firestoreDb) {
      this.firestoreDb = firebase.firestore();
    }
    return this.firestoreDb.collection('bookings');
  }

  async store(obj: Booking): Promise<Booking> {
    const doc = await this.getRef().doc();
    await doc.set(obj);
    return { _id: doc.id, ...obj };
  }

  async fromUser(user: string): Promise<Array<Booking>> {
    if (!user) throw 'Usuário não informado';

    const spots = this.getRef().where('user', '==', user);
    const result = await spots.get();
    return this.parseResult(result);
  }

  async list(userId: string, spotId: string): Promise<Array<Booking>> {
    let listBooking = this.getRef();

    if (userId) {
      listBooking = listBooking.where('user', '==', userId);
    }
    if (spotId) {
      listBooking = listBooking.where('spotId', '==', spotId);
    }

    const result = await listBooking.get();
    return this.parseResult(result);
  }

  private parseResult(result: any): Array<Booking> {
    if (result && !result.empty) {
      const lista: Array<Booking> = new Array();
      result.forEach((element: any) => {
        const { date, approved, user, spot } = element.data();
        lista.push(<Booking>{
          _id: element.id,
          date,
          approved,
          user,
          spot
        });
      });
      return lista;
    }
    return [];
  }
}

export default new BookingService();
