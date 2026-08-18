// services/emailService.ts
// Phase 10A — Email Service Abstraction
// Currently: logs to console in development. Wire in Resend/SendGrid/Supabase
// emails by implementing the send() method without touching callers.

import { env } from "@lib/env";

interface EmailPayload {
  to: string;
  subject: string;
  html: string;
  text: string;
}

class EmailServiceImpl {
  private appName = env.NEXT_PUBLIC_APP_NAME ?? "Food Analyst Forum";
  private appUrl = env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  /** Core send method — replace body with real provider SDK when ready */
  private async send(payload: EmailPayload): Promise<void> {
    if (env.NODE_ENV === "development" || env.NODE_ENV === "test") {
      console.warn("[EmailService] Would send email:", {
        to: payload.to,
        subject: payload.subject,
      });
      return;
    }

    // TODO: Replace with real provider, e.g.:
    // await resend.emails.send({ from: "noreply@foodanalystforum.com", ...payload });
    console.warn("[EmailService] No email provider configured for production.");
  }

  /**
   * Send invitation email to approved applicant.
   * The raw token is embedded in the link — it is NOT stored in the DB.
   */
  async sendInvitationEmail(params: {
    to: string;
    name: string;
    rawToken: string;
    assignedRole: string;
    expiresAt: Date;
  }): Promise<void> {
    const { to, name, rawToken, assignedRole, expiresAt } = params;
    const acceptUrl = `${this.appUrl}/accept-invite?token=${encodeURIComponent(rawToken)}`;
    const expireDate = expiresAt.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    await this.send({
      to,
      subject: `You're invited to join ${this.appName}`,
      html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Your Invitation to ${this.appName}</title></head>
<body style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;background:#f9fafb;">
  <div style="background:#0a2a4a;border-radius:12px 12px 0 0;padding:32px 40px;text-align:center;">
    <h1 style="color:#fff;margin:0;font-size:24px;">🧪 Food Analyst Forum</h1>
    <p style="color:#4a9d23;margin:8px 0 0;font-size:14px;">Connect · Learn · Share · Grow</p>
  </div>
  <div style="background:#fff;border-radius:0 0 12px 12px;padding:40px;border:1px solid #e5e7eb;border-top:none;">
    <h2 style="color:#0a2a4a;margin-top:0;">Welcome, ${name}!</h2>
    <p style="color:#374151;line-height:1.6;">
      Your application to join <strong>${this.appName}</strong> has been reviewed and approved.
      You have been assigned the role of <strong>${assignedRole}</strong>.
    </p>
    <p style="color:#374151;line-height:1.6;">
      Click the button below to create your account and join our community of food analysts,
      laboratory professionals, and industry experts.
    </p>
    <div style="text-align:center;margin:32px 0;">
      <a href="${acceptUrl}"
         style="background:#4a9d23;color:#fff;padding:14px 32px;border-radius:8px;
                text-decoration:none;font-weight:bold;font-size:16px;display:inline-block;">
        Accept Invitation
      </a>
    </div>
    <p style="color:#6b7280;font-size:13px;line-height:1.6;">
      This invitation expires on <strong>${expireDate}</strong>. After that date, the link
      will no longer be valid. If you need a new invitation, please contact the FAF team.
    </p>
    <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;">
    <p style="color:#9ca3af;font-size:12px;text-align:center;">
      If you did not request this invitation, please ignore this email.<br>
      Food Analyst Forum · <a href="${this.appUrl}" style="color:#4a9d23;">${this.appUrl}</a>
    </p>
  </div>
</body>
</html>`,
      text: `
Welcome to ${this.appName}, ${name}!

Your application has been approved. Your assigned role is: ${assignedRole}.

Accept your invitation here:
${acceptUrl}

This link expires on ${expireDate}.

If you did not request this, please ignore this email.
      `.trim(),
    });
  }

  /** Confirmation email to applicant after submission */
  async sendRequestReceivedEmail(params: { to: string; name: string }): Promise<void> {
    const { to, name } = params;

    await this.send({
      to,
      subject: `Your invitation request has been received — ${this.appName}`,
      html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;background:#f9fafb;">
  <div style="background:#0a2a4a;border-radius:12px 12px 0 0;padding:32px 40px;text-align:center;">
    <h1 style="color:#fff;margin:0;font-size:24px;">🧪 Food Analyst Forum</h1>
  </div>
  <div style="background:#fff;border-radius:0 0 12px 12px;padding:40px;border:1px solid #e5e7eb;border-top:none;">
    <h2 style="color:#0a2a4a;margin-top:0;">Request Received, ${name}!</h2>
    <p style="color:#374151;line-height:1.6;">
      Thank you for applying to join <strong>${this.appName}</strong>. We have received your
      invitation request and our team will review it shortly.
    </p>
    <p style="color:#374151;line-height:1.6;">
      FAF is a curated professional community. Your request will be reviewed carefully.
      If approved, you will receive a secure invitation link at this email address.
    </p>
    <p style="color:#6b7280;font-size:13px;">
      Please note: We cannot guarantee approval or provide a specific timeline.
    </p>
  </div>
</body>
</html>`,
      text: `
Thank you for applying to ${this.appName}, ${name}!

We have received your invitation request. Our team will review it and if approved,
you will receive a secure invitation link at this email.

FAF is a curated professional community.
      `.trim(),
    });
  }
}

export const EmailService = new EmailServiceImpl();
