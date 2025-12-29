import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { 
      orderId, amount, etunimi, sukunimi, 
      puh, viesti, palvelu, hinta, totalAmount, kelaShare, paiva, aika, 
      email 
    } = body;

    // ⭐ HALKAN AYAA U MUHIIM AH: Waxaan ka akhrineynaa .env
    const merchantId = process.env.PAYTRAIL_MERCHANT_ID; "1103640"
    const secretKey = process.env.PAYTRAIL_SECRET_KEY;"1fc5463a5d57862dc0ad3a2822708641ba21e6c1f3c4276cdf8b5d385863ccfd0b419c096ecefb86"
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://primecare.fi";

    if (!merchantId || !secretKey) {
      return NextResponse.json({ error: "Merchant ID ama Secret Key ayaa ka maqan server-ka" }, { status: 500 });
    }

    // 2. Dhis URL-ka guusha (Redirect URL)
    const successUrl = `${baseUrl}/paytrail/payment-success?orderId=${orderId}&email=${encodeURIComponent(email || '')}&etunimi=${etunimi}&sukunimi=${sukunimi}&puh=${puh}&viesti=${encodeURIComponent(viesti)}&palvelu=${palvelu}&hinta=${hinta}&totalAmount=${totalAmount}&kelaShare=${kelaShare}&paiva=${paiva}&aika=${aika}`;
    const cancelUrl = `${baseUrl}/services`;

    const payload = {
      stamp: orderId,
      reference: orderId,
      amount: Math.round(amount * 100),
      currency: 'EUR',
      language: 'FI',
      items: [{
        unitPrice: Math.round(amount * 100),
        units: 1,
        vatPercentage: 0,
        productCode: palvelu?.toUpperCase() || 'SERVICE',
        description: palvelu === 'chat' ? 'Puhelin ja chat vastaanotto' : 
                     palvelu === 'video' ? 'Videovastaanotto' : 
                     palvelu === 'vastaanotto' ? 'Lääkärin neuvonta' : 'Reseptin uusiminen',
        deliveryDate: new Date().toISOString().split('T')[0]
      }],
      customer: { 
        email: email || "info@primecare.fi",
        firstName: etunimi || "Asiakas",
        lastName: sukunimi || "",
        phone: puh || ""
      },
      redirectUrls: { 
        success: successUrl, 
        cancel: cancelUrl 
      }
    };

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

    const response = await fetch('https://services.paytrail.com/payments', {
      method: 'POST',
      headers: {
        ...headers,
        'signature': signature,
        'content-type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (response.ok && data.href) {
      // Halkan waxaa muhiim ah inaan u dirno href sidii uu checkout-kaagu u filayey
      return NextResponse.json({ success: true, redirectUrl: data.href });
    } else {
      return NextResponse.json({ error: data.message || "Maksun luonti epäonnistui" }, { status: 400 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}