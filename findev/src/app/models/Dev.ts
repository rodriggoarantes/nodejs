interface Dev {
  id?: string;
  name: string;
  githubUsername: string;
  bio?: string;
  avatarUrl?: string;
  techs?: Array<string>;
  latitude: number;
  longitude: number;
}

export default Dev;
