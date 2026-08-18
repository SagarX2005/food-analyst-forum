import { Card, CardHeader, CardTitle, CardContent } from "@components/ui/card";
import { Badge } from "@components/ui/badge";
import { Award, Wrench } from "lucide-react";
import type { FullProfile } from "@services/profileService";

export function ProfileSkills({ profile }: { profile: FullProfile }) {
  const skills = Array.isArray(profile.skills)
    ? profile.skills
    : ["HPLC", "LC-MS/MS", "ISO 17025", "Microbiology"];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="dark:text-foreground flex items-center gap-2 text-lg text-[#0a2a4a]">
          <Wrench className="h-5 w-5 text-[#4a9d23]" />
          Skills & Technical Competencies
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {skills.map((skill: string, i: number) => (
            <Badge key={i} variant="outline" className="border-[#4a9d23]/30 px-3 py-1 text-xs">
              <Award className="mr-1.5 h-3.5 w-3.5 text-[#4a9d23]" />
              {String(skill)}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
