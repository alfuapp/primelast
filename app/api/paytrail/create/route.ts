import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // ⭐ Waxaan halkan ku qabanaynaa dhammaan xogta foomka
    const { orderId, amount, customerEmail, customerName, palvelu, puh, viesti } = body;

    const MERCHANT_ID = "1103640"; 
    const SECRET_KEY = "1fc5463a5d57862dc0ad3a2822708641ba21e6c1f3c4276cdf8b5d385863ccfd0b419c096ecefb86"; 
    const BASE_URL = "https://primecare.fi"; 

    const timestamp = new Date().toISOString();
    const nonce = crypto.randomBytes(16).toString('hex');

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
        productCode: "SERVICE-1",
        description: palvelu || "PrimeCare Palvelu",
        deliveryDate: new Date().toISOString().split('T')[0]
      }],
      customer: {
        email: customerEmail,
        firstName: customerName?.split(' ')[0] || "Asiakas",
        lastName: customerName?.split(' ')[1] || "PrimeCare",
        phone: puh // Xogta telefoonka Paytrail loo dirayo
      },
      redirectUrls: {
        // ⭐ MUHIIM: URL-ka success-ka ayaan ku dhex qarinaynaa puh, viesti, iyo palvelu
        success: `${BASE_URL}/paytrail/payment-success?puh=${encodeURIComponent(puh || '')}&viesti=${encodeURIComponent(viesti || '')}&palvelu=${encodeURIComponent(palvelu || '')}`,
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

    const hmacPayload = Object.keys(headers).sort()
      .map((key) => `${key}:${headers[key]}`)
      .concat(JSON.stringify(payload))
      .join('\n');

    const signature = crypto.createHmac('sha256', SECRET_KEY).update(hmacPayload).digest('hex');

    const response = await fetch("https://services.paytrail.com/payments", {
      method: 'POST',
      headers: { ...headers, 'signature': signature, 'content-type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}