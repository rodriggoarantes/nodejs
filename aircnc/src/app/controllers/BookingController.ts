import { Request, Response } from 'express';
import { Booking } from '@app/models/Booking';

import Spot from '@app/models/Spot';

import bookingService from '@app/services/BookingService';
import spotService from '@app/services/SpotService';

class BookingController {
  async store(req: Request, res: Response) {
    const { id } = req.params;
    const { date } = req.body;
    const user: string = req.header('user_id');

    if (!user) {
      throw 'Usuario não informado';
    }
    if (!date) {
      throw 'Data da reserva nao informada';
    }
    if (!id) {
      throw 'Identificador do local não é válido';
    }
    const spot: Spot = await spotService.findById(id);
    if (!spot || !spot._id) {
      throw 'Local selecionado para reserva não foi encontrado';
    }

    const booking: Booking = await bookingService.store(<Booking>{
      date,
      user: user,
      spot: id,
      approved: false
    });

    return res.json(booking);
  }
}

export default new BookingController();
