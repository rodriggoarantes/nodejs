import { Request, Response } from 'express';
import * as firebase from 'firebase-admin';
import { Dev } from './../models/Dev';

class DevController {
  async store(req: Request, res: Response) {
    const { githubUsername, techs } = req.body;

    const techsArray: Array<string> = techs
      .split(',')
      .map((tech: string) => tech.trim());

    const db = firebase.firestore();
    const ref = db.collection('devs').doc();
    const dev: Dev = <Dev>{
      name: 'Rodrigo Arantes FB',
      avatarUrl: `https://api.adorable.io/avatars/150/${githubUsername}.png`,
      bio: githubUsername,
      techs: techsArray,
      githubUsername: githubUsername
    };
    ref.set(dev);

    return res.json({ id: ref.id, ...dev });
  }
}

export default new DevController();
