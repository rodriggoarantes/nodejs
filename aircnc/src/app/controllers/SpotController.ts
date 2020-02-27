import { Request, Response } from 'express';

import { File } from '@app/middleware/upload';
import { parseStringToArray } from '@app/util/Utils';
import spotService from '@app/services/SpotService';
import fileService from '@app/services/FileService';

import Spot from '@app/models/Spot';
import userService from '@app/services/UserService';

class SpotController {
  async index(req: Request, res: Response) {
    const { tech, name } = req.query;
    const list: Array<Spot> = await spotService.list(name, tech);
    return res.status(200).json(list);
  }

  async store(req: Request, res: Response) {
    const { name, company, price, techs } = req.body;

    if (!name) {
      throw 'Nome do local é obrigatório';
    }
    if (!company) {
      throw 'Empresa proprietaria nao informada';
    }

    const techsList = parseStringToArray(techs);
    if (!techsList || !techsList.length) {
      throw 'Lista de tecnologias do local não é válido';
    }

    const user: string = req.header('user_id');
    if (!user) {
      throw 'Usuario não informado';
    }

    const usuarioExistente = await userService.findById(user);
    if (!usuarioExistente || !usuarioExistente._id) {
      throw 'Usuario proprietario do local não encontrado';
    }

    if (
      !req.files ||
      !req.files['thumbnail'] ||
      !req.files['thumbnail'].length
    ) {
      throw 'Imagem não informada para o local';
    }

    const arquivo: File = req.files['thumbnail'][0];
    const fileUploaded = await fileService.uploadStream(
      arquivo.buffer,
      arquivo.filename
    );

    const spot = <Spot>{
      name,
      name_search: name.toUpperCase(),
      company,
      price,
      user,
      techs: techsList,
      techs_search: parseStringToArray(techs.toUpperCase()),
      thumbnail: fileUploaded.url
    };
    const saved = await spotService.store(spot);

    return res.status(200).json(saved);
  }
}

export default new SpotController();
