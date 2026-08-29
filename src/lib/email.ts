/**
 * Single compliant email sender. Every outbound email MUST go through this so the
 * CAN-SPAM block (physical address + unsubscribe) and the List-Unsubscribe headers
 * are always present.
 */

const RESEND_ENDPOINT = "https://api.resend.com/emails";

// forge-invoice is the sender of record. Set PLATFORM_POSTAL_ADDRESS in the
// environment to a real business mailing address before sending at volume.
const PLATFORM_POSTAL_ADDRESS =
  process.env.PLATFORM_POSTAL_ADDRESS ||
  "mlforge Invoice, 4/12.2 South Street, Pukkulam, Udumalpet, Tamil Nadu, India";

export type ReminderVars = {
  client: string;
  invoice: string;
  amount: string;
  sender: string;
};

export function renderTemplate(text: string, vars: ReminderVars): string {
  return text
    .replace(/\{\{\s*client\s*\}\}/gi, vars.client)
    .replace(/\{\{\s*invoice\s*\}\}/gi, vars.invoice)
    .replace(/\{\{\s*amount\s*\}\}/gi, vars.amount)
    .replace(/\{\{\s*sender\s*\}\}/gi, vars.sender);
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

type SendReminderArgs = {
  to: string;
  fromName: string;
  fromEmail: string;
  replyTo?: string;
  subject: string;
  /** Plain-text body (may contain {{vars}} already substituted). */
  bodyText: string;
  unsubscribeUrl: string;
};

export type SendResult = { ok: true; id?: string } | { ok: false; error: string };

export async function sendReminderEmail(args: SendReminderArgs): Promise<SendResult> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { ok: false, error: "RESEND_API_KEY not set" };

  const bodyHtml = args.bodyText
    .split(/\n{2,}/)
    .map((p) => `<p style="margin:0 0 16px;line-height:1.6;">${escapeHtml(p).replace(/\n/g, "<br/>")}</p>`)
    .join("");

  const complianceHtml = `
    <hr style="margin-top:32px;border:none;border-top:1px solid #eaeaea;" />
    <div style="font-size:12px;color:#888;line-height:1.5;margin-top:16px;">
      <p style="margin:0 0 6px;">This is an automated payment reminder sent via mlforge Invoice on behalf of ${escapeHtml(args.fromName)}.</p>
      <p style="margin:0 0 6px;">${escapeHtml(PLATFORM_POSTAL_ADDRESS)}</p>
      <p style="margin:0;">To stop receiving reminders for these invoices, <a href="${args.unsubscribeUrl}" style="color:#888;">unsubscribe here</a>.</p>
    </div>`;

  const complianceText = `\n\n---\nThis is an automated payment reminder sent via mlforge Invoice on behalf of ${args.fromName}.\n${PLATFORM_POSTAL_ADDRESS}\nUnsubscribe: ${args.unsubscribeUrl}\n`;

  const res = await fetch(RESEND_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      from: `${args.fromName} <${args.fromEmail}>`,
      to: [args.to],
      ...(args.replyTo ? { reply_to: args.replyTo } : {}),
      subject: args.subject,
      html: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#333;">${bodyHtml}${complianceHtml}</div>`,
      text: `${args.bodyText}${complianceText}`,
      headers: {
        "List-Unsubscribe": `<${args.unsubscribeUrl}>`,
        "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
      },
    }),
  });

  if (!res.ok) {
    return { ok: false, error: await res.text() };
  }
  const json = (await res.json().catch(() => ({}))) as { id?: string };
  return { ok: true, id: json.id };
}
