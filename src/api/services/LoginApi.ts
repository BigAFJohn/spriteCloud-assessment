import { APIRequestContext } from '@playwright/test';

export default class LoginApi {
  private request: APIRequestContext;

  constructor(requestContext: APIRequestContext) {
    this.request = requestContext;
  }

  async loginUser(username: string, password: string) {
    return await this.request.post('/login', { data: { email: username, password } });
  }

  async loginWithoutPassword(username: string) {
    return await this.request.post('/login', { data: { email: username } });
  }
}
