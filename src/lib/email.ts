// All email is sent server-side via the `send-email` Supabase Edge Function.
// The Resend API key never touches the browser. The function requires a valid
// user JWT (added automatically by supabase.functions.invoke), so it can't be
// abused as an open relay.
import { supabase } from '@/lib/supabase';

// ─── Types ────────────────────────────────────────────────────────────────────
export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  body: string;          // plain-text or HTML
  fromName?: string;     // defaults to "RendaHQ"
  replyTo?: string;
}

export interface SendEmailResult {
  success: boolean;
  id?: string;
  error?: string;
}

// ─── Send Email ───────────────────────────────────────────────────────────────
export const sendEmail = async (opts: SendEmailOptions): Promise<SendEmailResult> => {
  try {
    const { data, error } = await supabase.functions.invoke('send-email', {
      body: {
        to: opts.to,
        subject: opts.subject,
        body: opts.body,
        fromName: opts.fromName,
        replyTo: opts.replyTo,
      },
    });

    if (error) return { success: false, error: error.message };
    if (data?.error) return { success: false, error: data.error };
    return { success: true, id: data?.id };
  } catch (err: any) {
    return { success: false, error: err?.message ?? 'Failed to send email.' };
  }
};

// ─── Quick test helper ────────────────────────────────────────────────────────
export const sendTestEmail = () =>
  sendEmail({
    to: 'valentinoheavens@gmail.com',
    subject: 'Hello World',
    body: '<p>Congrats on sending your <strong>first email</strong>!</p>',
  });

// ─── Send Invoice Reminder ────────────────────────────────────────────────────
export const sendInvoiceReminder = async (opts: {
  clientEmail: string;
  clientName: string;
  invoiceId: string;
  amount: string;
  dueDate: string;
  body: string;
}): Promise<SendEmailResult> => {
  return sendEmail({
    to: opts.clientEmail,
    subject: `Payment Reminder — Invoice ${opts.invoiceId} (${opts.amount} due ${opts.dueDate})`,
    body: opts.body,
    fromName: 'RendaHQ Billing',
  });
};

// ─── Send Contract for Signing ────────────────────────────────────────────────
export const sendContractForSigning = async (opts: {
  clientEmail: string;
  clientName: string;
  contractTitle: string;
  message?: string;
  contractUrl?: string;
}): Promise<SendEmailResult> => {
  const body = `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px">
      <h2 style="color:#0f172a">Contract Ready for Review</h2>
      <p>Hi ${opts.clientName},</p>
      <p>${opts.message ?? `Please review and sign the attached contract: <strong>${opts.contractTitle}</strong>.`}</p>
      ${opts.contractUrl ? `<p><a href="${opts.contractUrl}" style="background:#059669;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;display:inline-block;margin-top:8px">Review & Sign Contract</a></p>` : ''}
      <p style="margin-top:32px;color:#64748b;font-size:14px">Sent via RendaHQ — Build. Bill. Get paid.</p>
    </div>
  `;

  return sendEmail({
    to: opts.clientEmail,
    subject: `Contract Ready: ${opts.contractTitle}`,
    body,
    fromName: 'RendaHQ',
  });
};

// ─── Send Proposal ────────────────────────────────────────────────────────────
export const sendProposal = async (opts: {
  clientEmail: string;
  clientName: string;
  projectTitle: string;
  message?: string;
  proposalUrl?: string;
}): Promise<SendEmailResult> => {
  const body = `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px">
      <h2 style="color:#0f172a">Your Project Proposal</h2>
      <p>Hi ${opts.clientName},</p>
      <p>${opts.message ?? `I've prepared a proposal for <strong>${opts.projectTitle}</strong>. Please review it at your convenience.`}</p>
      ${opts.proposalUrl ? `<p><a href="${opts.proposalUrl}" style="background:#059669;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;display:inline-block;margin-top:8px">View Proposal</a></p>` : ''}
      <p style="margin-top:32px;color:#64748b;font-size:14px">Sent via RendaHQ — Build. Bill. Get paid.</p>
    </div>
  `;

  return sendEmail({
    to: opts.clientEmail,
    subject: `Project Proposal: ${opts.projectTitle}`,
    body,
    fromName: 'RendaHQ',
  });
};
