import { Request, Response } from 'express';

import { parseStringToArray } from '@app/services/Utils';

import devService from '@app/services/DevService';
import githubService from '@app/services/GitHubService';

import User from '@app/models/User';
import Dev from '@app/models/Dev';

class DevController {
  async index(req: Request, res: Response) {
    const lista: Array<Dev> = await devService.list();
    return res.json(lista);
  }

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

    const dev: Dev = devService.save(
      githubUser,
      parseStringToArray(techs),
      latitude,
      longitude
    );

    return res.json(dev);
  }
}

export default new DevController();
