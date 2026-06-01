import Groq from 'groq-sdk';

const apiKey = import.meta.env.VITE_GROQ_API_KEY;

// Initialize Groq client
// Note: In production, route AI calls through a backend to keep the key secure.
const groq = new Groq({
  apiKey: apiKey || '',
  dangerouslyAllowBrowser: true,
});

// Default model — fast and highly capable (free on Groq)
const MODEL = 'llama-3.3-70b-versatile';

// ─── Guard ─────────────────────────────────────────────────────────────────
const guardKey = () => {
  if (!apiKey) {
    throw new Error(
      'Groq API Key is missing. Please add VITE_GROQ_API_KEY to your .env file.'
    );
  }
};

// ─── Helper ─────────────────────────────────────────────────────────────────
const chat = async (system: string, userMessage: string, maxTokens = 1024): Promise<string> => {
  const response = await groq.chat.completions.create({
    model: MODEL,
    max_tokens: maxTokens,
    messages: [
      { role: 'system', content: system },
      { role: 'user', content: userMessage },
    ],
  });
  return response.choices[0]?.message?.content ?? '';
};

// ─── Contracts ─────────────────────────────────────────────────────────────
export const generateContract = async (description: string, serviceType: string): Promise<string> => {
  guardKey();
  return chat(
    'You are a professional legal assistant specializing in freelance and agency contracts. Generate a detailed, professional contract based on the provided scope. Use Markdown formatting.',
    `Generate a ${serviceType} contract for the following project scope: ${description}. Include sections for Scope of Work, Payment Terms, Intellectual Property, and Termination.`,
    2000
  );
};

export const suggestClause = async (contractContent: string, clauseType: string): Promise<string> => {
  if (!apiKey) return '';
  return chat(
    'You are a legal assistant. Suggest a specific clause to add to an existing contract.',
    `Based on this contract:\n\n${contractContent}\n\nSuggest a professional "${clauseType}" clause to add.`,
    1000
  );
};

// ─── Email Drafting ─────────────────────────────────────────────────────────
export interface EmailDraftOptions {
  recipientName: string;
  recipientCompany?: string;
  context: string;
  senderName?: string;
  tone?: 'professional' | 'friendly' | 'urgent';
}

export const generateEmailDraft = async (opts: EmailDraftOptions): Promise<string> => {
  guardKey();
  const tone = opts.tone ?? 'professional';
  const sender = opts.senderName ?? 'Felix';
  const company = opts.recipientCompany ? ` at ${opts.recipientCompany}` : '';
  return chat(
    `You are an expert business communicator for a freelance design & strategy agency called NexWork.
Write concise, polished ${tone} emails.
Return ONLY the email body (no subject line, no preamble).
Use short paragraphs and a clear call to action.`,
    `Draft a ${tone} email to ${opts.recipientName}${company}.
Context: ${opts.context}
Sign off as: ${sender}`,
    800
  );
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
  return chat(
    `You are a senior business consultant writing winning project proposals for a design & strategy agency.
Use Markdown formatting with clear headings (##). Include: Executive Summary, Our Approach, Deliverables, Timeline, Why Choose Us.
Be specific and compelling. Match the client's industry language.`,
    `Generate a proposal for:
Project: ${opts.projectTitle}
Client: ${opts.clientName}
Scope: ${opts.scopeSummary}
${opts.budget ? `Budget: ${opts.budget}` : ''}`,
    1500
  );
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
  riskLevel: 'Low' | 'Medium' | 'High';
  probability: number;
  draftEmail: string;
}

export const analyzeLeadData = async (lead: LeadAnalysisInput): Promise<LeadAnalysis> => {
  guardKey();
  const timelineText = lead.timeline?.join(', ') || 'No prior interactions';
  const text = await chat(
    `You are an expert sales strategist and CRM analyst for a freelance agency.
Analyze the lead data and return a JSON object with these exact keys:
- insight: (string) 1-2 sentence analysis of this deal's dynamics
- nextAction: (string) The single most impactful next step to advance this deal
- riskLevel: ("Low" | "Medium" | "High") based on deal signals
- probability: (number 0-100) estimated close probability
- draftEmail: (string) A short, punchy follow-up email body (3-5 sentences)

Return ONLY valid JSON. No markdown, no explanation.`,
    JSON.stringify({
      company: lead.leadName,
      contact: lead.contactName,
      value: lead.dealValue,
      stage: lead.stage,
      source: lead.source,
      description: lead.description,
      recentActivity: timelineText,
    }),
    1200
  );

  try {
    // Strip markdown code fences if the model wrapped the JSON
    const cleaned = text.replace(/```(?:json)?\n?/g, '').trim();
    return JSON.parse(cleaned) as LeadAnalysis;
  } catch {
    return {
      insight: 'Lead shows strong engagement signals. Early-stage but promising.',
      nextAction: 'Schedule a 30-minute discovery call this week.',
      riskLevel: 'Medium',
      probability: 65,
      draftEmail: `Hi ${lead.contactName},\n\nThank you for your interest in working with us. I'd love to schedule a quick call to explore how we can help ${lead.leadName} achieve its goals.\n\nAre you available for a 30-minute call this week?\n\nBest regards,\nFelix`,
    };
  }
};

// ─── General Business Assistant ─────────────────────────────────────────────
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export const askBusinessAssistant = async (
  messages: ChatMessage[],
  systemContext?: string
): Promise<string> => {
  guardKey();

  const system =
    systemContext ??
    `You are NexWork AI — an expert business assistant for freelancers and agencies.
You can help with: drafting professional emails, writing proposals, analyzing business data,
suggesting pricing strategies, creating follow-up sequences, reviewing client briefs,
and answering general business questions.
Be concise, actionable, and professional. Use plain text or Markdown as appropriate.
Never make up specific financial data — acknowledge when you need more context.`;

  const response = await groq.chat.completions.create({
    model: MODEL,
    max_tokens: 1024,
    messages: [
      { role: 'system', content: system },
      ...messages.map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content })),
    ],
  });

  return response.choices[0]?.message?.content ?? 'I encountered an error. Please try again.';
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
  const tone = opts.daysOverdue > 14 ? 'firm but professional' : 'polite and friendly';
  return chat(
    `You are a professional business communicator. Write ${tone} payment reminder emails.
Return only the email body. Keep it brief (3-4 short paragraphs). End with a clear CTA.`,
    `Write a payment reminder email to ${opts.clientName}.
Invoice: ${opts.invoiceId}
Amount: ${opts.amount}
Days overdue: ${opts.daysOverdue}
Sender: ${opts.senderName ?? 'Felix'}`,
    600
  );
};

// ─── Automation Suggestion ───────────────────────────────────────────────────
export const suggestAutomations = async (businessContext: string): Promise<string> => {
  guardKey();
  return chat(
    `You are a business process expert. Suggest practical workflow automations for a freelance agency.
Format your response as a JSON array of objects with keys: trigger, action, benefit, category.
Return ONLY valid JSON array. No markdown, no explanation.`,
    `Suggest 5 high-value workflow automations for this agency context: ${businessContext}`,
    800
  );
};
