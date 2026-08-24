"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FullRecruiterApplication } from "@services/recruiterVerificationService";
import { approveApplicationAction, rejectApplicationAction, requestMoreInfoAction } from "../../actions";
import { Button } from "@components/ui/button";
import { Card } from "@components/ui/card";
import { Badge } from "@components/ui/badge";
import { Dialog } from "@components/ui/dialog";
import { Textarea } from "@components/ui/textarea";
import { ArrowLeft, Building2, User, FileText, CheckCircle, XCircle, AlertTriangle } from "lucide-react";

export function RecruiterApplicationDetails({ application }: { application: FullRecruiterApplication }) {
  const router = useRouter();
  const [isApproving, setIsApproving] = React.useState(false);
  
  const [rejectDialogOpen, setRejectDialogOpen] = React.useState(false);
  const [rejectReason, setRejectReason] = React.useState("");
  const [isRejecting, setIsRejecting] = React.useState(false);
  
  const [moreInfoDialogOpen, setMoreInfoDialogOpen] = React.useState(false);
  const [moreInfoRequest, setMoreInfoRequest] = React.useState("");
  const [isRequesting, setIsRequesting] = React.useState(false);

  const handleApprove = async () => {
    setIsApproving(true);
    const result = await approveApplicationAction(application.id);
    setIsApproving(false);
    if (result.success) {
      router.refresh();
    } else {
      alert(result.error);
    }
  };

  const handleReject = async () => {
    setIsRejecting(true);
    const result = await rejectApplicationAction(application.id, rejectReason);
    setIsRejecting(false);
    if (result.success) {
      setRejectDialogOpen(false);
      router.refresh();
    } else {
      alert(result.error);
    }
  };

  const handleRequestMoreInfo = async () => {
    setIsRequesting(true);
    const result = await requestMoreInfoAction(application.id, moreInfoRequest);
    setIsRequesting(false);
    if (result.success) {
      setMoreInfoDialogOpen(false);
      router.refresh();
    } else {
      alert(result.error);
    }
  };

  const isActive = application.status === "pending" || application.status === "more_information_required";

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/recruiter-verification">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Application Details</h1>
          <p className="text-sm text-slate-500">
            Submitted on {new Date(application.created_at).toLocaleDateString()}
          </p>
        </div>
        <div className="ml-auto">
          <Badge variant={application.status === "pending" ? "default" : application.status === "approved" ? "green" : "secondary"}>
            {application.status.replace(/_/g, " ")}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
            <User className="h-5 w-5 text-indigo-500" />
            <h2 className="font-semibold text-slate-800">Applicant Information</h2>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Name</p>
            <p className="text-slate-900">{application.user?.full_name || "Unknown"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Email</p>
            <p className="text-slate-900">{application.user?.email}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Current Role</p>
            <p className="text-slate-900">{application.user?.roles?.name || "None"}</p>
          </div>
        </Card>

        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
            <Building2 className="h-5 w-5 text-indigo-500" />
            <h2 className="font-semibold text-slate-800">Organization Details</h2>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Organization Name</p>
            <p className="text-slate-900">{application.organization_name}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Website</p>
            <p className="text-slate-900">{application.organization_website || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Type</p>
            <p className="text-slate-900">{application.organization_type || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Location</p>
            <p className="text-slate-900">{application.location || "N/A"}</p>
          </div>
        </Card>
      </div>

      <Card className="p-6 space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
          <FileText className="h-5 w-5 text-indigo-500" />
          <h2 className="font-semibold text-slate-800">Role & Evidence</h2>
        </div>
        <div>
          <p className="text-sm font-medium text-slate-500">Position / Job Title</p>
          <p className="text-slate-900">{application.position}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-slate-500">Verification Evidence</p>
          <div className="mt-2 rounded-md bg-slate-50 p-4 text-sm text-slate-700 whitespace-pre-wrap">
            {application.evidence || "No evidence provided."}
          </div>
        </div>
      </Card>

      {application.rejection_reason && (
        <Card className="border-rose-200 bg-rose-50/50 p-6">
          <h2 className="font-semibold text-rose-800">Rejection Reason</h2>
          <p className="mt-2 text-sm text-rose-700">{application.rejection_reason}</p>
        </Card>
      )}

      {application.more_info_request && (
        <Card className="border-amber-200 bg-amber-50/50 p-6">
          <h2 className="font-semibold text-amber-800">More Information Requested</h2>
          <p className="mt-2 text-sm text-amber-700">{application.more_info_request}</p>
        </Card>
      )}

      {isActive && (
        <div className="flex flex-wrap gap-4 pt-4">
          <Button onClick={handleApprove} disabled={isApproving} className="bg-emerald-600 hover:bg-emerald-700">
            <CheckCircle className="mr-2 h-4 w-4" />
            {isApproving ? "Approving..." : "Approve Recruiter"}
          </Button>
          
          <Button onClick={() => setMoreInfoDialogOpen(true)} variant="outline" className="text-amber-600 border-amber-200 hover:bg-amber-50">
            <AlertTriangle className="mr-2 h-4 w-4" />
            Request Info
          </Button>
          
          <Button onClick={() => setRejectDialogOpen(true)} variant="outline" className="text-rose-600 border-rose-200 hover:bg-rose-50">
            <XCircle className="mr-2 h-4 w-4" />
            Reject Application
          </Button>
        </div>
      )}

      <Dialog 
        isOpen={rejectDialogOpen} 
        onClose={() => setRejectDialogOpen(false)}
        title="Reject Application"
        description="Provide a reason for rejecting this recruiter application. The applicant will be notified."
      >
        <div className="space-y-4 pt-4">
          <Textarea 
            placeholder="Reason for rejection..." 
            value={rejectReason} 
            onChange={(e) => setRejectReason(e.target.value)}
            className="min-h-[100px]"
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleReject} disabled={isRejecting || !rejectReason.trim()}>
              {isRejecting ? "Rejecting..." : "Confirm Rejection"}
            </Button>
          </div>
        </div>
      </Dialog>

      <Dialog 
        isOpen={moreInfoDialogOpen} 
        onClose={() => setMoreInfoDialogOpen(false)}
        title="Request More Information"
        description="Specify what additional information or evidence is required from the applicant."
      >
        <div className="space-y-4 pt-4">
          <Textarea 
            placeholder="Please provide..." 
            value={moreInfoRequest} 
            onChange={(e) => setMoreInfoRequest(e.target.value)}
            className="min-h-[100px]"
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setMoreInfoDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleRequestMoreInfo} disabled={isRequesting || !moreInfoRequest.trim()}>
              {isRequesting ? "Sending..." : "Send Request"}
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
