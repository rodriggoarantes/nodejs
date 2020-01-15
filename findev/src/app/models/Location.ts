import * as firebase from 'firebase-admin';

class Location extends firebase.firestore.GeoPoint {}

export default Location;
