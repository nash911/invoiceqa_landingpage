async function sendViaBrevoHTTP(params: {
  apiKey: string;
  sender: { email: string; name?: string };
  to: { email: string; name?: string }[];
  subject: string;
  htmlContent: string;
  textContent: string;
  replyTo?: { email: string; name?: string };
}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);
  try {
    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "api-key": params.apiKey,
      },
      body: JSON.stringify({
        sender: params.sender,
        to: params.to,
        subject: params.subject,
        htmlContent: params.htmlContent,
        textContent: params.textContent,
        replyTo: params.replyTo,
      }),
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

  const fromEnv = process.env.EMAIL_FROM || "Avinash from InvoiceQA <no-reply@invoiceqa.com>";
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

  const subject = "Welcome to InvoiceQA early access 🎉";

  const text = `Hi there,

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

P.S. If you'd prefer to chat live, grab a 15-minute slot here: ${calendlyUrl}
I'm talking to as many finance teams as possible to make sure we build something you actually need.

InvoiceQA - A product by Taranuka AB
${siteUrl}
`;

  const html = `
  <div style="background:#f6f9fc; padding:24px;">
    <div style="max-width:600px; margin:0 auto; background:#ffffff; border-radius:12px; box-shadow:0 8px 24px rgba(15,23,42,0.06); overflow:hidden;">
      <div style="padding:24px 24px 0; text-align:center;">
        <img src="${siteUrl}/brand/logo.png" alt="InvoiceQA" width="140" height="40" style="display:inline-block; max-width:140px; height:auto;" />
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
        <hr style="margin:20px 0; border:none; border-top:1px solid #e2e8f0;"/>
        <div style="text-align:center; margin:12px 0 8px;">
          <a href="${calendlyUrl}" target="_blank" rel="noopener noreferrer" style="display:inline-block; padding:12px 18px; background:#2563eb; color:#ffffff; text-decoration:none; border-radius:8px; font-weight:600;">Book a 15‑min call</a>
        </div>
        <p style="margin:16px 0; font-size:14px; color:#475569; line-height:1.7;"><em>P.S. If you'd prefer to chat live, grab a <a href="${calendlyUrl}" target="_blank" rel="noopener noreferrer">15-minute slot</a>. I'm talking to as many finance teams as possible to make sure we build something you actually need.</em></p>
      </div>
      <div style="padding:20px 24px; background:#f8fafc; text-align:center;">
        <p style="margin:0; font-size:12px; color:#64748b;">InvoiceQA • A product by Taranuka AB • <a href="${siteUrl}" style="color:#64748b; text-decoration:underline;">${siteUrl}</a></p>
      </div>
    </div>
  </div>`;

  console.log("[email] Preparing welcome email", {
    to: toEmail,
    from: fromEnv,
    replyTo,
    provider: hasBrevo ? "brevo" : "disabled",
  });
  console.log('Brevo API Key:', process.env.BREVO_API_KEY ? 'present' : 'missing');

  if (!hasBrevo) {
    console.warn("[email] BREVO_API_KEY missing — cannot send email");
    return;
  }

  try {
    const { messageId } = await sendViaBrevoHTTP({
      apiKey: process.env.BREVO_API_KEY as string,
      sender: { email: brevoSenderEmail, name: brevoSenderName },
      to: [{ email: toEmail }],
      subject,
      htmlContent: html,
      textContent: text,
      replyTo: { email: replyTo },
    });
    console.info("[email] Brevo accepted", { messageId });
  } catch (err) {
    console.error("[email] Brevo send failed", err);
    throw err;
  }
}
