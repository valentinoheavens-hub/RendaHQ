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

## Notes
- All four use the Supabase variable `{{ .ConfirmationURL }}` for the action link.
- The **Confirm signup** email only sends if Authentication → Providers → Email →
  **Confirm email** is enabled. If it's off, new users sign in immediately with
  no verification step.
- To send from `@rendahq.com` (not Supabase's default sender), enable custom SMTP
  (Resend) under Project Settings → Authentication → SMTP, and verify the
  `rendahq.com` domain in Resend first.
- Styling matches the in-app transactional emails in `src/lib/email.ts`
  (`renderEmail()`), so auth + product emails look consistent.
