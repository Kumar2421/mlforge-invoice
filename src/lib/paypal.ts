/**
 * PayPal read-only connection (like Stripe).
 * OAuth + sync skeleton. Full implementation: Phase 5.5
 */

export const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID || "";
export const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET || "";
export const PAYPAL_REDIRECT_URI = `${process.env.NEXT_PUBLIC_SITE_URL}/api/v1/paypal/callback`;

// PayPal API endpoints (sandbox vs. production)
const PAYPAL_API_BASE =
  process.env.PAYPAL_MODE === "sandbox"
    ? "https://api.sandbox.paypal.com"
    : "https://api.paypal.com";

export const PAYPAL_OAUTH_URL = `${PAYPAL_API_BASE}/v1/oauth2/token`;
export const PAYPAL_INVOICES_URL = `${PAYPAL_API_BASE}/v2/invoicing/invoices`;

/**
 * Generate PayPal OAuth authorization URL.
 * User clicks → redirects to PayPal → grants read permission → callback
 */
export function getPayPalAuthUrl(state: string): string {
  const params = new URLSearchParams({
    client_id: PAYPAL_CLIENT_ID,
    response_type: "code",
    scope: "openid profile email https://api.paypal.com/v1/payments/invoicing", // invoicing scope
    redirect_uri: PAYPAL_REDIRECT_URI,
    state,
  });
  return `https://www.paypal.com/checkoutnow?${params.toString()}`;
}

/**
 * Exchange authorization code for access token.
 * (Stub: full impl requires token refresh logic)
 */
export async function exchangePayPalCode(code: string): Promise<{
  access_token: string;
  refresh_token?: string;
  expires_in: number;
} | null> {
  try {
    const response = await fetch(PAYPAL_OAUTH_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString("base64")}`,
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: PAYPAL_REDIRECT_URI,
      }).toString(),
    });

    if (!response.ok) return null;
    return await response.json();
  } catch (e) {
    console.error("PayPal token exchange error:", e);
    return null;
  }
}

/**
 * Fetch invoices from PayPal API (stub).
 * Full impl: paginate, handle statuses, map to local invoices
 */
export async function fetchPayPalInvoices(accessToken: string): Promise<any[]> {
  try {
    const response = await fetch(
      `${PAYPAL_INVOICES_URL}?fields=invoices.all&page_size=100`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) return [];
    const data = await response.json();
    return data.invoices || [];
  } catch (e) {
    console.error("PayPal fetch invoices error:", e);
    return [];
  }
}
