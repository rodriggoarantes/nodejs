import * as firebase from 'firebase-admin';
import Dev from '../models/Dev';
import Location from '../models/Location';
import User from '../models/User';

class DevService {
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

    const db = firebase.firestore();
    const ref = db.collection('devs').doc();
    ref.set(dev);

    return { id: ref.id, ...dev };
  }
}

export default new DevService();
