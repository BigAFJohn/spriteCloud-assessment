import { APIRequestContext } from '@playwright/test';

export default class UsersApi {
  private request: APIRequestContext;

  constructor(requestContext: APIRequestContext) {
    this.request = requestContext;
  }

  async getUserList(page: number) {
    return await this.request.get(`/users?page=${page}`);
  }

  async modifyUser(name: string, job: string, id: number) {
    return await this.request.put(`/users/${id}`, { data: { name, job } });
  }

  async deleteUser(id: number) {
    return await this.request.delete(`/users/${id}`);
  }
}
