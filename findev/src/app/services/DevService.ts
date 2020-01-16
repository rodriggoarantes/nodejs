import * as firebase from 'firebase-admin';
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
}

export default new DevService();
