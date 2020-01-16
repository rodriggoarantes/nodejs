import * as firebase from 'firebase-admin';
import {
  GeoCollectionReference,
  GeoFirestore,
  GeoQuery,
  GeoQuerySnapshot
} from 'geofirestore';
import Dev from '../models/Dev';
import Location from '../models/Location';
import User from '../models/User';

class DevService {
  private devsRefInstance: any = null;

  private getRef() {
    if (!this.devsRefInstance) {
      const db = firebase.firestore();
      this.devsRefInstance = db.collection('devs');
    }
    return this.devsRefInstance;
  }

  async findByUsername(username: string): Promise<Dev> {
    const findQuery = await this.getRef()
      .where('githubUsername', '==', username)
      .limit(1);
    const result = await findQuery.get();
    if (result && !result.empty && result.docs[0] && result.docs[0].data()) {
      return result.docs[0].data();
    }
    return <Dev>{};
  }

  save(
    user: User,
    techs: Array<string>,
    latitude: number,
    longitude: number
  ): Dev {
    const location: Location = new firebase.firestore.GeoPoint(
      latitude,
      longitude
    );

    const dev: Dev = {
      name: user.name,
      avatarUrl: user.avatarUrl,
      bio: user.description,
      techs,
      githubUsername: user.username,
      location
    };

    const ref = this.getRef().doc();
    ref.set(dev);

    return { id: ref.id, ...dev };
  }

  async list(): Promise<Array<Dev>> {
    const result = await this.getRef().get();
    if (!result.empty) {
      const listaDevs: Array<Dev> = new Array();
      result.forEach((element: any) => {
        listaDevs.push(element.data());
      });
      return listaDevs;
    }
    return [];
  }

  async search(
    latitude: number,
    longitude: number,
    techs: Array<string>
  ): Promise<Array<Dev>> {
    // Create a Firestore reference
    const firestore = firebase.firestore();
    // Create a GeoFirestore reference
    const geofirestore: GeoFirestore = new GeoFirestore(firestore);
    // Create a GeoCollection reference
    const geocollection: GeoCollectionReference = geofirestore.collection(
      'devs'
    );

    // Create a GeoQuery based on a location
    //TOTVS -16.6971993,-49.2575527
    //Predio -16.6972044 -49.255364
    const query: GeoQuery = geocollection.near({
      center: new firebase.firestore.GeoPoint(-16.6972044, -49.255364),
      radius: 1000
    });

    // Get query (as Promise)
    query.get().then((value: GeoQuerySnapshot) => {
      console.log(value.docs);
    });
    return [];
  }
}

export default new DevService();
