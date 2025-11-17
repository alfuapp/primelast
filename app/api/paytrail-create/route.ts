import { NextRequest, NextResponse } from 'next/server';
import { createPaytrailPayment } from '@/paytrail/paytrail-api'; 

/**
 * API Route for creating a Paytrail payment.
 * Waa API Route loogu talagalay abuurista lacag bixinta Paytrail.
 */
export async function POST(req: NextRequest) {
  try {
    // We now extract 'priceId' from the request body.
    // Waxaan hadda ka soo saaraynaa 'priceId' jirka codsiga (request body).
    const { amount, reference, customer, priceId } = await req.json();

    // 1. Data Validation
    // 1. Xaqiijinta Xogta
    if (typeof amount !== 'number' || !reference || !customer || !priceId) {
      return NextResponse.json({ error: 'Missing required fields: amount, reference, customer, or priceId' }, { status: 400 });
    }

    // 2. Prepare Payload
    // 2. Diyaarinta Payload
    const payload = {
      amount,
      reference,
      customer,
      priceId, // 🟢 FIXED: priceId is included to match the PaytrailRequest type.
    };

    // 3. Call Paytrail API
    // 3. Wicitaanka Paytrail API
    const result = await createPaytrailPayment(payload);

    if (!result || !result.redirectUrl) {
      console.error("Paytrail API call failed, result or redirectUrl is missing.");
      return NextResponse.json({ error: 'Failed to create payment link.' }, { status: 500 });
    }

    // 4. Send Redirect URL to Client
    // 4. U dir URL-ka Dib-u-hagaajinta (Redirect URL) ee Kliyenka (Client)
    return NextResponse.json({ redirectUrl: result.redirectUrl });

  } catch (error) {
    console.error('SERVER ERROR (Paytrail Create):', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}