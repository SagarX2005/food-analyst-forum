"use client";

import * as React from "react";
import Link from "next/link";
import { FullRecruiterApplication } from "@services/recruiterVerificationService";
import { Card } from "@components/ui/card";
import { Badge } from "@components/ui/badge";
import { Button } from "@components/ui/button";

export function RecruiterApplicationTable({
  applications,
}: {
  applications: FullRecruiterApplication[];
}) {
  if (applications.length === 0) {
    return (
      <Card className="flex flex-col items-center justify-center p-12 text-center">
        <h2 className="text-lg font-semibold text-slate-700">No pending recruiter applications</h2>
        <p className="mt-2 text-sm text-slate-500">New Recruiter applications will appear here when users apply.</p>
      </Card>
    );
  }

  return (
    <div className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 text-slate-500">
          <tr>
            <th className="px-4 py-3 font-semibold">Applicant</th>
            <th className="px-4 py-3 font-semibold">Organization</th>
            <th className="px-4 py-3 font-semibold">Position</th>
            <th className="px-4 py-3 font-semibold">Date</th>
            <th className="px-4 py-3 font-semibold">Status</th>
            <th className="px-4 py-3 font-semibold text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {applications.map((app) => (
            <tr key={app.id} className="transition-colors hover:bg-slate-50">
              <td className="px-4 py-3">
                <div className="font-medium text-slate-900">{app.user?.full_name || "Unknown User"}</div>
                <div className="text-xs text-slate-500">{app.user?.email}</div>
              </td>
              <td className="px-4 py-3">
                <div className="text-slate-900">{app.organization_name}</div>
                {app.organization_type && <div className="text-xs text-slate-500">{app.organization_type}</div>}
              </td>
              <td className="px-4 py-3 text-slate-700">{app.position}</td>
              <td className="px-4 py-3 text-slate-500">
                {new Date(app.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </td>
              <td className="px-4 py-3">
                <Badge variant={app.status === "pending" ? "default" : app.status === "approved" ? "green" : "secondary"}>
                  {app.status.replace(/_/g, " ")}
                </Badge>
              </td>
              <td className="px-4 py-3 text-right">
                <Link href={`/admin/recruiter-verification/${app.id}`}>
                  <Button size="sm" variant="outline" className="text-xs">
                    Review
                  </Button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
