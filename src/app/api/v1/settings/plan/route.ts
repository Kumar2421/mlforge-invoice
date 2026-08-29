import { NextResponse } from "next/server";

// Deprecated: mock plan activation. Real subscription billing now goes through
// Stripe Checkout — POST /api/v1/billing/checkout — with state applied by the
// billing webhook (/api/v1/webhooks/billing).
export async function POST() {
  return NextResponse.json(
    {
      error: "This endpoint is deprecated. Use POST /api/v1/billing/checkout to start a subscription.",
    },
    { status: 410 },
  );
}
