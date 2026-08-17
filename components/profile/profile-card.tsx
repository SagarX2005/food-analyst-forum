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
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg border border-slate-200 hover:border-[#4a9d23]/50 group bg-white relative h-full flex flex-col">
      {/* Cover Image Placeholder */}
      <div className="h-20 w-full bg-linear-to-r from-[#0a2a4a]/90 to-[#153e6b] relative">
        {profile.cover_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img 
            src={profile.cover_url} 
            alt="Cover" 
            className="w-full h-full object-cover opacity-60"
          />
        )}
      </div>
      
      <div className="px-5 pb-5 flex-1 flex flex-col relative z-10 -mt-10">
        <div className="flex justify-between items-start">
          <Avatar 
            src={avatarUrl} 
            fallback={name} 
            className="h-20 w-20 border-4 border-white shadow-sm"
          />
          <div className="mt-12 flex gap-1.5 flex-wrap justify-end">
            {profile.roles && (
              <Badge variant="default" className="text-[10px] font-bold px-2 py-0.5 bg-[#0a2a4a] hover:bg-[#0a2a4a]/90 text-white">
                {profile.roles.name}
              </Badge>
            )}
            {profile.is_verified && (
              <Badge variant="green" className="text-[10px] font-bold px-2 py-0.5">
                Verified
              </Badge>
            )}
          </div>
        </div>

        <div className="mt-3 flex-1 flex flex-col">
          <Link href={`/u/${username}`} className="group-hover:text-[#4a9d23] transition-colors">
            <h3 className="text-lg font-bold text-[#0a2a4a] leading-tight truncate">
              {name}
            </h3>
          </Link>
          
          <p className="text-sm font-medium text-slate-700 mt-1 line-clamp-2 min-h-[40px]">
            {profile.title || profile.headline || "Food Analysis Professional"}
          </p>

          <div className="mt-4 space-y-2 mb-4 flex-1">
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
            <div className="mt-auto pt-4 border-t border-slate-100 flex gap-1.5 flex-wrap">
              {profile.skills.slice(0, 3).map((skill) => (
                <span key={skill} className="inline-flex items-center rounded-md bg-slate-50 px-2 py-1 text-[10px] font-semibold text-slate-600 border border-slate-200">
                  {skill}
                </span>
              ))}
              {profile.skills.length > 3 && (
                <span className="inline-flex items-center rounded-md bg-slate-50 px-2 py-1 text-[10px] font-semibold text-slate-500 border border-slate-200">
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
