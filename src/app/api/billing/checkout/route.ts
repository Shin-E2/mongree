import { NextResponse } from "next/server";
import { getCurrentProfile } from "@/lib/get-user";
import { getStripeClient } from "@/lib/stripe";
import { getSiteUrl } from "@/commons/utils/site-url";
import { createClient } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

export async function POST() {
  const user = await getCurrentProfile();

  if (!user) {
    return NextResponse.json(
      { error: "濡쒓렇?몄씠 ?꾩슂?⑸땲??" },
      { status: 401 }
    );
  }

  const stripe = getStripeClient();
  const priceId = process.env.STRIPE_PRICE_ID;

  if (!stripe || !priceId) {
    return NextResponse.json(
      { error: "寃곗젣 ?섍꼍 蹂?섍? ?ㅼ젙?섏? ?딆븯?듬땲??" },
      { status: 503 }
    );
  }

  const siteUrl = await getSiteUrl();
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${siteUrl}/profile?checkout=success`,
    cancel_url: `${siteUrl}/profile?checkout=cancelled`,
    metadata: {
      userId: user.id,
    },
  });

  const supabase = await createClient();
  await supabase.from("usage_events").insert({
    user_id: user.id,
    event_type: "billing.checkout.created",
    source: "api",
    metadata: {
      sessionId: session.id,
      priceId,
    },
  });

  return NextResponse.json({ url: session.url });
}
