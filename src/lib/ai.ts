import Anthropic from '@anthropic-ai/sdk';

const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;

// Initialize the Anthropic client
// Note: In a production app, you should call this through a backend/Edge Function
// to keep your API key secure.
const anthropic = new Anthropic({
  apiKey: apiKey || '',
  dangerouslyAllowBrowser: true // Only for demo purposes in this environment
});

// ─── Guard ─────────────────────────────────────────────────────────────────
const guardKey = () => {
  if (!apiKey) {
    throw new Error(
      "Anthropic API Key is missing. Please add VITE_ANTHROPIC_API_KEY to your environment variables."
    );
  }
};

// ─── Contracts ─────────────────────────────────────────────────────────────
export const generateContract = async (description: string, serviceType: string) => {
  guardKey();
  const response = await anthropic.messages.create({
    model: "claude-opus-4-5",
    max_tokens: 2000,
    system: "You are a professional legal assistant specializing in freelance and agency contracts. Generate a detailed, professional contract based on the provided scope. Use Markdown formatting.",
    messages: [
      {
        role: "user",
        content: `Generate a ${serviceType} contract for the following project scope: ${description}. Include sections for Scope of Work, Payment Terms, Intellectual Property, and Termination.`
      }
    ],
  });
  const content = response.content.find(c => c.type === 'text');
  return content?.type === 'text' ? content.text : '';
};

export const suggestClause = async (contractContent: string, clauseType: string) => {
  if (!apiKey) return "";
  const response = await anthropic.messages.create({
    model: "claude-opus-4-5",
    max_tokens: 1000,
    system: "You are a legal assistant. Suggest a specific clause to add to an existing contract.",
    messages: [
      {
        role: "user",
        content: `Based on this contract: \n\n${contractContent}\n\nSuggest a professional "${clauseType}" clause to add.`
      }
    ],
  });
  const content = response.content.find(c => c.type === 'text');
  return content?.type === 'text' ? content.text : '';
};

// ─── Email Drafting ─────────────────────────────────────────────────────────
export interface EmailDraftOptions {
  recipientName: string;
  recipientCompany?: string;
  context: string;        // e.g. "follow up after discovery call", "overdue invoice reminder"
  senderName?: string;
  tone?: "professional" | "friendly" | "urgent";
}

export const generateEmailDraft = async (opts: EmailDraftOptions): Promise<string> => {
  guardKey();
  const tone = opts.tone ?? "professional";
  const sender = opts.senderName ?? "Felix";
  const company = opts.recipientCompany ? ` at ${opts.recipientCompany}` : "";

  const response = await anthropic.messages.create({
    model: "claude-opus-4-5",
    max_tokens: 800,
    system: `You are an expert business communicator for a freelance design & strategy agency called NexWork.
Write concise, polished ${tone} emails.
Return ONLY the email body (no subject line, no "Here's your email:" preamble).
Use short paragraphs and a clear call to action.`,
    messages: [
      {
        role: "user",
        content: `Draft a ${tone} email to ${opts.recipientName}${company}.
Context: ${opts.context}
Sign off as: ${sender}`
      }
    ],
  });
  const content = response.content.find(c => c.type === 'text');
  return content?.type === 'text' ? content.text : '';
};

// ─── Proposal Content ────────────────────────────────────────────────────────
export interface ProposalOptions {
  projectTitle: string;
  clientName: string;
  scopeSummary: string;
  budget?: string;
}

export const generateProposalContent = async (opts: ProposalOptions): Promise<string> => {
  guardKey();
  const response = await anthropic.messages.create({
    model: "claude-opus-4-5",
    max_tokens: 1500,
    system: `You are a senior business consultant writing winning project proposals for a design & strategy agency.
Use Markdown formatting with clear headings (##). Include: Executive Summary, Our Approach, Deliverables, Timeline, Why Choose Us.
Be specific and compelling. Match the client's industry language.`,
    messages: [
      {
        role: "user",
        content: `Generate a proposal for:
Project: ${opts.projectTitle}
Client: ${opts.clientName}
Scope: ${opts.scopeSummary}
${opts.budget ? `Budget: ${opts.budget}` : ""}`
      }
    ],
  });
  const content = response.content.find(c => c.type === 'text');
  return content?.type === 'text' ? content.text : '';
};

// ─── Lead Analysis ──────────────────────────────────────────────────────────
export interface LeadAnalysisInput {
  leadName: string;
  contactName: string;
  dealValue: string;
  stage: string;
  source: string;
  description?: string;
  timeline?: string[];
}

export interface LeadAnalysis {
  insight: string;
  nextAction: string;
  riskLevel: "Low" | "Medium" | "High";
  probability: number;
  draftEmail: string;
}

