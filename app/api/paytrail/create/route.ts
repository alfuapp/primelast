import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 1. Ka soo bixi xogta body-ga
    const { 
      orderId, amount, etunimi, sukunimi, 
      puh, viesti, palvelu, hinta, totalAmount, kelaShare, paiva, aika, 
      email 
    } = body;

    const merchantId = "375917"; // Test ID
    const secretKey = "SAIPPUAKAUPPIAS"; // Test Secret
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    // 2. Dhis URL-ka guusha (Redirect URL)
    const successUrl = `${baseUrl}/paytrail/payment-success?orderId=${orderId}&email=${encodeURIComponent(email || '')}&etunimi=${etunimi}&sukunimi=${sukunimi}&puh=${puh}&viesti=${encodeURIComponent(viesti)}&palvelu=${palvelu}&hinta=${hinta}&totalAmount=${totalAmount}&kelaShare=${kelaShare}&paiva=${paiva}&aika=${aika}`;
    const cancelUrl = `${baseUrl}/services`;

    // 3. Dhis Payload-ka - Waxaan halkan ku daray 4-ta adeeg
    const payload = {
      stamp: orderId,
      reference: orderId,
      amount: Math.round(amount * 100),
      currency: 'EUR',
      language: 'FI',
      items: [{
        unitPrice: Math.round(amount * 100),
        units: 1,
        vatPercentage: 0, // Adeegyada caafimaadka Finland waa 0% VAT
        productCode: palvelu === 'chat' ? 'CHAT-20' : 
                     palvelu === 'video' ? 'VIDEO-40' : 
                     palvelu === 'vastaanotto' ? 'SERVICE-43' : 'RESEPT-10',
        description: palvelu === 'chat' ? 'Puhelin ja chat vastaanotto' : 
                     palvelu === 'video' ? 'Videovastaanotto' : 
                     palvelu === 'vastaanotto' ? 'Lääkärin neuvonta' : 'Reseptin uusiminen',
        deliveryDate: new Date().toISOString().split('T')[0]
      }],
      customer: { 
        email: email || "testi@primecare.fi",
        firstName: etunimi || "Asiakas",
        lastName: sukunimi || "",
        phone: puh || ""
      },
      redirectUrls: { 
        success: successUrl, 
        cancel: cancelUrl 
      }
    };

    // 4. Samee Signature-ka (Amniga Paytrail)
    const headers: any = {
      'checkout-account': merchantId,
      'checkout-algorithm': 'sha256',
      'checkout-method': 'POST',
      'checkout-nonce': crypto.randomBytes(16).toString('hex'),
      'checkout-timestamp': new Date().toISOString(),
    };

    const signaturePayload = Object.keys(headers)
      .sort()
      .map(key => `${key}:${headers[key]}`)
      .join('\n') + `\n${JSON.stringify(payload)}`;

    const signature = crypto
      .createHmac('sha256', secretKey)
      .update(signaturePayload)
      .digest('hex');

    // 5. U dir codsiga Paytrail
    const response = await fetch('https://services.paytrail.com/payments', {
      method: 'POST',
      headers: {
        ...headers,
        'signature': signature,
        'content-type': 'application/json',
        'checkout-account': merchantId
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (response.ok && data.href) {
      return NextResponse.json({ href: data.href });
    } else {
      console.error("Paytrail Error Detail:", data);
      return NextResponse.json({ error: data.message || "Maksun luonti epäonnistui" }, { status: 400 });
    }
  } catch (error: any) {
    console.error("Server Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}