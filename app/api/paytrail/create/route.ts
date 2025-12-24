import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { orderId, amount, customerEmail, customerName, palvelu } = body;

    // 🛑 KALIYA GELI XOGTAADA RASMIGA AH
    const MERCHANT_ID = "1103640"; 
    const SECRET_KEY = "1fc5463a5d57862dc0ad3a2822708641ba21e6c1f3c4276cdf8b5d385863ccfd0b419c096ecefb86"; 
    const BASE_URL = "https://primecare.fi"; 

    const timestamp = new Date().toISOString();
    const nonce = crypto.randomBytes(16).toString('hex');

    // 1. Payload-ka la sifeeyey (Kaliya xogta qasabka ah)
    const payload = {
      stamp: orderId.toString(),
      reference: orderId.toString(),
      amount: Math.round(Number(amount) * 100),
      currency: 'EUR',
      language: 'FI',
      items: [{
        unitPrice: Math.round(Number(amount) * 100),
        units: 1,
        vatPercentage: 25.5,
        productCode: "SERVICE-1", // ⭐ Waxaan ka dhignay mid go'an si uusan 400 u bixin
        description: palvelu || "PrimeCare Palvelu",
        deliveryDate: new Date().toISOString().split('T')[0]
      }],
      customer: {
        email: customerEmail,
        // ⭐ Hubinta magaca si uusan 400 u dhalan
        firstName: customerName?.split(' ')[0] || "Asiakas",
        lastName: customerName?.split(' ')[1] || "PrimeCare" 
      },
      redirectUrls: {
        success: `${BASE_URL}/paytrail/payment-success`,
        cancel: `${BASE_URL}/paytrail/payment-cancel`
      }
    };

    const headers: Record<string, string> = {
      'checkout-account': MERCHANT_ID,
      'checkout-algorithm': 'sha256',
      'checkout-method': 'POST',
      'checkout-nonce': nonce,
      'checkout-timestamp': timestamp,
    };

    // 2. HMAC Calculation (Official Path)
    const hmacPayload = Object.keys(headers)
      .sort()
      .map((key) => `${key}:${headers[key]}`)
      .concat(JSON.stringify(payload))
      .join('\n');

    const signature = crypto
      .createHmac('sha256', SECRET_KEY)
      .update(hmacPayload)
      .digest('hex');

    // 3. U dir codsiga
    const response = await fetch("https://services.paytrail.com/payments", {
      method: 'POST',
      headers: {
        ...headers,
        'signature': signature,
        'content-type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      // ⭐ Tan ayaa noo sheegaysa haddii 400 uu jiro waxa uu yahay
      console.error("Paytrail Validation Error:", data);
      return NextResponse.json({ error: data.message, details: data.errors }, { status: response.status });
    }

    return NextResponse.json(data);

  } catch (error: any) {
    console.error("Internal Server Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}