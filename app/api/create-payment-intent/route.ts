import { NextResponse } from "next/server";
import Stripe from "stripe";

// Hubi inaad ku darto STRIPE_SECRET_KEY faylkaaga .env.local
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  // Hubi inaad isticmaasho nooca (version) ugu dambeeya ee aad ogtahay
  apiVersion: "2024-06-20", 
});

// 💶 MAP-ka Qiimaha ee Sentis (1€ = 100 sentis)
const PRICE_MAP_EUR: Record<string, number> = {
  consultation_basic: 3900,   // €39.00
  prescription_renewal: 990,  // €9.90
  follow_up: 2500,            // €25.00
};

/**
 * Endpoint: POST /api/create-payment-intent
 * Wuxuu abuurayaa PaymentIntent cusub oo wuxuu u soo celiyaa clientSecret.
 */
export async function POST(req: Request) {
  try {
    // 1. Helidda Jirka (Body) Codsiga
    const body = await req.json();
    const { priceId, customerEmail } = body as {
      priceId: keyof typeof PRICE_MAP_EUR;
      customerEmail?: string;
    };

    // 2. Xaqiijinta Qiimaha
    if (!priceId || !(priceId in PRICE_MAP_EUR)) {
      console.error(`Received invalid priceId: ${priceId}`);
      return NextResponse.json({ error: "Invalid priceId submitted" }, { status: 400 });
    }

    const amount = PRICE_MAP_EUR[priceId];

    // 3. Abuurista Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "eur",
      // Tani waxay hubinaysaa in Stripe uu si toos ah u maamulo hababka lacag bixinta badan
      automatic_payment_methods: { enabled: true }, 
      
      // Iimaylka Rasiidka (haddii la bixiyo)
      receipt_email: customerEmail, 
      
      // Xogta la raacayo (si loogu xidho nidaamkaaga)
      metadata: { 
        priceId,
      },
    });

    // 4. Soo celinta clientSecret
    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });
    
  } catch (error: any) {
    console.error("Stripe error during PaymentIntent creation:", error);
    return NextResponse.json(
      { error: error.message ?? "An unknown Stripe API error occurred." },
      { status: 500 },
    );
  }
}