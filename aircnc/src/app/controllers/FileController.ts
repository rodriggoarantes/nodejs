import { Request, Response } from 'express';

import { File } from '@app/middleware/upload';

import fileService from '@app/services/FileService';

class FileController {
  async store(req: Request, res: Response) {
    if (!req.files) {
      return res.status(401).json({ message: 'file not found' });
    }

    if (req.files && req.files['file'] && req.files['file'].length) {
      const arquivo: File = req.files['file'][0];

      const file = await fileService.uploadStream(
        arquivo.buffer,
        arquivo.filename
      );
      return res.json(file);
    }
    return res.status(401).json({ message: 'Campos informados inválidos' });
  }
}

export default new FileController();
