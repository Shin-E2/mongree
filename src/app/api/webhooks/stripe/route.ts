import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripeClient } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

const handledEvents = new Set([
  "checkout.session.completed",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
  "invoice.payment_failed",
]);

function fromUnixTime(value?: number | null) {
  return value ? new Date(value * 1000).toISOString() : null;
}

async function upsertSubscriptionFromStripe({
  userId,
  customerId,
  subscription,
}: {
  userId?: string | null;
  customerId?: string | null;
  subscription: Stripe.Subscription;
}) {
  const supabase = createAdminClient();
  const priceId = subscription.items.data[0]?.price.id ?? null;
  const currentPeriodEnd =
    fromUnixTime(subscription.items.data[0]?.current_period_end) ??
    fromUnixTime(subscription.ended_at);

  if (userId) {
    await supabase.from("subscriptions").upsert({
      user_id: userId,
      stripe_customer_id: customerId,
      stripe_subscription_id: subscription.id,
      status: subscription.status,
      price_id: priceId,
      current_period_end: currentPeriodEnd,
      cancel_at_period_end: subscription.cancel_at_period_end,
    });
    await supabase.from("usage_events").insert({
      user_id: userId,
      event_type: "billing.subscription.synced",
      source: "stripe_webhook",
      metadata: {
        subscriptionId: subscription.id,
        status: subscription.status,
      },
    });
    return;
  }

  await supabase
    .from("subscriptions")
    .update({
      stripe_customer_id: customerId,
      status: subscription.status,
      price_id: priceId,
      current_period_end: currentPeriodEnd,
      cancel_at_period_end: subscription.cancel_at_period_end,
    })
    .eq("stripe_subscription_id", subscription.id);
}

async function handleStripeEvent(event: Stripe.Event) {
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const subscriptionId =
      typeof session.subscription === "string"
        ? session.subscription
        : session.subscription?.id;
    const customerId =
      typeof session.customer === "string" ? session.customer : session.customer?.id;

    if (!subscriptionId) return;

    const stripe = getStripeClient();
    if (!stripe) return;

    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    await upsertSubscriptionFromStripe({
      userId: session.metadata?.userId,
      customerId,
      subscription,
    });
    return;
  }

  if (
    event.type === "customer.subscription.created" ||
    event.type === "customer.subscription.updated" ||
    event.type === "customer.subscription.deleted"
  ) {
    const subscription = event.data.object as Stripe.Subscription;
    const customerId =
      typeof subscription.customer === "string"
        ? subscription.customer
        : subscription.customer.id;

    await upsertSubscriptionFromStripe({
      userId: subscription.metadata?.userId,
      customerId,
      subscription,
    });
  }
}

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
      await handleStripeEvent(event);
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
