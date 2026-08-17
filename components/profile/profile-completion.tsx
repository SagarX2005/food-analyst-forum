import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { CheckCircle2, ArrowRight, Sparkles } from "lucide-react";
import type { ProfileCompletionResult } from "@services/profileService";

export function ProfileCompletion({ completion }: { completion: ProfileCompletionResult }) {
  const { percentage, missingSteps } = completion;

  return (
    <Card className="border-2 border-[#4a9d23]/30 bg-gradient-to-br from-card to-[#4a9d23]/5">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base text-[#0a2a4a] dark:text-foreground flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-[#4a9d23]" />
            Profile Completion
          </CardTitle>
          <span className="text-xl font-extrabold text-[#4a9d23]">{percentage}%</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress Bar */}
        <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
          <div
            className="bg-[#4a9d23] h-full transition-all duration-500 rounded-full"
            style={{ width: `${percentage}%` }}
          />
        </div>

        {missingSteps.length > 0 ? (
          <div className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground">Suggested enhancements:</p>
            <ul className="space-y-1 text-xs text-foreground">
              {missingSteps.slice(0, 3).map((step, idx) => (
                <li key={idx} className="flex items-center gap-1.5">
                  <span className="text-[#4a9d23]">•</span> Add your {step.toLowerCase()}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-xs font-semibold text-[#4a9d23]">
            <CheckCircle2 className="h-4 w-4" /> Your profile is 100% complete! Excellent visibility.
          </div>
        )}

        {percentage < 100 && (
          <Link href="/profile/edit" className="block pt-1">
            <Button variant="green" size="sm" className="w-full justify-center gap-2">
              Complete Profile <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        )}
      </CardContent>
    </Card>
  );
}
