import * as firebase from 'firebase-admin';
import { resolve } from 'path';

class FileService {
  private storageBucket: any = null;

  private getRef() {
    if (!this.storageBucket) {
      this.storageBucket = firebase.storage().bucket();
    }
    return this.storageBucket;
  }

  async uploadStream(stream: any, filename: string) {
    const file = await this.getRef().file(`avatars/${filename}`);
    const blobStream = file.createWriteStream({
      gzip: true,
      destination: `avatars/${filename}`,
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
    const destination = resolve(__dirname, '..', '..', '..', 'tmp', filename);
    const [file] = await this.getRef().upload(destination, {
      gzip: true,
      destination: `avatars/${filename}`,
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
}

export default new FileService();
