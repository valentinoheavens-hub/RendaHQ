import { Resend } from 'resend';

const apiKey = import.meta.env.VITE_RESEND_API_KEY;

const resend = new Resend(apiKey);

// ─── Quick test (matches the Resend quickstart exactly) ───────────────────────
export const sendTestEmail = () =>
  resend.emails.send({
    from: 'onboarding@resend.dev',
    to: 'valentinoheavens@gmail.com',
    subject: 'Hello World',
    html: '<p>Congrats on sending your <strong>first email</strong>!</p>',
  });

// ─── Guard ────────────────────────────────────────────────────────────────────
const guardKey = () => {
  if (!apiKey) {
    throw new Error('Email service is not configured. Please check your environment setup.');
  }
};

// ─── Types ────────────────────────────────────────────────────────────────────
export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  body: string;          // plain-text or HTML
  fromName?: string;     // defaults to "NexWork"
  replyTo?: string;
}

export interface SendEmailResult {
  success: boolean;
  id?: string;
  error?: string;
}

// ─── Send Email ───────────────────────────────────────────────────────────────
export const sendEmail = async (opts: SendEmailOptions): Promise<SendEmailResult> => {
  guardKey();

  const from = opts.fromName && opts.fromName !== 'NexWork'
    ? `${opts.fromName} <onboarding@resend.dev>`
    : 'onboarding@resend.dev';

  try {
    const { data, error } = await resend.emails.send({
      from,
      to: Array.isArray(opts.to) ? opts.to : [opts.to],
      subject: opts.subject,
      html: opts.body.includes('<') ? opts.body : `<p style="font-family:sans-serif;line-height:1.6">${opts.body.replace(/\n/g, '<br/>')}</p>`,
      reply_to: opts.replyTo,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, id: data?.id };
  } catch (err: any) {
    return { success: false, error: err.message ?? 'Failed to send email.' };
  }
};

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
    fromName: 'NexWork Billing',
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
      <h2 style="color:#1e1b4b">Contract Ready for Review</h2>
      <p>Hi ${opts.clientName},</p>
      <p>${opts.message ?? `Please review and sign the attached contract: <strong>${opts.contractTitle}</strong>.`}</p>
      ${opts.contractUrl ? `<p><a href="${opts.contractUrl}" style="background:#4f46e5;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;display:inline-block;margin-top:8px">Review & Sign Contract</a></p>` : ''}
      <p style="margin-top:32px;color:#64748b;font-size:14px">Sent via NexWork — Professional Business OS</p>
    </div>
  `;

  return sendEmail({
    to: opts.clientEmail,
    subject: `Contract Ready: ${opts.contractTitle}`,
    body,
    fromName: 'NexWork',
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
      <h2 style="color:#1e1b4b">Your Project Proposal</h2>
      <p>Hi ${opts.clientName},</p>
      <p>${opts.message ?? `I've prepared a proposal for <strong>${opts.projectTitle}</strong>. Please review it at your convenience.`}</p>
      ${opts.proposalUrl ? `<p><a href="${opts.proposalUrl}" style="background:#4f46e5;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;display:inline-block;margin-top:8px">View Proposal</a></p>` : ''}
      <p style="margin-top:32px;color:#64748b;font-size:14px">Sent via NexWork — Professional Business OS</p>
    </div>
  `;

  return sendEmail({
    to: opts.clientEmail,
    subject: `Project Proposal: ${opts.projectTitle}`,
    body,
    fromName: 'NexWork',
  });
};
