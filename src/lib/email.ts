async function sendViaBrevoHTTP(params: {
  apiKey: string;
  sender: { email: string; name?: string };
  to: { email: string; name?: string }[];
  subject: string;
  htmlContent: string;
  textContent: string;
  replyTo?: { email: string; name?: string };
  tags?: string[];
}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);
  try {
    const payload: Record<string, unknown> = {
      sender: params.sender,
      to: params.to,
      subject: params.subject,
      htmlContent: params.htmlContent,
      textContent: params.textContent,
      replyTo: params.replyTo,
    };
    if (params.tags && params.tags.length > 0) payload.tags = params.tags;

    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "api-key": params.apiKey,
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    const status = res.status;
    let body: unknown = null;
    try {
      body = await res.json();
    } catch {}

    if (!res.ok) {
      console.error("[email] Brevo HTTP failed", { status, body });
      throw new Error(`Brevo HTTP ${status}`);
    }

    const messageId = (body as { messageId?: string } | null)?.messageId;
    console.info("[email] Brevo HTTP accepted", { status, messageId });
    return { messageId };
  } finally {
    clearTimeout(timeout);
  }
}

export async function sendWelcomeEmail(toEmail: string) {
  const hasBrevo = !!process.env.BREVO_API_KEY;

  const fromEnv = process.env.EMAIL_FROM || "Avinash Ranganath <no-reply@invoiceqa.com>";
  const replyTo = process.env.EMAIL_REPLY_TO || "support@invoiceqa.com";
  const calendlyUrl = process.env.NEXT_PUBLIC_CALENDLY_URL || "https://calendly.com/your-link";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://invoiceqa.com";

  // Parse display name and address
  const fromEmailMatch = /<?([^<>@\s]+@[^<>@\s]+)>?/.exec(fromEnv);
  const fromEmail = fromEmailMatch ? fromEmailMatch[1] : fromEnv;
  const displayNameMatch = /^\s*([^<]+)</.exec(fromEnv);
  const fromName = displayNameMatch ? displayNameMatch[1].trim() : undefined;

  const brevoSenderEmail = process.env.BREVO_SENDER_EMAIL || fromEmail;
  const brevoSenderName = process.env.BREVO_SENDER_NAME || fromName;

  // A/B switch: when enabled, Gmail recipients get minimal; others get rich
  const abGmailMinimal = process.env.EMAIL_WELCOME_AB_GMAIL_MINIMAL === "true";
  const isGmail = /@(gmail\.com|googlemail\.com)$/i.test(toEmail);

  // Resolve minimal mode: AB logic takes precedence, else fall back to env flag
  const minimal = abGmailMinimal ? isGmail : process.env.EMAIL_WELCOME_MINIMAL === "true";
  const noLinks = process.env.EMAIL_WELCOME_NO_LINKS === "true";
  const subject = minimal
    ? "Welcome to InvoiceQA early access"
    : "Welcome to InvoiceQA early access 🎉";

  const textMinimal = `Hi there,

You're on the InvoiceQA early access list. Welcome aboard.

What to expect:
- Early access invite when we launch
- Lifetime discount for early adopters
- Your input will shape what we build next

Quick question: what's the biggest invoice-related headache for you? Just hit reply.

Thanks,
Avinash Ranganath
Founder, InvoiceQA${noLinks ? "" : `\n\nP.S. If you'd prefer to chat live, grab a 15-minute slot here: ${calendlyUrl}`}`;

  const textRich = `Hi there,

You're officially on the InvoiceQA early access list. Welcome aboard!
I'm Avinash, the founder building InvoiceQA. I'm creating an intelligent system that catches invoice errors, fraud risks, and duplicates before they cost you time and money.

Here's what you can expect:
  ✓ Early access invite: You'll be among the first to get access when we launch
  ✓ Lifetime discount: Early adopters get special pricing
  ✓ Product input: Your feedback shapes what features we prioritize

Quick question: What's the biggest invoice-related headache you deal with today? Duplicate payments? Fraud concerns? Manual checking taking too long? Just hit reply and let me know. Your answer directly influences what features I prioritize.

Thanks for your interest,
Avinash Ranganath
Founder, InvoiceQA
${noLinks ? "" : `\nP.S. If you'd prefer to chat live, grab a 15-minute slot here: ${calendlyUrl}\nI'm talkin   g to as many finance teams as possible to make sure we build something you actually need.`}
\nInvoiceQA - A product by Taranuka AB\n${siteUrl}`;

  const text = minimal ? textMinimal : textRich;

  const htmlMinimal = `
  <div style="background:#ffffff;padding:16px;">
    <div style="max-width:600px;margin:0 auto;color:#0f172a;">
      <p style="margin:0 0 12px;line-height:1.6;">Hi there,</p>
      <p style="margin:0 0 12px;line-height:1.6;">You're on the InvoiceQA early access list. Welcome aboard.</p>
      <p style="margin:0 0 12px;line-height:1.6;"><strong>What to expect:</strong></p>
      <ul style="margin:0 0 12px 18px;padding:0;line-height:1.6;">
        <li>Early access invite when we launch</li>
        <li>Lifetime discount for early adopters</li>
        <li>Your input will shape what we build next</li>
      </ul>
      <p style="margin:0 0 12px;line-height:1.6;">Quick question: what's the biggest invoice‑related headache for you? Just hit reply.</p>
      <p style="margin:0 0 12px;line-height:1.6;">Thanks,<br/><strong>Avinash Ranganath</strong><br/>Founder, InvoiceQA</p>
      ${noLinks ? "" : `<p style=\"margin:12px 0;line-height:1.6;color:#475569;\"><em>P.S. If you'd prefer to chat live, grab a <a href=\"${calendlyUrl}\" style=\"color:#2563eb;text-decoration:underline;\">15-minute slot</a>. I'm talking to as many finance teams as possible to make sure we build something you actually need.</em></p>`}
    </div>
  </div>`;

  const htmlRich = `
  <div style="background:#f6f9fc; padding:24px;">
    <div style="max-width:600px; margin:0 auto; background:#ffffff; border-radius:12px; box-shadow:0 8px 24px rgba(15,23,42,0.06); overflow:hidden;">
      <div style="padding:24px 24px 0; text-align:center;">
        <img src="${siteUrl}/brand/logo-bluegray.png" alt="InvoiceQA" width="140" height="40" style="display:inline-block; max-width:140px; height:auto;" />
      </div>
      <div style="padding:24px 24px 8px;">
        <h1 style="margin:0 0 12px; font-size:24px; line-height:1.25; color:#0f172a;">Welcome to InvoiceQA early access 🎉</h1>
        <p style="margin:0 0 12px; font-size:16px; color:#334155; line-height:1.7;">Hi there,</p>
        <p style="margin:0 0 12px; font-size:16px; color:#334155; line-height:1.7;">You're officially on the <strong>InvoiceQA early access</strong> list. Welcome aboard!</p>
        <p style="margin:0 0 16px; font-size:16px; color:#334155; line-height:1.7;">I'm Avinash, the founder building InvoiceQA. I'm creating an intelligent system that catches invoice errors, fraud risks, and duplicates before they cost you time and money.</p>
        <p style="margin:0 0 8px; font-size:16px; color:#0f172a; line-height:1.7;"><strong>Here's what you can expect:</strong></p>
        <ul style="list-style:none; padding-left:0; margin:0 0 16px 0;">
          <li style="margin:6px 0; font-size:16px; color:#334155;">✓ <strong>Early access invite</strong>: You'll be among the first to get access when we launch</li>
          <li style="margin:6px 0; font-size:16px; color:#334155;">✓ <strong>Lifetime discount</strong>: Early adopters get special pricing</li>
          <li style="margin:6px 0; font-size:16px; color:#334155;">✓ <strong>Product input</strong>: Your feedback shapes what features we prioritize</li>
        </ul>
        <p style="margin:0 0 20px; font-size:16px; color:#334155; line-height:1.7;"><strong>Quick question:</strong> What's the biggest invoice-related headache you deal with today? Duplicate payments? Fraud concerns? Manual checking taking too long? Just hit reply and let me know. Your answer directly influences what features I prioritize.</p>
        <p style="margin:0 0 8px; font-size:16px; color:#334155; line-height:1.7;">Thanks for your interest,</p>
        <p style="margin:0; font-size:16px; color:#0f172a; line-height:1.7;"><strong>Avinash Ranganath</strong><br/>Founder, InvoiceQA</p>
        ${noLinks ? "" : `<hr style=\"margin:20px 0; border:none; border-top:1px solid #e2e8f0;\"/>`}
        ${noLinks ? "" : `<div style=\"text-align:center; margin:12px 0 8px;\"><a href=\"${calendlyUrl}\" target=\"_blank\" rel=\"noopener noreferrer\" style=\"display:inline-block; padding:12px 18px; background:#2563eb; color:#ffffff; text-decoration:none; border-radius:8px; font-weight:600;\">Book a 15‑min call</a></div>`}
        ${noLinks ? "" : `<p style=\"margin:16px 0; font-size:14px; color:#475569; line-height:1.7;\"><em>P.S. If you'd prefer to chat live, grab a <a href=\"${calendlyUrl}\" target=\"_blank\" rel=\"noopener noreferrer\">15-minute slot</a>. I'm talking to as many finance teams as possible to make sure we build something you actually need.</em></p>`}
      </div>
      <div style="padding:20px 24px; background:#f8fafc; text-align:center;">
        <p style="margin:0; font-size:12px; color:#64748b;">InvoiceQA • A product by Taranuka AB • <a href="${siteUrl}" style="color:#64748b; text-decoration:underline;">${siteUrl}</a></p>
      </div>
    </div>
  </div>`;

  const html = minimal ? htmlMinimal : htmlRich;

  console.log("[email] Preparing welcome email", {
    to: toEmail,
    from: fromEnv,
    replyTo,
    provider: hasBrevo ? "brevo" : "disabled",
    abGmailMinimal,
    isGmail,
    chosenVariant: minimal ? "minimal" : "rich",
  });
  console.log('Brevo API Key:', process.env.BREVO_API_KEY ? 'present' : 'missing');

  if (!hasBrevo) {
    console.warn("[email] BREVO_API_KEY missing — cannot send email");
    return;
  }

  try {
    const tags = ["transactional", "welcome", minimal ? "variant-minimal" : "variant-rich"] as string[];
    if (abGmailMinimal) tags.push(isGmail ? "ab-gmail-minimal" : "ab-nongmail-rich");

    const { messageId } = await sendViaBrevoHTTP({
      apiKey: process.env.BREVO_API_KEY as string,
      sender: { email: brevoSenderEmail, name: brevoSenderName },
      to: [{ email: toEmail }],
      subject,
      htmlContent: html,
      textContent: text,
      replyTo: { email: replyTo },
      tags,
    });
    console.info("[email] Brevo accepted", { messageId });
  } catch (err) {
    console.error("[email] Brevo send failed", err);
    throw err;
  }
}
