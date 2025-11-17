// Kani waa jidka API-ga ee server-ka (Next.js) oo loogu talagalay in lagu abuuro lacag bixinta Paytrail.

import { NextRequest, NextResponse } from 'next/server';
// Waxaan isticmaaleynaa 'crypto' asalka ah, taasoo ka shaqeysa Node.js/Next.js Server-side.
import { createHmac } from 'crypto'; 

// --- HUBINTA XOGTA DEEGAANKA ---
// Hubi in xogtaan lagu qeexay faylkaaga .env.local
const MERCHANT_ID = process.env.PAYTRAIL_MERCHANT_ID || '375917'; // TEST ID
const SECRET_KEY = process.env.PAYTRAIL_SECRET_KEY || 'SAIPPUAKAUPPIAS'; // TEST SECRET

// URL-yada loo adeegsado dib u dirista (Wuxuu u isticmaalayaa NEXT_PUBLIC_DOMAIN_URL)
// FIIRO GAAR AH: Xitaa haddii aad haysato .env, waxaan halkan ku xaqiijinaynaa inuu jiro default.
const DOMAIN_URL = process.env.NEXT_PUBLIC_DOMAIN_URL || 'http://localhost:3000';
const SUCCESS_URL_BASE = process.env.PAYMENT_SUCCESS_URL || `${DOMAIN_URL}/payment-success`;
const CANCEL_URL_BASE = process.env.PAYMENT_CANCEL_URL || `${DOMAIN_URL}/payment-cancel`;

// Habka abuurista HMAC-sha256 signature
// Tani waxay xaqiijinaysaa in dalabka la diray uu yahay mid dhab ah oo aan la faragelin.
function createSignature(payload: any, key: string, headers: Record<string, string>): string {
    // 1. Dhis liiska furayaasha header-ka ee la saxiixayo (alphabetical order)
    const headersToSign = Object.keys(headers)
        .filter(h => h.startsWith('checkout-'))
        .sort();

    // 2. Dhis xarigga la saxiixayo
    const signatureString = headersToSign
        .map(h => headers[h])
        .join('\n') + '\n' + JSON.stringify(payload);
    
    // 3. Xisaabi HMAC-sha256
    return createHmac('sha256', key)
               .update(signatureString)
               .digest('hex');
}

// Tani waa in lagu baddelaa nidaamka xaqiijinta qiimaha ee dhabta ah
const getVerifiedPrice = (priceId: string) => {
    switch (priceId) {
        case 'consultation_basic': return { price: 39.00, description: "Videovastaanotto - 39€" };
        case 'prescription_renewal': return { price: 9.90, description: "Reseptin uusinta - 9,90€" };
        case 'follow_up': return { price: 25.00, description: "Seurantakäynti - 25€" };
        default: return null;
    }
}


export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { priceId, customer } = body; 

    // Hubi xogta aasaasiga ah
    if (!priceId || !customer || !customer.email) {
      return NextResponse.json(
        { message: 'Fadlan hubi dhammaan xogta (priceId iyo customer email) way maqan yihiin.' },
        { status: 400 }
      );
    }
    
    // Xaqiijinta Price ID iyo qadarka
    const verifiedPrice = getVerifiedPrice(priceId);
    if (!verifiedPrice) {
        return NextResponse.json(
            { message: 'Price ID lama helin ama waa mid aan sax ahayn.' },
            { status: 400 }
        );
    }

    const amount = verifiedPrice.price;
    
    // Xogta Dalabka
    const reference = `PC-${Date.now()}-${Math.floor(Math.random() * 1000)}`; 
    const totalAmountInCents = Math.round(amount * 100); 
    
    // URL-yada soo celinta
    const successUrl = `${SUCCESS_URL_BASE}?checkout-reference=${reference}`;
    const cancelUrl = `${CANCEL_URL_BASE}?checkout-reference=${reference}`;
    // URL-yada callback-ka waa in ay isticmaalaan DOMAIN_URL-ka (ma aha NEXT_PUBLIC)
    const callbackSuccessUrl = `${DOMAIN_URL}/api/paytrail/callback/success`;
    const callbackCancelUrl = `${DOMAIN_URL}/api/paytrail/callback/cancel`;

    const paymentPayload = {
      stamp: reference,
      reference: reference,
      amount: totalAmountInCents,
      currency: 'EUR',
      language: 'FI',
      items: [{
        unitPrice: totalAmountInCents, units: 1, vatPercentage: 0, productCode: priceId,
        description: verifiedPrice.description,
      }],
      customer: { email: customer.email },
      redirectUrls: { success: successUrl, cancel: cancelUrl },
      callbackUrls: { success: callbackSuccessUrl, cancel: callbackCancelUrl },
    };

    // --- DHISMAHA HEADERS PAYTRAIL ---
    // Waxaan u isticmaalaynaa crypto.randomUUID iyo new Date().toISOString si ay u shaqeyso server-ka
    const timestamp = new Date().toISOString();
    const nonce = crypto.randomUUID();
    
    const requestHeaders = {
        'checkout-account': MERCHANT_ID,
        'checkout-algorithm': 'sha256',
        'checkout-method': 'POST',
        'checkout-nonce': nonce,
        'checkout-timestamp': timestamp,
    };
    
    // Xisaabi Signature
    const signature = createSignature(paymentPayload, SECRET_KEY, requestHeaders);

    // 4. U dir Paytrail API
    const paytrailUrl = 'https://api.checkout.fi/payments'; // LIVE/TEST API URL
    
    const apiResponse = await fetch(paytrailUrl, {
      method: 'POST',
      headers: {
        ...requestHeaders,
        'signature': signature, // Saxiixa la xisaabiyay
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(paymentPayload),
    });

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      console.error('Paytrail API Error:', apiResponse.status, errorText);
      return NextResponse.json(
        { message: 'Khalad gudaha server-ka ah: Paytrail ma abuurin lacag bixinta.', error: errorText },
        { status: 500 }
      );
    }

    const paytrailData = await apiResponse.json();
    
    // Soo celinta URL-ka dib-u-dirista
    return NextResponse.json({ 
      success: true, 
      redirectUrl: paytrailData.href 
    });

  } catch (error: any) {
    console.error('Khalad server-ka ah ee Paytrail API:', error.message);
    return NextResponse.json(
      { message: 'Khalad nidaameed oo dhacay markii la abuurayay dalabka.', error: error.message },
      { status: 500 }
    );
  }
}