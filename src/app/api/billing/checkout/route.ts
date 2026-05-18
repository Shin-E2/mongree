import { NextResponse } from "next/server";
import { getUser } from "@/lib/get-user";
import { getStripeClient } from "@/lib/stripe";
import { getSiteUrl } from "@/commons/utils/site-url";

export const dynamic = "force-dynamic";

export async function POST() {
  const user = await getUser();

  if (!user) {
    return NextResponse.json(
      { error: "로그인이 필요합니다." },
      { status: 401 }
    );
  }

  const stripe = getStripeClient();
  const priceId = process.env.STRIPE_PRICE_ID;

  if (!stripe || !priceId) {
    return NextResponse.json(
      { error: "결제 환경 변수가 설정되지 않았습니다." },
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

  return NextResponse.json({ url: session.url });
}

