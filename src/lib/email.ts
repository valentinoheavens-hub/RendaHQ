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

// ─── Branded email template ────────────────────────────────────────────────────
// Table-based + inline styles for maximum email-client compatibility.
const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export const renderEmail = (opts: {
  heading: string;
  // Each string becomes a paragraph; pass pre-built HTML via `rawHtml` instead.
  paragraphs?: string[];
  rawHtml?: string;
  cta?: { label: string; url: string };
  footerNote?: string;
}): string => {
  const body =
    opts.rawHtml ??
    (opts.paragraphs ?? [])
      .map(
        (p) =>
          `<p style="margin:0 0 16px;font-size:15px;line-height:1.65;color:#334155;">${p}</p>`
      )
      .join('');

  const button = opts.cta
    ? `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:8px 0 4px;">
         <tr><td style="border-radius:10px;background:#059669;">
           <a href="${opts.cta.url}" style="display:inline-block;padding:13px 26px;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:10px;">${escapeHtml(
             opts.cta.label
           )}</a>
         </td></tr>
       </table>`
    : '';

  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f1f5f9;-webkit-font-smoothing:antialiased;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;">
    <tr><td align="center" style="padding:32px 16px;font-family:-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:540px;">
        <!-- Brand -->
        <tr><td align="center" style="padding:4px 0 22px;">
          <span style="font-size:22px;font-weight:800;letter-spacing:-0.5px;color:#059669;">Renda<span style="color:#0f172a;">HQ</span></span>
        </td></tr>
        <!-- Card -->
        <tr><td style="background:#ffffff;border:1px solid #e2e8f0;border-radius:16px;padding:32px;">
          <h1 style="margin:0 0 18px;font-size:21px;font-weight:700;color:#0f172a;">${escapeHtml(
            opts.heading
          )}</h1>
          ${body}
          ${button}
        </td></tr>
        <!-- Footer -->
        <tr><td align="center" style="padding:22px 8px 4px;">
          <p style="margin:0 0 4px;font-size:13px;font-weight:600;color:#059669;">Build. Bill. Get paid.</p>
          <p style="margin:0;font-size:12px;color:#94a3b8;">${
            opts.footerNote ??
            'Sent via RendaHQ — the business OS for freelancers &amp; agencies.'
          }</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
};

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
    subject: 'RendaHQ email is working',
    body: renderEmail({
      heading: 'Your email is connected 🎉',
      paragraphs: ['This is a test from RendaHQ. If you can read this, transactional email is wired up correctly.'],
    }),
  });

// ─── Send Invoice Reminder ────────────────────────────────────────────────────
export const sendInvoiceReminder = async (opts: {
  clientEmail: string;
  clientName: string;
  invoiceId: string;
  amount: string;
  dueDate: string;
  body: string;          // plain-text reminder (e.g. AI-drafted); newlines become breaks
  invoiceUrl?: string;
}): Promise<SendEmailResult> => {
  const html = renderEmail({
    heading: `Payment reminder — ${opts.amount}`,
    rawHtml: `<p style="margin:0 0 16px;font-size:15px;line-height:1.65;color:#334155;">${opts.body.replace(
      /\n/g,
      '<br/>'
    )}</p>
      <p style="margin:0 0 16px;font-size:14px;color:#64748b;">Invoice <strong>${opts.invoiceId}</strong> · due ${opts.dueDate}</p>`,
    cta: opts.invoiceUrl ? { label: 'View & pay invoice', url: opts.invoiceUrl } : undefined,
  });

  return sendEmail({
    to: opts.clientEmail,
    subject: `Payment Reminder — Invoice ${opts.invoiceId} (${opts.amount} due ${opts.dueDate})`,
    body: html,
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
  const html = renderEmail({
    heading: 'Contract ready for review',
    paragraphs: [
      `Hi ${opts.clientName},`,
      opts.message ??
        `Please review and sign the contract: <strong>${opts.contractTitle}</strong>.`,
    ],
    cta: opts.contractUrl ? { label: 'Review & sign contract', url: opts.contractUrl } : undefined,
  });

  return sendEmail({
    to: opts.clientEmail,
    subject: `Contract Ready: ${opts.contractTitle}`,
    body: html,
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
  const html = renderEmail({
    heading: 'Your project proposal',
    paragraphs: [
      `Hi ${opts.clientName},`,
      opts.message ??
        `I've prepared a proposal for <strong>${opts.projectTitle}</strong>. Take a look whenever you're ready.`,
    ],
    cta: opts.proposalUrl ? { label: 'View proposal', url: opts.proposalUrl } : undefined,
  });

  return sendEmail({
    to: opts.clientEmail,
    subject: `Project Proposal: ${opts.projectTitle}`,
    body: html,
    fromName: 'RendaHQ',
  });
};
