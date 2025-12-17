import { NextResponse } from 'next/server';
import { createPaymentRequest } from '@/paytrail/paytrail-api';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // 1. Lacagta u beddel Integer (Sentiga/Cents)
    const amountInCents = Math.round(Number(body.amount) * 100); 

    const orderData = {
      amount: amountInCents, // Hadda waa Integer sax ah
      reference: `PRIME-${new Date().getTime()}`,
      items: [{
        unitPrice: amountInCents, // Isna waa inuu Integer ahaadaa
        units: 1,
        vatPercentage: 24,
        productCode: "SERVICE-001",
        description: body.description || "Terveydenhuolto",
      }],
    };

    const customerInfo = {
      email: body.email || 'asiakas@primecare.fi',
      firstName: body.firstName,
      lastName: body.lastName || '',
      phone: body.phone,
    };

    // 2. U dir Paytrail
    const result = await createPaymentRequest(orderData, customerInfo);

    if (result.success && result.url) {
      return NextResponse.json({ success: true, redirectUrl: result.url });
    } else {
      // Halkan ku qor error-ka uu soo celiyo Paytrail si aad u aragto
      console.error("PAYTRAIL ERROR:", result.error);
      return NextResponse.json({ success: false, error: result.error }, { status: 500 });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}