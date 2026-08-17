import { BaseService } from "@services/base-service";
import type { ForumPost } from "../types";

export class ForumService extends BaseService {
  public async getRecentPosts() {
    return this.client.get<ForumPost[]>("/api/forum/posts");
  }
}

export const forumService = new ForumService();
