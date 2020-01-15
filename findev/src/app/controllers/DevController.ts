import { Request, Response } from 'express';
import * as firebase from 'firebase-admin';
import Dev from './../models/Dev';

import axios from 'axios';
import Location from '../models/Location';

class DevController {
  async store(req: Request, res: Response) {
    const gitHubApi: string = 'https://api.github.com/users';

    const { githubUsername, techs, latitude, longitude } = req.body;

    const response = await axios.get(`${gitHubApi}/${githubUsername}`);

    const { login, avatar_url, bio, name } = response.data;

    const techsArray: Array<string> = techs
      .split(',')
      .map((tech: string) => tech.trim());

    const location: Location = new firebase.firestore.GeoPoint(
      latitude,
      longitude
    );

    const db = firebase.firestore();
    const ref = db.collection('devs').doc();
    const dev: Dev = {
      name,
      avatarUrl: avatar_url,
      bio,
      techs: techsArray,
      githubUsername: login,
      location
    };
    ref.set(dev);

    return res.json({ id: ref.id, ...dev });
  }
}

export default new DevController();
