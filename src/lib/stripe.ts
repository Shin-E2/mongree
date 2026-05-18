import Stripe from "stripe";

let stripeClient: Stripe | null = null;

export function getStripeClient() {
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    return null;
  }

  stripeClient ??= new Stripe(secretKey, {
    appInfo: {
      name: "Mongree",
      version: "0.1.0",
    },
  });

  return stripeClient;
}

