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
    <div className="border-border/60 bg-card relative overflow-hidden rounded-3xl border shadow-lg">
      {/* Cover Image Banner */}
      <div className="relative h-44 w-full bg-gradient-to-r from-[#0a2a4a] via-[#113a63] to-[#4a9d23] sm:h-56">
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
      <div className="relative px-6 pt-0 pb-6">
        <div className="-mt-16 mb-4 flex flex-col items-start justify-between gap-4 sm:-mt-20 sm:flex-row sm:items-end">
          <div className="relative">
            <div className="border-card bg-background h-28 w-28 overflow-hidden rounded-full border-4 shadow-2xl sm:h-36 sm:w-36">
              <Avatar
                src={profile.avatar_url || undefined}
                fallback={profile.full_name || "User"}
                size="lg"
                className="h-full w-full"
              />
            </div>
            <div
              className="absolute right-1 bottom-1 rounded-full bg-[#4a9d23] p-1.5 text-white shadow-md"
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
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="dark:text-foreground text-2xl font-extrabold text-[#0a2a4a] sm:text-3xl">
                {profile.full_name || "Food Analyst"}
              </h1>
              <Badge variant="green" className="text-xs uppercase">
                {roleName}
              </Badge>
            </div>
            <p className="text-muted-foreground text-sm font-semibold">
              {profile.title || profile.headline || "Certified Food Safety & Analytical Specialist"}
            </p>
          </div>

          <div className="text-muted-foreground flex flex-wrap items-center gap-4 pt-1 text-xs font-medium">
            {orgName && (
              <span className="text-foreground flex items-center gap-1.5 font-semibold">
                <Building2 className="h-4 w-4 text-[#4a9d23]" /> {orgName}
              </span>
            )}
            {profile.location && (
              <span className="flex items-center gap-1.5">
                <MapPin className="text-muted-foreground h-4 w-4" /> {profile.location}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Calendar className="text-muted-foreground h-4 w-4" /> Joined{" "}
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
                className="bg-accent rounded-xl p-2 transition-colors hover:bg-[#4a9d23]/10 hover:text-[#4a9d23]"
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
                className="bg-accent rounded-xl p-2 transition-colors hover:bg-[#4a9d23]/10 hover:text-[#4a9d23]"
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
                className="bg-accent rounded-xl p-2 transition-colors hover:bg-[#4a9d23]/10 hover:text-[#4a9d23]"
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
