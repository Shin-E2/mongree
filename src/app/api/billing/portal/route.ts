import { NextResponse } from "next/server";
import { getCurrentProfile } from "@/lib/get-user";
import { createClient } from "@/lib/supabase-server";
import { getStripeClient } from "@/lib/stripe";
import { getSiteUrl } from "@/commons/utils/site-url";

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

  if (!stripe) {
    return NextResponse.json(
      { error: "寃곗젣 ?섍꼍 蹂?섍? ?ㅼ젙?섏? ?딆븯?듬땲??" },
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
      { error: "援щ룆 ?뺣낫瑜?議고쉶?섏? 紐삵뻽?듬땲??" },
      { status: 500 }
    );
  }

  if (!subscription?.stripe_customer_id) {
    return NextResponse.json(
      { error: "?곌껐??Stripe 怨좉컼 ?뺣낫媛 ?놁뒿?덈떎." },
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
