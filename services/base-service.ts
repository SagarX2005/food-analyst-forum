import { ApiClient, apiClient } from "./api-client";

export abstract class BaseService {
  protected client: ApiClient;

  constructor(client: ApiClient = apiClient) {
    this.client = client;
  }
}
