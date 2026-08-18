"use client";

import * as React from "react";
import { Settings, Shield, Bell, Key, Trash2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Checkbox } from "@components/ui/checkbox";
import { useAuth } from "@hooks/use-auth";

export default function SettingsPage() {
  const { user, resetPassword } = useAuth();
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [msg, setMsg] = React.useState<string | null>(null);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMsg("Passwords do not match.");
      return;
    }
    try {
      await resetPassword(newPassword);
      setMsg("Password successfully updated.");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      setMsg("Failed to update password.");
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8 py-4">
      <div className="space-y-1">
        <h1 className="dark:text-foreground flex items-center gap-2 text-3xl font-extrabold text-[#0a2a4a]">
          <Settings className="h-7 w-7 text-[#4a9d23]" /> Account & Security Settings
        </h1>
        <p className="text-muted-foreground text-sm">
          Manage your password, login sessions, email alerts, and privacy preferences.
        </p>
      </div>

      {msg && (
        <div className="rounded-xl border border-[#4a9d23]/30 bg-[#4a9d23]/10 p-3.5 text-xs font-semibold text-[#4a9d23]">
          {msg}
        </div>
      )}

      {/* ACCOUNT DETAILS */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="dark:text-foreground flex items-center gap-2 text-lg text-[#0a2a4a]">
            <Shield className="h-5 w-5 text-[#4a9d23]" /> Account Security
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-foreground mb-1 block text-xs font-semibold">
              Registered Email Address
            </label>
            <Input value={user?.email || ""} disabled className="bg-muted" />
          </div>

          <form onSubmit={handlePasswordChange} className="space-y-3 pt-2">
            <h4 className="dark:text-foreground flex items-center gap-1.5 text-xs font-bold tracking-wider text-[#0a2a4a] uppercase">
              <Key className="h-4 w-4 text-[#4a9d23]" /> Change Password
            </h4>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <Input
                type="password"
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <div className="flex justify-end pt-1">
              <Button type="submit" variant="navy" size="default">
                Update Password
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* NOTIFICATION PREFERENCES */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="dark:text-foreground flex items-center gap-2 text-lg text-[#0a2a4a]">
            <Bell className="h-5 w-5 text-[#4a9d23]" /> Email & Notification Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-xs">
          <div className="flex items-center gap-3">
            <Checkbox id="emailForum" defaultChecked />
            <label htmlFor="emailForum" className="text-foreground cursor-pointer font-semibold">
              Email notifications when someone replies to your forum questions
            </label>
          </div>
          <div className="flex items-center gap-3">
            <Checkbox id="emailRegulatory" defaultChecked />
            <label
              htmlFor="emailRegulatory"
              className="text-foreground cursor-pointer font-semibold"
            >
              Weekly FSSAI regulatory advisories & NABL 17025 updates digest
            </label>
          </div>
        </CardContent>
      </Card>

      {/* DANGER ZONE */}
      <Card className="border-destructive/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-destructive flex items-center gap-2 text-lg">
            <Trash2 className="h-5 w-5" /> Danger Zone
          </CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground space-y-3 text-xs">
          <p>
            Once you delete your account, your professional profile, uploaded SOP references, and
            certificate records will be permanently removed.
          </p>
          <Button variant="destructive" size="default" className="gap-2">
            <Trash2 className="h-4 w-4" /> Delete Account
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
