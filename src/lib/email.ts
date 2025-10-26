import nodemailer from "nodemailer";

function getTransport() {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : undefined;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const secureEnv = process.env.SMTP_SECURE;
  const secure = typeof secureEnv === "string" ? secureEnv === "true" : port === 465;

  if (!host || !port || !user || !pass) {
    console.warn("Email disabled: missing SMTP configuration (SMTP_HOST/PORT/USER/PASS)");
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
    pool: true,
    maxConnections: 1,
    maxMessages: 50,
    connectionTimeout: 15000,
    greetingTimeout: 15000,
    socketTimeout: 20000,
  });
}

function createGmailTransportAlt() {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!user || !pass) return null;
  // Alternate STARTTLS port
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: { user, pass },
    pool: true,
    maxConnections: 1,
    maxMessages: 50,
    connectionTimeout: 15000,
    greetingTimeout: 15000,
    socketTimeout: 20000,
  });
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export async function sendWelcomeEmail(toEmail: string) {
  const transport = getTransport();
  if (!transport) return;

  const fromEnv = process.env.EMAIL_FROM || "Avinash from InvoiceQA <avinash@taranuka.com>";
  const replyTo = process.env.EMAIL_REPLY_TO || "avinash@taranuka.com";
  const calendlyUrl = process.env.NEXT_PUBLIC_CALENDLY_URL || "https://calendly.com/your-link";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://invoiceqa.com";

  // Extract bare email for envelope FROM
  const fromEmailMatch = /<?([^<>@\s]+@[^<>@\s]+)>?/.exec(fromEnv);
  const fromEmail = fromEmailMatch ? fromEmailMatch[1] : fromEnv;

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

  async function trySend(currentTransport: nodemailer.Transporter) {
    await currentTransport.sendMail({
      to: toEmail,
      from: fromEnv,
      replyTo,
      subject,
      text,
      html,
      envelope: { from: fromEmail, to: toEmail },
    });
  }

  try {
    await trySend(transport as any);
  } catch (err: any) {
    const resp: string | undefined = err?.response;
    const code: number | undefined = err?.responseCode;
    const host = process.env.SMTP_HOST || "";

    // Graceful retry for transient 421/ECONNECTION/ETIMEDOUT
    const isTransient = code === 421 || err?.code === "ECONNECTION" || err?.code === "ETIMEDOUT";
    if (isTransient) {
      console.warn("Transient SMTP error detected (", err?.code || code, ") — retrying...");
      // two quick retries with backoff
      for (const delay of [2000, 5000]) {
        try {
          await sleep(delay);
          await trySend(transport as any);
          console.info("Welcome email sent after retry.");
          return;
        } catch (e) {
          // keep looping
        }
      }
    }

    // Gmail relay 550 fallback (existing)
    const canRelayFallback = host.includes("smtp-relay.gmail.com") && (code === 550 || /Mail relay denied/i.test(resp || ""));
    if (canRelayFallback) {
      console.warn("Primary SMTP relay denied. Falling back to smtp.gmail.com with user auth...");
      const user = process.env.SMTP_USER;
      const pass = process.env.SMTP_PASS;
      if (!user || !pass) {
        console.error("Fallback failed: missing SMTP_USER/SMTP_PASS");
        throw err;
      }
      const fallback = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: { user, pass },
        pool: true,
        maxConnections: 1,
        maxMessages: 50,
        connectionTimeout: 15000,
        greetingTimeout: 15000,
        socketTimeout: 20000,
      });
      try {
        await trySend(fallback);
        console.info("Welcome email sent via smtp.gmail.com fallback.");
        return;
      } catch (err2) {
        console.error("Fallback email send failed:", err2);
        throw err2;
      }
    }

    // If host is smtp.gmail.com: try alternate port (465<->587)
    const isGmailHost = host.includes("smtp.gmail.com");
    if (isGmailHost) {
      const alt = createGmailTransportAlt();
      if (alt) {
        try {
          console.warn("Switching to alternate Gmail port (587 STARTTLS)...");
          await trySend(alt as any);
          console.info("Welcome email sent via alternate Gmail transport.");
          return;
        } catch (e) {
          console.error("Alternate Gmail transport failed:", e);
        }
      }
    }

    console.error("Failed to send welcome email:", err);
    throw err;
  }
}
