import { NextResponse } from 'next/server';
import { createPaymentRequest } from '@/paytrail/paytrail-api';

// 🛑 JOOJI CACHE-KA BROWSER-KA
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // 1. Lacagta iyo magaca adeegga
    const amount = Number(body.amount);
    const serviceName = body.description || "PrimeCare Palvelu";

    // 2. Xogta macmiilka
    const customerInfo = {
      email: 'asiakas@primecare.fi',
      firstName: 'Verkko',
      lastName: 'Asiakas',
      phone: '000000000',
    };

    // 3. U yeer shaqada Paytrail
    const result = await createPaymentRequest(amount, customerInfo, serviceName);

    if (result.success && result.url) {
      // 🚀 U dir URL-ka bangiga
      return NextResponse.json({ 
        success: true, 
        href: result.url 
      });
    } else {
      console.error("PAYTRAIL ERROR:", result.error);
      return NextResponse.json({ 
        success: false, 
        error: result.error 
      }, { status: 500 });
    }
  } catch (error: any) {
    console.error("API ROUTE ERROR:", error);
    return NextResponse.json({ 
      success: false, 
      error: 'Internal Server Error' 
    }, { status: 500 });
  }
}