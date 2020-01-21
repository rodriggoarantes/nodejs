import { Request, Response } from 'express';

class UserController {
  async index(req: Request, res: Response) {
    return res.json({ id: 1, name: 'rodrigo', email: 'hello@hello.com' });
  }
}

export default new UserController();
