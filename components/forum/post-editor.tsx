"use client";

import * as React from "react";
import { Bold, Italic, Code, List, Link as LinkIcon, Eye, Edit3, Paperclip } from "lucide-react";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Textarea } from "@components/ui/textarea";
import { Select } from "@components/ui/select";
import { Badge } from "@components/ui/badge";
import { FileUploader } from "@components/shared/file-uploader";
import { useAuth } from "@hooks/use-auth";
import type { ForumCategoryRow } from "@services/forumService";

interface PostEditorProps {
  categories: ForumCategoryRow[];
  onSubmit: (data: {
    categoryId: string;
    title: string;
    content: string;
    tags: string[];
  }) => Promise<void>;
  isSubmitting?: boolean;
}

export function PostEditor({ categories, onSubmit, isSubmitting }: PostEditorProps) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = React.useState<"write" | "preview">("write");

  const [categoryId, setCategoryId] = React.useState(categories[0]?.id || "");
  const [title, setTitle] = React.useState("");
  const [content, setContent] = React.useState("");
  const [tagInput, setTagInput] = React.useState("");
  const [tags, setTags] = React.useState<string[]>(["HPLC", "FSSAI", "ISO17025"]);
  const [attachmentUrl, setAttachmentUrl] = React.useState<string | null>(null);

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const val = tagInput.trim().replace(/[^a-zA-Z0-9]/g, "");
      if (val && !tags.includes(val)) {
        setTags([...tags, val]);
        setTagInput("");
      }
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const insertFormat = (prefix: string, suffix: string = "") => {
    setContent((prev) => `${prev}${prefix}Text${suffix}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    let finalContent = content;
    if (attachmentUrl) {
      finalContent += `\n\n**Attachment:** [Download Document](${attachmentUrl})`;
    }

    onSubmit({
      categoryId: categoryId || categories[0]?.id || "",
      title,
      content: finalContent,
      tags,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Category & Title */}
      <div className="space-y-4">
        <div>
          <label className="text-foreground mb-1 block text-xs font-bold tracking-wider uppercase">
            Category
          </label>
          <Select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            options={categories.map((c) => ({ value: c.id, label: c.name }))}
          />
        </div>

        <div>
          <label className="text-foreground mb-1 block text-xs font-bold tracking-wider uppercase">
            Topic Title
          </label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Best Practices for LC-MS/MS Pesticide Screening in Leafy Greens"
            required
            className="text-base font-semibold"
          />
        </div>
      </div>

      {/* Editor & Preview Header Tabs */}
      <div className="border-border/80 bg-card overflow-hidden rounded-2xl border shadow-sm">
        <div className="border-border/80 bg-muted/40 flex items-center justify-between border-b px-4 py-2">
          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant={activeTab === "write" ? "navy" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("write")}
              className="gap-1.5 text-xs"
            >
              <Edit3 className="h-3.5 w-3.5" /> Write
            </Button>
            <Button
              type="button"
              variant={activeTab === "preview" ? "green" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("preview")}
              className="gap-1.5 text-xs"
            >
              <Eye className="h-3.5 w-3.5" /> Preview
            </Button>
          </div>

          {activeTab === "write" && (
            <div className="hidden items-center gap-1 sm:flex">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => insertFormat("**", "**")}
                title="Bold"
              >
                <Bold className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => insertFormat("*", "*")}
                title="Italic"
              >
                <Italic className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => insertFormat("```\n", "\n```")}
                title="Code block"
              >
                <Code className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => insertFormat("\n- ")}
                title="Bullet list"
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => insertFormat("[Link Title](", ")")}
                title="Insert link"
              >
                <LinkIcon className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        <div className="p-4">
          {activeTab === "write" ? (
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Describe your technical question, analytical protocol, or laboratory observation in detail (Markdown supported)..."
              rows={10}
              required
              className="border-0 p-0 text-sm leading-relaxed focus-visible:ring-0"
            />
          ) : (
            <div className="text-foreground min-h-[220px] text-sm leading-relaxed whitespace-pre-line">
              {content || (
                <span className="text-muted-foreground italic">Nothing to preview yet...</span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Tags Input */}
      <div className="space-y-2">
        <label className="text-foreground block text-xs font-bold tracking-wider uppercase">
          Topic Tags (Press Enter)
        </label>
        <div className="mb-2 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge
              key={tag}
              variant="outline"
              className="gap-1 border-[#4a9d23]/40 px-2.5 py-1 text-xs"
            >
              #{tag}
              <button
                type="button"
                onClick={() => handleRemoveTag(tag)}
                className="text-muted-foreground hover:text-destructive"
              >
                ×
              </button>
            </Badge>
          ))}
        </div>
        <Input
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={handleAddTag}
          placeholder="Add tags e.g. FSSAI, HPLC, NABL..."
        />
      </div>

      {/* Attachment Upload */}
      <div className="space-y-2">
        <label className="text-foreground block flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase">
          <Paperclip className="h-4 w-4 text-[#4a9d23]" /> Attach Reference Document (Optional PDF /
          Image)
        </label>
        <FileUploader
          bucket="resources"
          userId={user?.id || "anonymous"}
          label="Upload Reference Document"
          accept=".pdf,.docx,.xlsx,image/*"
          onUploadSuccess={(url) => setAttachmentUrl(url)}
        />
      </div>

      <div className="flex justify-end pt-2">
        <Button
          type="submit"
          variant="green"
          size="lg"
          disabled={isSubmitting}
          className="shadow-md"
        >
          {isSubmitting ? "Publishing Topic..." : "Publish Topic"}
        </Button>
      </div>
    </form>
  );
}
