import { NextResponse } from 'next/server';
import { createPaymentRequest } from '@/paytrail/paytrail-api';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // 1. Lacagta iyo magaca adeegga
    const amount = Number(body.amount);
    const serviceName = body.description || "PrimeCare Palvelu";

    // 2. Xogta macmiilka (Default maadaama aan foom jirin)
    const customerInfo = {
      email: 'asiakas@primecare.fi',
      firstName: 'Verkko',
      lastName: 'Asiakas',
      phone: '000000000',
    };

    // 3. U yeer shaqada Paytrail (Saddexda shay ee ay u baahan tahay)
    const result = await createPaymentRequest(amount, customerInfo, serviceName);

    if (result.success && result.url) {
      return NextResponse.json({ success: true, redirectUrl: result.url });
    } else {
      console.error("PAYTRAIL ERROR:", result.error);
      return NextResponse.json({ success: false, error: result.error }, { status: 500 });
    }
  } catch (error: any) {
    console.error("API ROUTE ERROR:", error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}