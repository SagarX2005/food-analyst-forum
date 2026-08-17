import { BaseService } from "@services/base-service";
import type { LoginInput } from "../types";

export class AuthService extends BaseService {
  public async login(input: LoginInput) {
    return this.client.post<{ sessionToken: string }>("/api/auth/login", input);
  }

  public async logout() {
    return this.client.post<{ success: boolean }>("/api/auth/logout", {});
  }
}

export const authService = new AuthService();
