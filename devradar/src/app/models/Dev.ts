import Location from './Location';

interface Dev {
  id?: string;
  name: string;
  githubUsername: string;
  bio?: string;
  avatarUrl?: string;
  techs?: Array<string>;
  location: Location;
}

export default Dev;
