import * as multer from 'multer';

export default {
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // no larger than 10mb
  }
};
