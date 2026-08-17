// app/admin/invitations/[id]/page.tsx
// Phase 10A — Admin: Single access request detail view

import { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@lib/supabase/server";
import { InvitationDetails } from "@components/invitations/invitation-details";
import type { AccessRequest } from "@features/invitations/types";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();

  const { data } = await supabase
    .from("access_requests")
    .select("full_name")
    .eq("id", id)
    .single();

  return {
    title: data?.full_name
      ? `Review: ${data.full_name as string} — Admin`
      : "Access Request Detail — Admin",
  };
}

export const dynamic = "force-dynamic";

async function getRequest(id: string): Promise<AccessRequest | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("access_requests")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return data as AccessRequest;
}

export default async function AdminInvitationDetailPage({ params }: PageProps) {
  const { id }    = await params;
  const request   = await getRequest(id);

  if (!request) {
    notFound();
  }

  return (
    <div className="py-4">
      <InvitationDetails request={request} />
    </div>
  );
}
