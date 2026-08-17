import { Card, CardHeader, CardTitle, CardContent } from "@components/ui/card";
import { Badge } from "@components/ui/badge";
import { Award, Wrench } from "lucide-react";
import type { FullProfile } from "@services/profileService";

export function ProfileSkills({ profile }: { profile: FullProfile }) {
  const skills = Array.isArray(profile.skills) ? profile.skills : ["HPLC", "LC-MS/MS", "ISO 17025", "Microbiology"];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg text-[#0a2a4a] dark:text-foreground flex items-center gap-2">
          <Wrench className="h-5 w-5 text-[#4a9d23]" />
          Skills & Technical Competencies
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {skills.map((skill: string, i: number) => (
            <Badge key={i} variant="outline" className="px-3 py-1 text-xs border-[#4a9d23]/30">
              <Award className="h-3.5 w-3.5 text-[#4a9d23] mr-1.5" />
              {String(skill)}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
