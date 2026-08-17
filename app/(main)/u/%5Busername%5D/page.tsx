import { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProfileService } from "@services/profileService";
import { ProfileHeader } from "@components/profile/profile-header";
import { ProfileAbout } from "@components/profile/profile-about";
import { ProfileSkills } from "@components/profile/profile-skills";

interface PageProps {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { username } = await params;
  const profile = await ProfileService.getProfileByUsername(username);

  if (!profile) {
    return {
      title: "Member Profile Not Found",
      description: "The requested food analyst profile does not exist.",
    };
  }

  const name = profile.full_name || "Food Analyst Professional";
  const title = profile.title || profile.headline || "Food Analyst & Laboratory Specialist";
  const description = profile.bio || `${name} is a certified food analyst and laboratory professional on Food Analyst Forum.`;

  return {
    title: `${name} (${title})`,
    description,
    openGraph: {
      title: `${name} — Food Analyst Forum`,
      description,
      images: profile.avatar_url ? [{ url: profile.avatar_url }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: `${name} — Food Analyst Forum`,
      description,
    },
  };
}

export default async function PublicProfilePage({ params }: PageProps) {
  const { username } = await params;
  const profile = await ProfileService.getProfileByUsername(username);

  if (!profile) {
    notFound();
  }

  // Generate JSON-LD Structured Data for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.full_name,
    jobTitle: profile.title || profile.headline,
    worksFor: profile.organizations
      ? {
          "@type": "Organization",
          name: profile.organizations.name,
        }
      : undefined,
    url: `https://foodanalystforum.in/u/${profile.username || profile.id}`,
    image: profile.avatar_url,
    description: profile.bio,
  };

  return (
    <div className="space-y-8 py-4">
      {/* JSON-LD SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <ProfileHeader profile={profile} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          <ProfileAbout profile={profile} />
        </div>
        <div className="lg:col-span-4 space-y-8">
          <ProfileSkills profile={profile} />
        </div>
      </div>
    </div>
  );
}
