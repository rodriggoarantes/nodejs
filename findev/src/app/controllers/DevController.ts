import { Request, Response } from 'express';
import Dev from './../models/Dev';
import devService from './../services/DevService';
import githubService from './../services/GitHubService';
import User from '../models/User';

class DevController {
  async store(req: Request, res: Response) {
    const { githubUsername, techs, latitude, longitude } = req.body;

    const githubUser: User = await githubService.getUser(githubUsername);

    const techsArray: Array<string> = techs
      .split(',')
      .map((tech: string) => tech.trim());

    const dev: Dev = devService.save(
      githubUser,
      techsArray,
      latitude,
      longitude
    );

    return res.json(dev);
  }
}

export default new DevController();
