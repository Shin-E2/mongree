import { NextResponse } from "next/server";
import { getUser } from "@/lib/get-user";
import { getStripeClient } from "@/lib/stripe";
import { getSiteUrl } from "@/commons/utils/site-url";

export const dynamic = "force-dynamic";

interface BillingPortalRequest {
  customerId?: string;
}

export async function POST(request: Request) {
  const user = await getUser();

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

  const body = (await request.json().catch(() => ({}))) as BillingPortalRequest;

  if (!body.customerId) {
    return NextResponse.json(
      { error: "Stripe 고객 ID가 필요합니다." },
      { status: 400 }
    );
  }

  const siteUrl = await getSiteUrl();
  const session = await stripe.billingPortal.sessions.create({
    customer: body.customerId,
    return_url: `${siteUrl}/profile`,
  });

  return NextResponse.json({ url: session.url });
}

