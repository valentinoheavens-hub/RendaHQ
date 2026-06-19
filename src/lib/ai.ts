// All AI calls are routed server-side through the Supabase Edge Function.
// The Groq API key never touches the browser.

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;
const EDGE_FN_URL = `${SUPABASE_URL}/functions/v1/ai-proxy`;

interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

// ─── Core caller ─────────────────────────────────────────────────────────────
const callEdge = async (messages: Message[], maxTokens = 1024): Promise<string> => {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error('RendaHQ AI is not configured. Please check your environment setup.');
  }

  const res = await fetch(EDGE_FN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify({ messages, max_tokens: maxTokens }),
  });

  const json = await res.json();
  if (!res.ok || json.error) {
    throw new Error(json.error || 'RendaHQ AI request failed.');
  }
  return json.content as string;
};

const chat = (system: string, userMessage: string, maxTokens = 1024) =>
  callEdge([
    { role: 'system', content: system },
    { role: 'user', content: userMessage },
  ], maxTokens);

// ─── Contracts ─────────────────────────────────────────────────────────────
export const generateContract = async (description: string, serviceType: string): Promise<string> =>
  chat(
    'You are a professional legal assistant specializing in freelance and agency contracts. Generate a detailed, professional contract based on the provided scope. Use Markdown formatting.',
    `Generate a ${serviceType} contract for the following project scope: ${description}. Include sections for Scope of Work, Payment Terms, Intellectual Property, and Termination.`,
    2000
  );

export const suggestClause = async (contractContent: string, clauseType: string): Promise<string> =>
  chat(
    'You are a legal assistant. Suggest a specific clause to add to an existing contract.',
    `Based on this contract:\n\n${contractContent}\n\nSuggest a professional "${clauseType}" clause to add.`,
    1000
  );

// ─── Email Drafting ─────────────────────────────────────────────────────────
export interface EmailDraftOptions {
  recipientName: string;
  recipientCompany?: string;
  context: string;
  senderName?: string;
  tone?: 'professional' | 'friendly' | 'urgent';
}

export const generateEmailDraft = async (opts: EmailDraftOptions): Promise<string> => {
  const tone = opts.tone ?? 'professional';
  const sender = opts.senderName ?? 'Felix';
  const company = opts.recipientCompany ? ` at ${opts.recipientCompany}` : '';
  return chat(
    `You are an expert business communicator for a freelance design & strategy agency called RendaHQ.
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

export const generateProposalContent = async (opts: ProposalOptions): Promise<string> =>
  chat(
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
  const system =
    systemContext ??
    `You are RendaHQ AI — an expert business assistant for freelancers and agencies.
You can help with: drafting professional emails, writing proposals, analyzing business data,
suggesting pricing strategies, creating follow-up sequences, reviewing client briefs,
and answering general business questions.
Be concise, actionable, and professional. Use plain text or Markdown as appropriate.
Never make up specific financial data — acknowledge when you need more context.`;

  return callEdge(
    [
      { role: 'system', content: system },
      ...messages.map((m) => ({ role: m.role as 'system' | 'user' | 'assistant', content: m.content })),
    ],
    1024
  );
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

// ─── Strategy Insights ───────────────────────────────────────────────────────
export const generateStrategyInsights = async (objectivesContext: string): Promise<string> =>
  chat(
    `You are a strategic business advisor for a freelance agency. Analyze the OKR data provided and give a concise, actionable insight in 2-3 sentences. Focus on what is at risk, what is on track, and the single highest-leverage action to take right now. Be direct and specific.`,
    `Analyze these objectives and key results and give strategic insights:\n\n${objectivesContext}`,
    400
  );

// ─── Vitality Insight ────────────────────────────────────────────────────────
export const generateVitalityInsight = async (teamContext: string): Promise<string> =>
  chat(
    `You are an expert in team well-being and performance management. Analyze the team vitality data and provide a concise 2-3 sentence insight. Identify who needs immediate attention, why, and one concrete intervention to recommend. Be empathetic but direct.`,
    `Analyze this team vitality data and give a well-being insight:\n\n${teamContext}`,
    400
  );

// ─── Positioning Gap ─────────────────────────────────────────────────────────
export const generatePositioningGap = async (marketContext: string): Promise<string> =>
  chat(
    `You are a market strategist for a boutique design and technology agency. Analyze the SWOT and competitor data provided. Identify the most compelling positioning gap — a specific opportunity that none of the competitors are exploiting. Describe it in 2-3 sentences and explain why it's the right moment to act.`,
    `Identify the key market positioning gap from this data:\n\n${marketContext}`,
    400
  );

// ─── Diagnostic Recommendations ──────────────────────────────────────────────
export const generateDiagnosticReco = async (diagnosticsContext: string): Promise<string> =>
  chat(
    `You are a business health consultant. Based on the diagnostic scores provided, give 3 numbered, concrete action items the agency should prioritize this quarter to improve their overall health score. Each action should be one sentence. Be specific, not generic.`,
    `Generate prioritized recommendations from these business diagnostics:\n\n${diagnosticsContext}`,
    500
  );

// ─── Growth Ideas ─────────────────────────────────────────────────────────────
export const generateGrowthIdeas = async (growthContext: string): Promise<string> =>
  chat(
    `You are a growth strategist for a freelance agency. Based on the funnel and experiment data provided, identify the single biggest lever for growth and suggest one bold experiment the team should run next. Keep it to 2-3 sentences. Be specific and data-driven.`,
    `Identify the highest-impact growth opportunity from this data:\n\n${growthContext}`,
    400
  );

// ─── Automation Suggestion ───────────────────────────────────────────────────
export const suggestAutomations = async (businessContext: string): Promise<string> =>
  chat(
    `You are a business process expert. Suggest practical workflow automations for a freelance agency.
Format your response as a JSON array of objects with keys: trigger, action, benefit, category.
Return ONLY valid JSON array. No markdown, no explanation.`,
    `Suggest 5 high-value workflow automations for this agency context: ${businessContext}`,
    800
  );
