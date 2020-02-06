import { ServiceAccount } from 'firebase-admin';

const firebase = () => {
  const firebaseConfig: string = process.env.FIREBASE || '';
  const serviceAccount: ServiceAccount = JSON.parse(firebaseConfig);
  return serviceAccount;
};

export default {
  firebase: firebase(),
  databaseURL: process.env.FIREBASE_DBURL,
  bucket: process.env.FIREBASE_BUCKET
};
