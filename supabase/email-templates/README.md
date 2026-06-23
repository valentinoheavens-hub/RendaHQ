# RendaHQ — Supabase Auth email templates

Branded HTML for the auth emails Supabase sends. These control the **content**;
the sender address (`@rendahq.com`) is configured separately via custom SMTP.

## How to apply
Supabase Dashboard → **Authentication → Email Templates**. Pick the tab, set the
**Subject**, and paste the matching file's full HTML into the body.

| Dashboard tab        | File                   | Suggested subject              |
|----------------------|------------------------|--------------------------------|
| Confirm signup       | `confirm-signup.html`  | `Confirm your RendaHQ account` |
| Reset password       | `reset-password.html`  | `Reset your RendaHQ password`  |
| Magic Link           | `magic-link.html`      | `Your RendaHQ sign-in link`    |
| Change Email Address | `change-email.html`    | `Confirm your new email`       |

## Link format — why not `{{ .ConfirmationURL }}`
These templates deliberately **do not** use `{{ .ConfirmationURL }}`. That link
routes through Supabase's `GET /verify`, which email scanners (Gmail, Outlook)
pre-fetch — burning the single-use token before the user clicks ("Email link is
invalid or has expired"). Instead each links straight to the app with a
`token_hash`, which the app exchanges via `supabase.auth.verifyOtp()` in JS
(scanners don't run JS, so the token survives):

| File                  | Link                                                              | Handled by         |
|-----------------------|------------------------------------------------------------------|--------------------|
| `confirm-signup.html` | `{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=signup`       | `/auth/confirm`    |
| `magic-link.html`     | `{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=magiclink`    | `/auth/confirm`    |
| `change-email.html`   | `{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email_change` | `/auth/confirm`    |
| `reset-password.html` | `{{ .SiteURL }}/reset-password?token_hash={{ .TokenHash }}&type=recovery`   | `/reset-password`  |

Requires **Site URL = `https://rendahq.com`** (Authentication → URL Configuration)
so `{{ .SiteURL }}` resolves. No redirect-URL allowlist entry is needed for this
flow (the link goes directly to the SPA, not through a Supabase redirect).

## Notes
- The **Confirm signup** email only sends if Authentication → Providers → Email →
  **Confirm email** is enabled. If it's off, new users sign in immediately with
  no verification step.
- To send from `@rendahq.com` (not Supabase's default sender), enable custom SMTP
  (Resend) under Project Settings → Authentication → SMTP, and verify the
  `rendahq.com` domain in Resend first.
- Styling matches the in-app transactional emails in `src/lib/email.ts`
  (`renderEmail()`), so auth + product emails look consistent.
