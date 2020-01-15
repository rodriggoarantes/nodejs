import GeoTypes from './GeoTypes';
import Geometry from './Geometry';

export interface Propertie {
  name: string;
}

interface Location {
  type: GeoTypes;
  geometry: Geometry;
  properties: Propertie;
}

export default Location;
