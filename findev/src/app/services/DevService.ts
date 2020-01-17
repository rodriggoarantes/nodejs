import * as firebase from 'firebase-admin';
import * as geofirex from 'geofirex';
import { get } from 'geofirex';
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
    const geo = geofirex.init(<any>firebase);

    const location: Location = geo.point(latitude, longitude);

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
    const geo = geofirex.init(<any>firebase);
    //TOTVS -16.6971993,-49.2575527
    //Predio -16.6972044 -49.255364

    const radius = 10;
    const ref = this.getRef();
    const position: Location = geo.point(-16.6972044, -49.255364);

    const query = geo.query(ref).within(position, radius, 'location');

    const nearByList: Array<Dev> = [];
    const hits: Array<any> = await get(query);

    if (hits && hits.length) {
      hits.map((devPoint: any) => {
        nearByList.push(<Dev>devPoint);
      });
    }
    return nearByList;
  }
}

export default new DevService();
