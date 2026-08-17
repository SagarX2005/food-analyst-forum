import * as React from "react";
import Link from "next/link";
import {
  Building2,
  MapPin,
  Calendar,
  ShieldCheck,
  Globe,
  Linkedin,
  Github,
  Edit,
} from "lucide-react";
import { Avatar } from "@components/ui/avatar";
import { Badge } from "@components/ui/badge";
import { Button } from "@components/ui/button";
import type { FullProfile } from "@services/profileService";

interface ProfileHeaderProps {
  profile: FullProfile;
  isOwner?: boolean;
}

export function ProfileHeader({ profile, isOwner }: ProfileHeaderProps) {
  const roleName = profile.roles?.name || "User";
  const orgName = profile.organizations?.name;

  return (
    <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-card shadow-lg">
      {/* Cover Image Banner */}
      <div className="h-44 sm:h-56 w-full bg-gradient-to-r from-[#0a2a4a] via-[#113a63] to-[#4a9d23] relative">
        {profile.cover_url && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={profile.cover_url}
            alt="Cover"
            className="h-full w-full object-cover opacity-60"
          />
        )}
      </div>

      {/* Profile Details Container */}
      <div className="px-6 pb-6 pt-0 relative">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 -mt-16 sm:-mt-20 mb-4">
          <div className="relative">
            <div className="h-28 w-28 sm:h-36 sm:w-36 rounded-full border-4 border-card shadow-2xl overflow-hidden bg-background">
              <Avatar
                src={profile.avatar_url || undefined}
                fallback={profile.full_name || "User"}
                size="lg"
                className="h-full w-full"
              />
            </div>
            <div
              className="absolute bottom-1 right-1 bg-[#4a9d23] text-white p-1.5 rounded-full shadow-md"
              title="Verified Food Analyst"
            >
              <ShieldCheck className="h-4 w-4" />
            </div>
          </div>

          {isOwner && (
            <Link href="/profile/edit">
              <Button variant="navy" size="default" className="gap-2 shadow-md">
                <Edit className="h-4 w-4" /> Edit Profile
              </Button>
            </Link>
          )}
        </div>

        <div className="space-y-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0a2a4a] dark:text-foreground">
                {profile.full_name || "Food Analyst"}
              </h1>
              <Badge variant="green" className="text-xs uppercase">
                {roleName}
              </Badge>
            </div>
            <p className="text-sm font-semibold text-muted-foreground">
              {profile.title || "Certified Food Safety & Analytical Specialist"}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground font-medium pt-1">
            {orgName && (
              <span className="flex items-center gap-1.5 text-foreground font-semibold">
                <Building2 className="h-4 w-4 text-[#4a9d23]" /> {orgName}
              </span>
            )}
            {profile.location && (
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-muted-foreground" /> {profile.location}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-muted-foreground" /> Joined{" "}
              {new Date(profile.created_at).toLocaleDateString("en-US", {
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-2 pt-2">
            {profile.website && (
              <a
                href={profile.website}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-xl bg-accent hover:bg-[#4a9d23]/10 hover:text-[#4a9d23] transition-colors"
                title="Website"
              >
                <Globe className="h-4 w-4" />
              </a>
            )}
            {profile.linkedin_url && (
              <a
                href={profile.linkedin_url}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-xl bg-accent hover:bg-[#4a9d23]/10 hover:text-[#4a9d23] transition-colors"
                title="LinkedIn Profile"
              >
                <Linkedin className="h-4 w-4" />
              </a>
            )}
            {profile.github_url && (
              <a
                href={profile.github_url}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-xl bg-accent hover:bg-[#4a9d23]/10 hover:text-[#4a9d23] transition-colors"
                title="GitHub Profile"
              >
                <Github className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
