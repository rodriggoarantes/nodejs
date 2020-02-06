import * as firebase from 'firebase-admin';
import * as crypto from 'crypto';
import { resolve, extname } from 'path';

class FileService {
  private storageBucket: any = null;

  private getRef() {
    if (!this.storageBucket) {
      this.storageBucket = firebase.storage().bucket();
    }
    return this.storageBucket;
  }

  async uploadStream(stream: any, filename: string) {
    const ext = extname(filename);
    const finalFileName = `avatars/${this.hashName(filename)}${ext}`;

    const file = await this.getRef().file(finalFileName);
    const blobStream = file.createWriteStream({
      gzip: true,
      destination: finalFileName,
      public: true,
      metadata: {
        contentType: 'image/jpeg',
        cacheControl: 'public, max-age=31536000'
      }
    });
    await blobStream.end(stream);
    return {
      filename: file.name,
      url: `https://storage.googleapis.com/aircnc-server.appspot.com/${file.name}`
    };
  }

  async uploadFile(filename: any) {
    const ext = extname(filename);
    const destination = resolve(__dirname, '..', '..', '..', 'tmp', filename);
    const [file] = await this.getRef().upload(destination, {
      gzip: true,
      destination: `avatars/${this.hashName(filename)}${ext}`,
      public: true,
      metadata: {
        cacheControl: 'public, max-age=31536000'
      }
    });

    return {
      filename: file.name,
      url: `https://storage.googleapis.com/aircnc-server.appspot.com/${file.name}`
    };
  }

  private hashName(originalName: string) {
    const dateStr = new Date().getTime();
    const nameKey = originalName + dateStr;
    const hashname = crypto
      .createHash('md5')
      .update(nameKey)
      .digest('hex');
    return hashname;
  }
}

export default new FileService();
