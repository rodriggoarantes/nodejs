import { id } from 'date-fns/locale';

export interface UserToken {
  _id?: string;
  id: string;
  name: string;
  email: string;
  token: string;
}

export default UserToken;
