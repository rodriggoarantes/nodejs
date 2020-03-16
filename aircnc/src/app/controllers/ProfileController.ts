import { Request, Response } from 'express';

import spotService from '@app/services/SpotService';
import Spot from '@app/models/Spot';

class ProfileController {
  async spots(req: Request, res: Response) {
    const user: string = req.header('user_id');
    if (!user) {
      throw 'Usuario não informado';
    }

    const spotsFromUser: Array<Spot> = await spotService.fromUser(user);
    return res.json(spotsFromUser);
  }
}

export default new ProfileController();
