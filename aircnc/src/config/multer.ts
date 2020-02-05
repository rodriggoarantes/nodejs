import * as multer from 'multer';
import * as crypto from 'crypto';
import { extname, resolve } from 'path';

export default {
  storage: multer.diskStorage({
    destination: resolve(__dirname, '..', '..', 'tmp'),
    filename: (_, file, callback) => {
      crypto.randomBytes(16, (err, res) => {
        if (err) return callback(err, '');
        return callback(null, res.toString('hex') + extname(file.originalname));
      });
    }
  })
};
