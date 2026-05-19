import { getSiteUrl } from "@/commons/utils/site-url";
import { getCurrentProfile } from "@/lib/get-user";
import { createClient } from "@/lib/supabase-server";
import { getStripeClient } from "@/lib/stripe";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST() {
  const user = await getCurrentProfile();

  if (!user) {
    return NextResponse.json(
      { error: "로그인이 필요합니다." },
      { status: 401 }
    );
  }

  const stripe = getStripeClient();

  if (!stripe) {
    return NextResponse.json(
      { error: "결제 환경 변수가 설정되지 않았습니다." },
      { status: 503 }
    );
  }

  const supabase = await createClient();
  const { data: subscription, error: subscriptionError } = await supabase
    .from("subscriptions")
    .select("stripe_customer_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (subscriptionError) {
    return NextResponse.json(
      { error: "구독 정보를 조회하지 못했습니다." },
      { status: 500 }
    );
  }

  if (!subscription?.stripe_customer_id) {
    return NextResponse.json(
      { error: "연결된 Stripe 고객 정보가 없습니다." },
      { status: 404 }
    );
  }

  const siteUrl = await getSiteUrl();
  const session = await stripe.billingPortal.sessions.create({
    customer: subscription.stripe_customer_id,
    return_url: `${siteUrl}/profile`,
  });

  return NextResponse.json({ url: session.url });
}
