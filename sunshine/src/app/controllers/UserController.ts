import { Request, Response } from 'express';
import User from '@app/models/User';

import service from '@app/services/UserService';

class UserController {
  async create(req: Request, res: Response) {
    const user: User = req.body;

    if (user.pass != user.confirmPass) {
      throw 'Senhas informadas são divergentes';
    }
    const existed: User = await service.find({ email: user.email });
    if (existed && existed._id) {
      throw 'Usuário já cadastrado para o email informado';
    }

    const created = await service.store(user);
    return res.json(created);
  }
}

export default new UserController();
