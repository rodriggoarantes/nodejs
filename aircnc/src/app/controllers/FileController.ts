import { Request, Response } from 'express';

import fileService from '@app/services/FileService';

class FileController {
  async store(req: Request, res: Response) {
    const { originalname: name, filename } = req.file;
    if (!name || !filename) {
      return res.status(401).json({ message: 'Campos informados inválidos' });
    }

    const file = await fileService.upload(filename);
    return res.json(file);
  }
}

export default new FileController();