export const analyzeLeadData = async (lead: LeadAnalysisInput): Promise<LeadAnalysis> => {
  guardKey();

  const timelineText = lead.timeline?.join(", ") || "No prior interactions";

  const response = await anthropic.messages.create({
    model: "claude-opus-4-5",
    max_tokens: 1200,
    system: `You are an expert sales strategist and CRM analyst for a freelance agency.
Analyze the lead data and return a JSON object with these exact keys:
- insight: (string) 1-2 sentence analysis of this deal's dynamics
- nextAction: (string) The single most impactful next step to advance this deal
- riskLevel: ("Low" | "Medium" | "High") based on deal signals
- probability: (number 0-100) estimated close probability
- draftEmail: (string) A short, punchy follow-up email body (3-5 sentences) to send to this lead right now

Return ONLY valid JSON. No markdown, no explanation.`,
    messages: [
      {
        role: "user",
        content: JSON.stringify({
          company: lead.leadName,
          contact: lead.contactName,
          value: lead.dealValue,
          stage: lead.stage,
          source: lead.source,
          description: lead.description,
          recentActivity: timelineText,
        })
      }
    ],
  });

  const text = response.content.find(c => c.type === 'text')?.text ?? '{}';
  try {
    return JSON.parse(text) as LeadAnalysis;
  } catch {
    return {
      insight: "Lead shows strong engagement signals. Early-stage but promising.",
      nextAction: "Schedule a 30-minute discovery call this week.",
      riskLevel: "Medium",
      probability: 65,
      draftEmail: `Hi ${lead.contactName},\n\nThank you for your interest in working with us. I'd love to schedule a quick call to explore how we can help ${lead.leadName} achieve its goals.\n\nAre you available for a 30-minute call this week?\n\nBest regards,\nFelix`
    };
  }
};

// ─── General Business Assistant ─────────────────────────────────────────────
export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export const askBusinessAssistant = async (
  messages: ChatMessage[],
  systemContext?: string
): Promise<string> => {
  guardKey();

  const system = systemContext ?? `You are NexWork AI — an expert business assistant for freelancers and agencies.
You can help with: drafting professional emails, writing proposals, analyzing business data,
suggesting pricing strategies, creating follow-up sequences, reviewing client briefs,
and answering general business questions.
Be concise, actionable, and professional. Use plain text or Markdown as appropriate.
Never make up specific financial data — acknowledge when you need more context.`;

  const response = await anthropic.messages.create({
    model: "claude-opus-4-5",
    max_tokens: 1024,
    system,
    messages: messages.map(m => ({ role: m.role, content: m.content })),
  });

  const content = response.content.find(c => c.type === 'text');
  return content?.type === 'text' ? content.text : 'I encountered an error. Please try again.';
};

// ─── Payment Reminder ────────────────────────────────────────────────────────
export interface PaymentReminderOptions {
  clientName: string;
  invoiceId: string;
  amount: string;
  daysOverdue: number;
  senderName?: string;
}

export const generatePaymentReminder = async (opts: PaymentReminderOptions): Promise<string> => {
  guardKey();
  const tone = opts.daysOverdue > 14 ? "firm but professional" : "polite and friendly";
  const response = await anthropic.messages.create({
    model: "claude-opus-4-5",
    max_tokens: 600,
    system: `You are a professional business communicator. Write ${tone} payment reminder emails.
Return only the email body. Keep it brief (3-4 short paragraphs). End with a clear CTA.`,
    messages: [
      {
        role: "user",
        content: `Write a payment reminder email to ${opts.clientName}.
Invoice: ${opts.invoiceId}
Amount: ${opts.amount}
Days overdue: ${opts.daysOverdue}
Sender: ${opts.senderName ?? "Felix"}`
      }
    ],
  });
  const content = response.content.find(c => c.type === 'text');
  return content?.type === 'text' ? content.text : '';
};

// ─── Automation Suggestion ───────────────────────────────────────────────────
export const suggestAutomations = async (businessContext: string): Promise<string> => {
  guardKey();
  const response = await anthropic.messages.create({
    model: "claude-opus-4-5",
    max_tokens: 800,
    system: `You are a business process expert. Suggest practical workflow automations for a freelance agency.
Format your response as a JSON array of objects with keys: trigger, action, benefit, category.
Return ONLY valid JSON array.`,
    messages: [
      {
        role: "user",
        content: `Suggest 5 high-value workflow automations for this agency context: ${businessContext}`
      }
    ],
  });
  const content = response.content.find(c => c.type === 'text');
  return content?.type === 'text' ? content.text : '[]';
};
