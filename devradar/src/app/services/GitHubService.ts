import axios from 'axios';
import User from '@app/models/User';

class GitHubservice {
  private gitHubApi: string = 'https://api.github.com/users';
  async getUser(githubUsername: string): Promise<User> {
    const response = await axios.get(`${this.gitHubApi}/${githubUsername}`);
    const { login, avatar_url, bio, name } = response.data;
    return <User>{
      name: name || login,
      username: login,
      avatarUrl: avatar_url,
      description: bio
    };
  }
}

export default new GitHubservice();
