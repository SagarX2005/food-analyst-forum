"use client";

import * as React from "react";
import { User, Save, Upload, Sparkles } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Textarea } from "@components/ui/textarea";
import { useAuth } from "@hooks/use-auth";
import { ProfileService, type FullProfile } from "@services/profileService";
import { FileUploader } from "@components/shared/file-uploader";

export default function EditProfilePage() {
  const { user, profile } = useAuth();
  const fullProf = profile as unknown as FullProfile | null;

  const [fullName, setFullName] = React.useState(fullProf?.full_name || "");
  const [headline, setHeadline] = React.useState(fullProf?.headline || "");
  const [bio, setBio] = React.useState(fullProf?.bio || "");
  const [location, setLocation] = React.useState(fullProf?.location || "");
  const [website, setWebsite] = React.useState(fullProf?.website || "");
  const [linkedinUrl, setLinkedinUrl] = React.useState(fullProf?.linkedin_url || "");
  const [githubUrl, setGithubUrl] = React.useState(fullProf?.github_url || "");
  const [skillsStr, setSkillsStr] = React.useState(
    Array.isArray(fullProf?.skills) && fullProf.skills.length > 0
      ? fullProf.skills.join(", ")
      : "",
  );
  const [avatarUrl, setAvatarUrl] = React.useState(fullProf?.avatar_url || null);
  const [coverUrl, setCoverUrl] = React.useState(fullProf?.cover_url || null);

  const [hasInitialized, setHasInitialized] = React.useState(false);

  React.useEffect(() => {
    if (fullProf && !hasInitialized) {
      setFullName(fullProf.full_name || "");
      setHeadline(fullProf.headline || "");
      setBio(fullProf.bio || "");
      setLocation(fullProf.location || "");
      setWebsite(fullProf.website || "");
      setLinkedinUrl(fullProf.linkedin_url || "");
      setGithubUrl(fullProf.github_url || "");
      setSkillsStr(
        Array.isArray(fullProf.skills) && fullProf.skills.length > 0
          ? fullProf.skills.join(", ")
          : ""
      );
      setAvatarUrl(fullProf.avatar_url || null);
      setCoverUrl(fullProf.cover_url || null);
      
      setHasInitialized(true);
    }
  }, [fullProf, hasInitialized]);

  const [isSaving, setIsSaving] = React.useState(false);
  const [message, setMessage] = React.useState<string | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setIsSaving(true);
      setMessage(null);

      const skillsArr = skillsStr
        .split(",")
        .map((s: string) => s.trim())
        .filter(Boolean);

      await ProfileService.updateProfile(user.id, {
        full_name: fullName,
        headline,
        bio,
        location,
        website,
        linkedin_url: linkedinUrl,
        github_url: githubUrl,
        skills: skillsArr,
        avatar_url: avatarUrl,
        cover_url: coverUrl,
      });

      setMessage("Changes saved successfully.");
      setTimeout(() => {
        setMessage(null);
      }, 3000);
    } catch {
      setMessage("Failed to save changes. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8 py-4">
      <div className="space-y-2">
        <h1 className="dark:text-foreground text-3xl font-extrabold text-[#0a2a4a]">
          Edit Professional Profile
        </h1>
        <p className="text-muted-foreground text-sm">
          Manage your analyst identity, credentials, laboratory affiliation, and avatar.
        </p>
      </div>

      {message && (
        <div className="rounded-xl border border-[#4a9d23]/30 bg-[#4a9d23]/10 p-4 text-xs font-semibold text-[#4a9d23]">
          {message}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        {/* AVATAR & COVER UPLOAD SECTION */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="dark:text-foreground flex items-center gap-2 text-lg text-[#0a2a4a]">
              <Upload className="h-5 w-5 text-[#4a9d23]" /> Profile Images & Media
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FileUploader
              bucket="avatars"
              userId={user?.id || "anonymous"}
              label="Upload Avatar Photo"
              currentUrl={avatarUrl}
              onUploadSuccess={(url) => setAvatarUrl(url)}
            />
            <FileUploader
              bucket="avatars"
              userId={user?.id || "anonymous"}
              label="Upload Cover Banner"
              currentUrl={coverUrl}
              onUploadSuccess={(url) => setCoverUrl(url)}
            />
          </CardContent>
        </Card>

        {/* GENERAL INFORMATION */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="dark:text-foreground flex items-center gap-2 text-lg text-[#0a2a4a]">
              <User className="h-5 w-5 text-[#4a9d23]" /> General Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="text-foreground mb-1 block text-xs font-semibold">
                  Full Name
                </label>
                <Input value={fullName} onChange={(e) => setFullName(e.target.value)} required />
              </div>
              <div>
                <label className="text-foreground mb-1 block text-xs font-semibold">
                  Professional Title
                </label>
                <Input
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="e.g. Senior Analytical Chemist (HPLC)"
                />
              </div>
            </div>

            <div>
              <label className="text-foreground mb-1 block text-xs font-semibold">
                Professional Bio & Overview
              </label>
              <Textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Describe your testing expertise, lab experience, and analytical achievements..."
                rows={4}
              />
            </div>

            <div>
              <label className="text-foreground mb-1 block text-xs font-semibold">Location</label>
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Mumbai, Maharashtra, India"
              />
            </div>
          </CardContent>
        </Card>

        {/* SKILLS & SOCIAL LINKS */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="dark:text-foreground flex items-center gap-2 text-lg text-[#0a2a4a]">
              <Sparkles className="h-5 w-5 text-[#4a9d23]" /> Skills & Professional Links
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-foreground mb-1 block text-xs font-semibold">
                Skills (Comma Separated)
              </label>
              <Input
                value={skillsStr}
                onChange={(e) => setSkillsStr(e.target.value)}
                placeholder="HPLC, LC-MS/MS, ISO 17025, QuEChERS, Microbiology"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <label className="text-foreground mb-1 block text-xs font-semibold">
                  Website / Portfolio
                </label>
                <Input
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://myfoodlab.com"
                />
              </div>
              <div>
                <label className="text-foreground mb-1 block text-xs font-semibold">
                  LinkedIn Profile
                </label>
                <Input
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  placeholder="https://linkedin.com/in/username"
                />
              </div>
              <div>
                <label className="text-foreground mb-1 block text-xs font-semibold">
                  GitHub Profile
                </label>
                <Input
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  placeholder="https://github.com/username"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button type="submit" variant="green" size="lg" disabled={isSaving} className="gap-2">
                <Save className="h-4 w-4" /> {isSaving ? "Saving Changes..." : "Save Profile"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
