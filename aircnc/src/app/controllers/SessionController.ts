import { Request, Response } from 'express';

import userService from '@app/services/UserService';
import User from '@app/models/User';

class SessionController {
  index(_: Request, res: Response) {
    res.json({ name: 'SessionController' });
  }

  async session(req: Request, res: Response) {
    const { email } = req.body;
    const user: User = await userService.findByEmail(email);
    return res.json(user);
  }
}

export default new SessionController();
