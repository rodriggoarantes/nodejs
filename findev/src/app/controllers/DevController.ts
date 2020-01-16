import { Request, Response } from 'express';

import devService from './../services/DevService';
import githubService from './../services/GitHubService';

import User from '../models/User';
import Dev from './../models/Dev';

class DevController {
  async store(req: Request, res: Response) {
    const { githubUsername, techs, latitude, longitude } = req.body;

    // verificar se o usuario já existe
    const usuarioExistente = await devService.findByUsername(githubUsername);
    if (usuarioExistente && usuarioExistente.githubUsername) {
      throw { code: 400, message: 'Usuário já existente.' };
    }

    let githubUser: User;
    try {
      githubUser = await githubService.getUser(githubUsername);
    } catch (githubError) {
      throw { code: 404, message: 'Usuário não encontrado no Github.' };
    }

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
