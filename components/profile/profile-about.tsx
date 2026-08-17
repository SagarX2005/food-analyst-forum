import { Card, CardHeader, CardTitle, CardContent } from "@components/ui/card";
import { User } from "lucide-react";
import type { FullProfile } from "@services/profileService";

export function ProfileAbout({ profile }: { profile: FullProfile }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg text-[#0a2a4a] dark:text-foreground flex items-center gap-2">
          <User className="h-5 w-5 text-[#4a9d23]" />
          About & Professional Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
          {profile.bio ||
            "No professional bio added yet. Edit your profile to share your laboratory background, testing specializations, and analytical accomplishments."}
        </p>
      </CardContent>
    </Card>
  );
}
