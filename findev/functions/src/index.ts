import * as functions from 'firebase-functions';
import server from './server';

export const findev = functions.https.onRequest(server);
