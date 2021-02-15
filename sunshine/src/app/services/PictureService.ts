import axios from 'axios';

import Picture from '@app/models/Picture';

class PictureService {
  private readonly appID = `Client-ID ${process.env.UNSPLASH_API_KEY || ''}`;
  private readonly apiURL = 'https://api.unsplash.com/photos';
  private readonly randomPicture = `${this.apiURL}/random?orientation=portrait`;

  async getRandom(query: string): Promise<Picture> {
    try {
      const response = await axios.get(`${this.randomPicture}`, {
        params: { query },
        headers: { Authorization: this.appID }
      });

      let foto: Picture = <Picture>{};
      if (response && response.data) {
        const data = response.data;
        foto = <Picture>{
          location: data.location.title,
          city: data.location.city,
          country: data.location.country,
          photographer: data.user.name,
          full: data.urls.full,
          regular: data.urls.regular,
          small: data.urls.small
        };
      }
      return foto;
    } catch (error) {
      return this.defaultPicture();
    }
  }

  private defaultPicture() {
    const urlPicture =
      'https://cdn.pixabay.com/photo/2018/11/22/23/57/london-3833039_960_720.jpg';
    return <Picture>{
      location: 'default',
      city: 'default',
      country: 'default',
      photographer: '',
      full: urlPicture,
      regular: urlPicture,
      small: urlPicture
    };
  }
}

export default new PictureService();
