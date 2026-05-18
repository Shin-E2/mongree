import { NextResponse } from "next/server";
import { getStripeClient } from "@/lib/stripe";

export const dynamic = "force-dynamic";

const handledEvents = new Set([
  "checkout.session.completed",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
  "invoice.payment_failed",
]);

export async function POST(request: Request) {
  const stripe = getStripeClient();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = request.headers.get("stripe-signature");

  if (!stripe || !webhookSecret) {
    return NextResponse.json(
      { error: "Stripe webhook 환경 변수가 설정되지 않았습니다." },
      { status: 503 }
    );
  }

  if (!signature) {
    return NextResponse.json(
      { error: "Stripe signature header가 없습니다." },
      { status: 400 }
    );
  }

  const payload = await request.text();

  try {
    const event = stripe.webhooks.constructEvent(
      payload,
      signature,
      webhookSecret
    );

    if (handledEvents.has(event.type)) {
      console.info("Stripe webhook received:", event.type);
    }

    return NextResponse.json({ received: true, type: event.type });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Stripe webhook 검증에 실패했습니다.";

    return NextResponse.json({ error: message }, { status: 400 });
  }
}

