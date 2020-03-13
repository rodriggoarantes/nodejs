import { NextFunction, Request, Response } from 'express';
import * as Busboy from 'busboy';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

export interface Options extends busboy.BusboyConfig {
  multipartOnly?: boolean;
  uploadPath?: string;
  files?: string[] | boolean;
}

export const defaultOptions: Options = {
  multipartOnly: true,
  uploadPath: os.tmpdir(),
  files: []
};

export interface File {
  fieldname: string;
  filename: string;
  path: string;
  encoding?: string;
  mimetype?: string;
  size?: number;
  buffer?: Buffer;
}

export interface Files {
  [key: string]: File[];
}

declare global {
  namespace Express {
    interface Request {
      files: Files;
      rawBody: any;
    }
  }
}

export default async (req: Request, res: Response, next: NextFunction) => {
  const options: Options = defaultOptions;

  const isNotPost = (method: string) => {
    console.log(`isNotPost ${method}`);
    return method !== 'POST';
  };

  const isNotMultipart = (contentType: string) => {
    console.log(`contentType ${contentType}`);
    return (
      options.multipartOnly &&
      (!contentType || !contentType.includes('multipart/form-data'))
    );
  };

  const isNotToDo = (req: Request) => {
    return isNotPost(req.method) || isNotMultipart(req.headers['content-type']);
  };

  try {
    console.log(`uploadFileMiddleware`);

    if (isNotToDo(req)) {
      next();
      return;
    }

    const busboy = new Busboy({
      headers: req.headers,
      limits: {
        fileSize: 10 * 1024 * 1024
      }
    });

    if (options.files) {
      console.log(`files`);

      const fileWritePromises: Array<Promise<void>> = [];
      let fileBuffer: Buffer = Buffer.from('');
      req.files = {};

      busboy.on('field', (key, value) => {
        req.body[key] = value;
      });

      busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
        console.log(`Processed : ${fieldname} ${filename}`);
        const filepath = path.join(options.uploadPath, filename);

        const writeStream = fs.createWriteStream(filepath);
        file.pipe(writeStream);

        req.files[fieldname] = [];

        const promise = new Promise<void>((resolve, reject) => {
          file.on('data', data => {
            fileBuffer = Buffer.concat([fileBuffer, data]);
          });

          file.on('end', () => {
            console.log(`file -> end`);
            const size = Buffer.byteLength(fileBuffer);

            req.files[fieldname].push({
              fieldname,
              path: filepath,
              buffer: fileBuffer,
              size,
              filename,
              encoding,
              mimetype
            });

            writeStream.end();
          });

          file.on('error', err => {
            console.log(`file -> error ${err}`);
          });

          writeStream.on('finish', resolve);
          writeStream.on('error', reject);
        });

        fileWritePromises.push(promise);
      });

      busboy.on('finish', async () => {
        console.log(`finish -> busboy`);
        await Promise.all(fileWritePromises);
        console.log(`finish -> promisses ${fileWritePromises.length}`);
        console.log(`finish -> request ${req.files.keys}`);
        next();
      });

      console.log(`raw: ${req.rawBody}`);
      if (req && req.rawBody) {
        busboy.end(req.rawBody);
      }
      req.pipe(busboy);
    }

    busboy.on('error', (err: Error) => {
      console.log(`${req.method} ${req.url} ERROR`, err);
      next(err);
    });
  } catch (error) {
    console.log(`Erro ao gerar arquivo: ${error}`);
  }

  console.log(`finish -> middleware`);
}
