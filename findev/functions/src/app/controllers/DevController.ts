import { Request, Response } from 'express';
import DevSchema, { Dev } from './../models/Dev';

import axios from 'axios';

class DevController {
  async store(req: Request, res: Response) {
    const gitHubApi: string = 'https://api.github.com/users';

    const { githubUsername, techs } = req.body;

    const response = await axios.get(`${gitHubApi}/${githubUsername}`);

    const { login, avatar_url, bio, name } = response.data;

    const techsArray: Array<string> = techs
      .split(',')
      .map((tech: string) => tech.trim());

    const dev: Dev = await DevSchema.create(<Dev>{
      name,
      avatarUrl: avatar_url,
      bio,
      techs: techsArray,
      githubUsername: login
    });

    return res.json(dev);
  }
}

export default new DevController();
