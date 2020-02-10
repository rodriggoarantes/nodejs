import { Request, Response } from 'express';

import { parseStringToArray } from '@app/util/Utils';
import spotService from '@app/services/SpotService';
import fileService from '@app/services/FileService';

import Spot from '@app/models/Spot';
import userService from '@app/services/UserService';

class SpotController {
  async index(_: Request, res: Response) {
    const list: Array<Spot> = await spotService.list();
    return res.status(200).json(list);
  }

  async store(req: Request, res: Response) {
    const { name, company, price, techs, user } = req.body;
    const { originalname, buffer } = req.file;
    if (!originalname) {
      throw 'Imagem não informada para o local';
    }

    const usuarioExistente = await userService.findById(user);
    if (usuarioExistente && usuarioExistente._id) {
      throw 'Usuario proprietario do local não encontrado';
    }

    const fileUploaded = await fileService.uploadStream(buffer, originalname);
    const spot = <Spot>{
      name,
      company,
      price,
      techs: parseStringToArray(techs),
      thumbnail: fileUploaded.url
    };
    const saved = await spotService.store(spot);

    return res.status(200).json(saved);
  }
}

export default new SpotController();
