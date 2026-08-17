"use client";

import * as React from "react";
import { MessageSquare, ThumbsUp, CheckCircle2, CornerDownRight, Reply, Send } from "lucide-react";
import { Button } from "@components/ui/button";
import { Textarea } from "@components/ui/textarea";
import { Avatar } from "@components/ui/avatar";
import { ForumService, type ThreadedComment } from "@services/forumService";

interface CommentTreeProps {
  comments: ThreadedComment[];
  postId: string;
  currentUserId?: string;
  isPostAuthor?: boolean;
  onCommentAdded: () => void;
}

export function CommentTree({
  comments,
  postId,
  currentUserId,
  isPostAuthor,
  onCommentAdded,
}: CommentTreeProps) {
  const [newComment, setNewComment] = React.useState("");
  const [replyingToId, setReplyingToId] = React.useState<string | null>(null);
  const [replyText, setReplyText] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [bestAnswerId, setBestAnswerId] = React.useState<string | null>(null);

  const handleTopLevelSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUserId || !newComment.trim()) return;

    try {
      setIsSubmitting(true);
      await ForumService.addComment({
        postId,
        authorId: currentUserId,
        content: newComment,
      });
      setNewComment("");
      onCommentAdded();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReplySubmit = async (parentId: string) => {
    if (!currentUserId || !replyText.trim()) return;

    try {
      setIsSubmitting(true);
      await ForumService.addComment({
        postId,
        authorId: currentUserId,
        parentId,
        content: replyText,
      });
      setReplyText("");
      setReplyingToId(null);
      onCommentAdded();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMarkBestAnswer = (commentId: string) => {
    setBestAnswerId(commentId);
  };

  return (
    <div className="space-y-6 pt-4">
      {/* Header */}
      <h3 className="text-xl font-bold text-[#0a2a4a] dark:text-foreground flex items-center gap-2">
        <MessageSquare className="h-5 w-5 text-[#4a9d23]" />
        Discussion Comments ({comments.length})
      </h3>

      {/* TOP LEVEL COMMENT FORM */}
      {currentUserId ? (
        <form onSubmit={handleTopLevelSubmit} className="space-y-3">
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a technical response, method suggestion, or observation..."
            rows={3}
            required
          />
          <div className="flex justify-end">
            <Button type="submit" variant="green" size="default" disabled={isSubmitting} className="gap-2">
              <Send className="h-4 w-4" /> {isSubmitting ? "Posting..." : "Post Response"}
            </Button>
          </div>
        </form>
      ) : (
        <div className="p-4 rounded-xl bg-muted text-xs text-muted-foreground text-center">
          Please sign in to participate in technical discussion comments.
        </div>
      )}

      {/* COMMENTS LIST */}
      <div className="space-y-4 pt-2">
        {comments.map((c) => {
          const isBest = bestAnswerId === c.id;

          return (
            <div
              key={c.id}
              className={`p-4 rounded-2xl border transition-all space-y-3 ${
                isBest
                  ? "border-[#4a9d23] bg-[#4a9d23]/5 shadow-md"
                  : "border-border/60 bg-card hover:border-border"
              }`}
            >
              {/* Best Answer Banner */}
              {isBest && (
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#4a9d23] pb-2 border-b border-[#4a9d23]/30">
                  <CheckCircle2 className="h-4 w-4" /> Marked as Best Answer / Solution
                </div>
              )}

              {/* Author Header */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <Avatar
                    src={c.author?.avatar_url || undefined}
                    fallback={c.author?.full_name || "User"}
                    size="sm"
                  />
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-[#0a2a4a] dark:text-foreground">
                      {c.author?.full_name || "Analyst"}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {c.author?.roles?.name || "User"} • {new Date(c.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {isPostAuthor && !isBest && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleMarkBestAnswer(c.id)}
                    className="text-[11px] gap-1 text-[#4a9d23] border-[#4a9d23]/40 hover:bg-[#4a9d23]/10"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" /> Accept Solution
                  </Button>
                )}
              </div>

              {/* Comment Content */}
              <p className="text-xs sm:text-sm text-foreground leading-relaxed whitespace-pre-line">
                {c.content}
              </p>

              {/* Action Toolbar */}
              <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1 font-medium">
                <button className="flex items-center gap-1 hover:text-[#4a9d23] transition-colors">
                  <ThumbsUp className="h-3.5 w-3.5" /> Like
                </button>
                {currentUserId && (
                  <button
                    onClick={() => setReplyingToId(replyingToId === c.id ? null : c.id)}
                    className="flex items-center gap-1 hover:text-[#4a9d23] transition-colors"
                  >
                    <Reply className="h-3.5 w-3.5" /> Reply
                  </button>
                )}
              </div>

              {/* Nested Reply Form */}
              {replyingToId === c.id && (
                <div className="pt-2 pl-4 border-l-2 border-[#4a9d23]/30 space-y-2">
                  <Textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Write a reply..."
                    rows={2}
                  />
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm" onClick={() => setReplyingToId(null)}>
                      Cancel
                    </Button>
                    <Button
                      variant="green"
                      size="sm"
                      onClick={() => handleReplySubmit(c.id)}
                      disabled={isSubmitting}
                    >
                      Post Reply
                    </Button>
                  </div>
                </div>
              )}

              {/* Nested Replies Rendering */}
              {c.replies && c.replies.length > 0 && (
                <div className="pl-6 pt-3 space-y-3 border-l-2 border-border/60">
                  {c.replies.map((reply) => (
                    <div key={reply.id} className="space-y-1 text-xs">
                      <div className="flex items-center gap-2">
                        <CornerDownRight className="h-3.5 w-3.5 text-[#4a9d23]" />
                        <span className="font-bold text-foreground">
                          {reply.author?.full_name || "Analyst"}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          • {new Date(reply.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="pl-5 text-muted-foreground leading-relaxed">{reply.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
