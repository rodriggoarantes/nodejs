import { Request, Response } from 'express';

import userService from '@app/services/UserService';
import User from '@app/models/User';

class UserController {
  async index(_: Request, res: Response) {
    const list: Array<User> = await userService.list();
    return res.json(list);
  }

  async store(req: Request, res: Response) {
    const { name, email } = req.body;

    let user: User = await userService.findByEmail(email);

    if (user && user.name) {
      throw 'Usuário já cadastrado no sistema';
    }

    user = await userService.store({ name, email });

    return res.json({
      message: `Usuário {${user.name}} registrado com sucesso`,
      data: user
    });
  }
}

export default new UserController();
