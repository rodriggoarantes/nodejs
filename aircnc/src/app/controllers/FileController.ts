import { Request, Response } from 'express';

import fileService from '@app/services/FileService';

class FileController {
  async store(req: Request, res: Response) {
    const { originalname, buffer } = req.file;
    if (!originalname) {
      return res.status(401).json({ message: 'Campos informados inválidos' });
    }

    const file = await fileService.uploadStream(buffer, originalname);
    return res.json(file);
  }
}

export default new FileController();
