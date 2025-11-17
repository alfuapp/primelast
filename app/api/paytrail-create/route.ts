import { NextRequest, NextResponse } from 'next/server';
// Waxaan u baahannahay inaan isticmaalno createPaytrailPayment, kaas oo aan u malaynayo inuu ku yaallo 'paytrail/paytrail-api'
import { createPaytrailPayment } from '@/paytrail/paytrail-api';

// Nooca xogta aan ka sugeyno Client-ka
interface PaymentRequestBody {
  customer: {
    email: string;
  };
  priceId: string;
}

// Adeegyada iyo Qiimahooda (Si loo xaqiijiyo dhinaca Server-ka)
// Isticmaal qiimaha senti (1€ = 100)
const availableServices: { [key: string]: { name: string, amount: number } } = {
  'follow-up-PC-1763': { name: 'Seurantakäynti - 25€', amount: 2500 },
  'video-consultation-PC-2893': { name: 'Videovastaanotto - 39€', amount: 3900 },
};


export async function POST(req: NextRequest) {
  try {
    const body: PaymentRequestBody = await req.json();
    const { customer, priceId } = body;

    const service = availableServices[priceId];

    // 1. Hubinta Price ID-ga
    if (!service) {
      console.error('Price ID error: Price ID lama helin ama waa mid aan sax ahayn:', priceId);
      // Hubi inuu soo celiyo JSON
      return NextResponse.json(
        { error: 'Price ID lama helin ama waa mid aan sax ahayn. Fadlan dooro adeeg sax ah.' },
        { status: 400 }
      );
    }
    
    // 2. Diyaarinta Paytrail Payload
    const reference = `follow-up-PC-${Date.now()}-${Math.random().toString(16).substring(2, 10)}`;

    const payload = {
      amount: service.amount,
      reference: reference,
      customer: customer,
    };

    // 3. Wicitaanka Paytrail API
    const result = await createPaytrailPayment(payload);

    if (!result || !result.redirectUrl) {
      console.error("Paytrail API call failed, result or redirectUrl is missing.");
      // Hubi inuu soo celiyo JSON xitaa haddii Paytrail-ku fashilmo
      return NextResponse.json(
        { error: 'Paytrail ma abuuri karin dalabka lacag bixinta. Hubi Merchant ID & Secret.' },
        { status: 500 }
      );
    }

    // 4. Guul: Soo Celinta Jidka Redirect-ka
    return NextResponse.json({
      message: "Paytrail payment created successfully",
      redirectUrl: result.redirectUrl
    }, { status: 200 });

  } catch (error) {
    // Hubi inuu soo celiyo JSON xitaa haddii ay dhacdo khalad kedis ah
    console.error('Khalad Dhacay (Global Catch):', error);
    return NextResponse.json(
      { error: 'Khalad dhacay: Waan ka xunnahay, dib u eeg server-ka console-ka.' },
      { status: 500 }
    );
  }
}