import { NextRequest, NextResponse } from 'next/server';
// Kani waa inuu u dhigmaa qaab-dhismeedkaaga: Haddii aad ku jirto app/api/paytrail/verify,
// Waxaad u baahan tahay inaan u baxno 4 jeer si aan u helno paytrail/paytrail-api
import { verifyPaytrailPayment } from '../../../../paytrail/paytrail-api'; 

// Noocyada xogta Paytrail ee loo baahan yahay si loo xaqiijiyo
interface PaytrailQueryParams {
  'checkout-account': string;
  'checkout-algorithm': string;
  'checkout-amount': string;
  'checkout-stamp': string;
  'checkout-reference': string;
  'checkout-status': string;
  'checkout-transaction-id': string;
  signature: string;
}

/**
 * Tani waa jidka Paytrail uu u waco (Callback) si loo xaqiijiyo lacag bixinta.
 * Waa inuu adeegsado GET.
 */
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const queryParams = Object.fromEntries(url.searchParams);
    
    // Xaqiijinta iyo Soo saarista xogta
    const verificationResult = await verifyPaytrailPayment({
      checkoutAccount: queryParams['checkout-account'] as string,
      checkoutAlgorithm: queryParams['checkout-algorithm'] as string,
      checkoutAmount: queryParams['checkout-amount'] as string,
      checkoutStamp: queryParams['checkout-stamp'] as string,
      checkoutReference: queryParams['checkout-reference'] as string,
      checkoutStatus: queryParams['checkout-status'] as string,
      checkoutTransactionId: queryParams['checkout-transaction-id'] as string,
      signature: queryParams['signature'] as string,
    });

    if (!verificationResult.isValid) {
      // Lacag bixinta aan la xaqiijin karin
      return new NextResponse(verificationResult.message, { status: 400 });
    }

    if (verificationResult.status === 'ok') {
        // Halkan waxaad ku qortaa macluumaadka Dalabka Database-ka
        console.log(`SUCCESS: Payment confirmed for reference: ${verificationResult.reference}`);
        
        // Jawaabta OK ee Paytrail
        return new NextResponse('OK', { status: 200 });
    }
    
    // Jawaabta OK ee Paytrail xitaa haddii fashilantay ama sugayso (fail/pending)
    return new NextResponse('OK', { status: 200 });

  } catch (error) {
    console.error('SERVER ERROR (Paytrail Verify):', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}