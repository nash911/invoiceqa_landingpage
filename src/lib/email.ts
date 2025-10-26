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

  return nodemailer.createTransport({ host, port, secure, auth: { user, pass } });
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
  ✓ Early access invite: You're on the list, and you'll be among the first to get access when we launch
  ✓ Lifetime discount: Early adopters get special pricing
  ✓ Product input: Your feedback shapes what features we prioritize

Quick question: What's the biggest invoice-related headache you deal with today? Duplicate payments? Fraud concerns? Manual checking taking too long? Just hit reply and let me know. Your answer directly influences what features we prioritize.

Thanks for your interest,
Avinash Ranganath
Founder, InvoiceQA
Taranuka AB

P.S. If you'd prefer to chat live, grab a 15-minute slot here: ${calendlyUrl}
I'm talking to as many finance teams as possible to make sure we build something you actually need.

InvoiceQA - A product by Taranuka AB
${siteUrl}
`;

  const html = `
  <div style="font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,'Apple Color Emoji','Segoe UI Emoji'; line-height:1.6; color:#0f172a;">
    <p>Hi there,</p>
    <p>You're officially on the <strong>InvoiceQA early access</strong> list. Welcome aboard!</p>
    <p>I'm Avinash, the founder building InvoiceQA. I'm creating an intelligent system that catches invoice errors, fraud risks, and duplicates before they cost you time and money.</p>
    <p><strong>Here's what you can expect:</strong></p>
    <ul style="list-style:none; padding-left:0; margin:0 0 16px 0;">
      <li>✓ <strong>Early access invite</strong>: You're on the list, and you'll be among the first to get access when we launch</li>
      <li>✓ <strong>Lifetime discount</strong>: Early adopters get special pricing</li>
      <li>✓ <strong>Product input</strong>: Your feedback shapes what features we prioritize</li>
    </ul>
    <p><strong>Quick question:</strong> What's the biggest invoice-related headache you deal with today? Duplicate payments? Fraud concerns? Manual checking taking too long? Just hit reply and let me know. Your answer directly influences what features we prioritize.</p>
    <p>Thanks for your interest,<br/>
      <strong>Avinash Ranganath</strong><br/>
      Founder, InvoiceQA<br/>
      Taranuka AB
    </p>
    <p><em>P.S.</em> If you'd prefer to chat live, grab a 15-minute slot here: <a href="${calendlyUrl}" target="_blank" rel="noopener noreferrer">Book a call</a>. I'm talking to as many finance teams as possible to make sure we build something you actually need.</p>
    <hr style="margin:24px 0; border:none; border-top:1px solid #e2e8f0;"/>
    <p style="font-size: 12px; color:#64748b;">InvoiceQA - A product by Taranuka AB<br/>
      <a href="${siteUrl}" target="_blank" rel="noopener noreferrer">${siteUrl}</a>
    </p>
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
    const canFallbackToGmail = host.includes("smtp-relay.gmail.com");

    if (canFallbackToGmail && (code === 550 || /Mail relay denied/i.test(resp || ""))) {
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

    console.error("Failed to send welcome email:", err);
  }
}
