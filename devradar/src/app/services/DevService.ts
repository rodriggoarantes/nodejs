import * as firebase from 'firebase-admin';
import { get } from 'geofirex';
import * as geofirex from 'geofirex';

import Dev from '@app/models/Dev';
import Location from '@app/models/Location';
import User from '@app/models/User';

class DevService {
  private firestoreDb: any = null;

  private getRef() {
    if (!this.firestoreDb) {
      this.firestoreDb = firebase.firestore();
    }
    return this.firestoreDb.collection('devs');
  }

  async findByUsername(username: string): Promise<Dev> {
    const devRef = this.getRef();
    const findQuery = devRef.where('githubUsername', '==', username).limit(1);
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
    const geo = geofirex.init(<any>firebase);

    const location: Location = geo.point(latitude, longitude);

    const dev: Dev = {
      name: user.name,
      avatarUrl: user.avatarUrl,
      bio: user.description,
      techs,
      githubUsername: user.username,
      location,
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

  async searchByTechs(techs: Array<string>): Promise<Array<Dev>> {
    const devs = this.getRef();
    const devsByTech = devs.where('techs', 'array-contains-any', techs);

    devsByTech.get().then((snapshot: any) => {
      snapshot.forEach(function(doc: any) {
        console.log(doc.id, ' => ', doc.data());
      });
    });

    const result = await devsByTech.get();
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
    const geo = geofirex.init(<any>firebase);

    const devs = this.getRef();
    const devsByTech = devs.where('techs', 'array-contains-any', techs);

    const radius = 1;
    const field = 'location';
    const position: Location = geo.point(latitude, longitude);
    const query = geo.query(devsByTech).within(position, radius, field);

    const nearByList: Array<Dev> = [];
    const hits: Array<any> = await get(query);

    if (hits && hits.length) {
      hits.map((devPoint: Dev) => {
        nearByList.push(devPoint);
      });
    }
    return nearByList;
  }
}

export default new DevService();
