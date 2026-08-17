"use client";

import * as React from "react";
import { ForumService, type ThreadedComment } from "@services/forumService";
import { CommentTree } from "@components/forum/comment-tree";
import { useAuth } from "@hooks/use-auth";

interface CommentTreeContainerProps {
  postId: string;
  postAuthorId: string;
}

export function CommentTreeContainer({ postId, postAuthorId }: CommentTreeContainerProps) {
  const { user } = useAuth();
  const [comments, setComments] = React.useState<ThreadedComment[]>([]);

  const loadComments = React.useCallback(async () => {
    const data = await ForumService.getComments(postId);
    setComments(data);
  }, [postId]);

  React.useEffect(() => {
    loadComments();
  }, [loadComments]);

  return (
    <CommentTree
      comments={comments}
      postId={postId}
      currentUserId={user?.id}
      isPostAuthor={user?.id === postAuthorId}
      onCommentAdded={loadComments}
    />
  );
}
