"use client";

import * as React from "react";
import Link from "next/link";
import { Avatar } from "@components/ui/avatar";
import { Badge } from "@components/ui/badge";
import { Card } from "@components/ui/card";
import { MapPin, Building2 } from "lucide-react";
import type { FullProfile } from "@services/profileService";

interface ProfileCardProps {
  profile: FullProfile;
}

export function ProfileCard({ profile }: ProfileCardProps) {
  const name = profile.full_name || profile.username || "Unknown Analyst";
  const avatarUrl = profile.avatar_url || undefined;
  const username = profile.username || profile.id;

  return (
    <Card className="group relative flex h-full flex-col overflow-hidden border border-slate-200 bg-white transition-all duration-300 hover:border-[#4a9d23]/50 hover:shadow-lg">
      {/* Cover Image Placeholder */}
      <div className="relative h-20 w-full bg-linear-to-r from-[#0a2a4a]/90 to-[#153e6b]">
        {profile.cover_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={profile.cover_url}
            alt="Cover"
            className="h-full w-full object-cover opacity-60"
          />
        )}
      </div>

      <div className="relative z-10 -mt-10 flex flex-1 flex-col px-5 pb-5">
        <div className="flex items-start justify-between">
          <Avatar
            src={avatarUrl}
            fallback={name}
            className="h-20 w-20 border-4 border-white shadow-sm"
          />
          <div className="mt-12 flex flex-wrap justify-end gap-1.5">
            {profile.roles && (
              <Badge
                variant="default"
                className="bg-[#0a2a4a] px-2 py-0.5 text-[10px] font-bold text-white hover:bg-[#0a2a4a]/90"
              >
                {profile.roles.name}
              </Badge>
            )}
            {profile.is_verified && (
              <Badge variant="green" className="px-2 py-0.5 text-[10px] font-bold">
                Verified
              </Badge>
            )}
          </div>
        </div>

        <div className="mt-3 flex flex-1 flex-col">
          <Link href={`/u/${username}`} className="transition-colors group-hover:text-[#4a9d23]">
            <h3 className="truncate text-lg leading-tight font-bold text-[#0a2a4a]">{name}</h3>
          </Link>

          <p className="mt-1 line-clamp-2 min-h-[40px] text-sm font-medium text-slate-700">
            {profile.title || profile.headline || "Food Analysis Professional"}
          </p>

          <div className="mt-4 mb-4 flex-1 space-y-2">
            {profile.organizations && (
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <Building2 className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                <span className="truncate font-medium">{profile.organizations.name}</span>
              </div>
            )}

            {profile.location && (
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                <span className="truncate">{profile.location}</span>
              </div>
            )}
          </div>

          {/* Skills */}
          {profile.skills && profile.skills.length > 0 && (
            <div className="mt-auto flex flex-wrap gap-1.5 border-t border-slate-100 pt-4">
              {profile.skills.slice(0, 3).map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-[10px] font-semibold text-slate-600"
                >
                  {skill}
                </span>
              ))}
              {profile.skills.length > 3 && (
                <span className="inline-flex items-center rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-[10px] font-semibold text-slate-500">
                  +{profile.skills.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      <Link
        href={`/u/${username}`}
        className="absolute inset-0 z-20"
        aria-label={`View ${name}'s profile`}
      >
        <span className="sr-only">View Profile</span>
      </Link>
    </Card>
  );
}
