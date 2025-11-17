import { createHmac } from 'crypto';

// Xogta API-ga - ISTICMAAL DEGAANKAAGA SIDA KA HOR
// API Credentials - USE YOUR ENVIRONMENT VARIABLES AS BEFORE
const PAYTRAIL_MERCHANT_ID = process.env.PAYTRAIL_MERCHANT_ID || '375917'; // Tusaale ID (Example ID)
const PAYTRAIL_SECRET_KEY = process.env.PAYTRAIL_SECRET_KEY || 'SAIPPUAKUPPI'; // Tusaale Key (Example Key)

const API_ROOT = 'https://services.paytrail.com';

// ===============================================
// NOOCYADA XOGTA (TYPESCRIPT INTERFACES)
// ===============================================

// Shaxda Looga Baahan Yahay API Route-ka
// Required Schema for the API Route
export interface PaytrailRequest {
  amount: number; // Tusaale: 2500 (25.00 Euro)
  reference: string;
  customer: {
    email: string;
  };
  priceId: string; // 🟢 INCLUDED: Reference for the service (used as product code). Tixraaca adeegga.
}

// Qaabka Xogta Lacag Bixinta (Waxa loo gudbiyo Paytrail)
// Paytrail Payment Payload Structure
interface PaytrailPaymentPayload {
  stamp: string;
  reference: string;
  amount: number;
  currency: 'EUR';
  language: 'FI';
  items: Array<{
    unitPrice: number;
    units: number;
    vatPercentage: number;
    productCode: string; // We use priceId here
    deliveryAddress: null;
  }>;
  customer: {
    email: string;
  };
  // Kuwani waa meelaha uu Paytrail dib kuugu soo celinayo
  // URLs Paytrail calls back to
  callbackUrls: {
    success: string;
    cancel: string;
  };
  redirectUrls: {
    success: string;
    cancel: string;
  };
}

interface PaytrailCreationResponse {
  transactionId: string;
  href: string; // URL-ka lacag bixinta (Payment URL)
  redirectUrl: string; // URL-ka xulashada hababka lacag bixinta (Redirect URL to payment method selection)
}

interface PaytrailVerificationParams {
    checkoutAccount: string;
    checkoutAlgorithm: string;
    checkoutAmount: string;
    checkoutStamp: string;
    checkoutReference: string;
    checkoutStatus: string;
    checkoutTransactionId: string;
    signature: string;
}


// ===============================================
// SHAQOOYINKA WEYN (MAIN FUNCTIONS)
// ===============================================

/**
 * Creates a Paytrail payment.
 * Abuurista lacag bixinta Paytrail.
 * @param {PaytrailRequest} data - The basic order data. Xogta dalabka ee asaasiga ah.
 * @returns {Promise<PaytrailCreationResponse | null>} - The API call result. Natiijada wicitaanka API.
 */
export async function createPaytrailPayment(data: PaytrailRequest): Promise<PaytrailCreationResponse | null> {
    const { amount, reference, customer, priceId } = data;
    
    // Tixraacyada URL-ka ee dib u celinta (Waa inuu u dhigmaa meelaha aad ku soo celinayso)
    // Redirect URLs (must match the destination pages)
    const successUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/payment-success`;
    const cancelUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/payment-cancel`;

    // Qaab-dhismeedka Paytrail u baahan yahay
    // Paytrail's required structure
    const payload: PaytrailPaymentPayload = {
        stamp: reference,
        reference: reference, // Waxaan isticmaalnaa isku mid ahaan Stamp iyo Reference
        amount: amount,
        currency: 'EUR',
        language: 'FI',
        items: [
            {
                unitPrice: amount,
                units: 1,
                vatPercentage: 0,
                productCode: priceId, // Ku dar priceId halkan sida ProductCode
                deliveryAddress: null,
            },
        ],
        customer: customer,
        callbackUrls: {
            success: `${process.env.NEXT_PUBLIC_BASE_URL}/api/paytrail/verify`,
            cancel: `${process.env.NEXT_PUBLIC_BASE_URL}/api/paytrail/verify`,
        },
        redirectUrls: {
            success: successUrl,
            cancel: cancelUrl,
        },
    };

    // 1. Abuurista Header-yada iyo Hash-ka
    // 1. Create Headers and Nonce
    const headers = {
        'checkout-account': PAYTRAIL_MERCHANT_ID,
        'checkout-algorithm': 'sha256',
        'checkout-method': 'POST',
        'checkout-nonce': createHmac('sha256', PAYTRAIL_SECRET_KEY).update(Date.now().toString()).digest('hex'),
        'checkout-timestamp': new Date().toISOString(),
        'content-type': 'application/json; charset=utf-8',
    };
    
    // 2. Abuurista Signature-ka (Hash-ka)
    // 2. Create Signature (Hash)
    const signature = calculateHmac(headers, JSON.stringify(payload), PAYTRAIL_SECRET_KEY);
    headers['signature'] = signature;
    
    // 3. Wicitaanka API
    // 3. API Call
    try {
        const response = await fetch(`${API_ROOT}/payments`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            console.error(`Paytrail API Error: ${response.status} - ${response.statusText}`);
            const errorBody = await response.text();
            console.error('Paytrail Error Response Body:', errorBody);
            return null;
        }

        const data: PaytrailCreationResponse = await response.json();
        return data;
    } catch (error) {
        console.error('Fetch Error:', error);
        return null;
    }
}


/**
 * Verifies the Paytrail Signature before processing the order.
 * Xaqiijinta Paytrail Signature ka hor inta aan la shaqeyn dalabka.
 * @param {PaytrailVerificationParams} params - The URL parameters returned by Paytrail. xuduudaha URL-ka ee Paytrail soo celiyay
 * @returns {object} - The verification result. Natiijada xaqiijinta
 */
export async function verifyPaytrailPayment(params: PaytrailVerificationParams): Promise<{ isValid: boolean, message: string, status?: string, reference?: string }> {
    const { signature, ...paytrailParams } = params;
    
    const status = paytrailParams.checkoutStatus;
    const reference = paytrailParams.checkoutReference;
    
    // 1. U diyaarinta Header-yada sidii Paytrail ay u soo dirtay
    // 1. Prepare Headers as sent by Paytrail
    const headers = {
        'checkout-account': paytrailParams.checkoutAccount,
        'checkout-algorithm': paytrailParams.checkoutAlgorithm,
        'checkout-amount': paytrailParams.checkoutAmount,
        'checkout-reference': paytrailParams.checkoutReference,
        'checkout-stamp': paytrailParams.checkoutStamp,
        'checkout-status': paytrailParams.checkoutStatus,
        'checkout-transaction-id': paytrailParams.checkoutTransactionId,
    };

    // 2. Xisaabinta Signature-ka cusub
    // 2. Calculate the new Signature
    // Muhiim: Xaqiijinta GET method-ku wuxuu u baahan yahay in lagu xisaabiyo xuduudaha la waafajiyay (alphabetical order)
    // Important: GET verification requires calculation on alphabetically sorted parameters
    const calculatedSignature = calculateHmac(headers, '', PAYTRAIL_SECRET_KEY, true);

    if (calculatedSignature === signature) {
        return { 
            isValid: true, 
            message: 'Signature verified successfully.',
            status: status,
            reference: reference,
        };
    } else {
        console.error('Verification failed: Calculated Signature did not match provided Signature.', { 
            calculated: calculatedSignature, 
            provided: signature,
        });
        return { 
            isValid: false, 
            message: 'Signature verification failed. Potential tampering or incorrect secret key.',
        };
    }
}


// ===============================================
// SHAQOOYINKA CAAWINAADA (HELPER FUNCTIONS)
// ===============================================

/**
 * Calculates the HMAC SHA256 Signature for Paytrail.
 * Xisaabinta HMAC SHA256 Signature ee Paytrail.
 * @param {object} headers - HTTP Headers.
 * @param {string} body - Request Body (for POST only). Jirka Codsiga (loogu talagalay POST kaliya).
 * @param {string} secret - Paytrail's Secret Key. Furaha Sirta ah ee Paytrail.
 * @param {boolean} isQuery - True if used for Query parameters (GET). Run haddii loo isticmaalayo xuduudaha Query-ga (GET).
 * @returns {string} - The HMAC Signature. Signature-ka HMAC.
 */
function calculateHmac(headers: Record<string, string>, body: string, secret: string, isQuery: boolean = false): string {
    const hmac = createHmac('sha256', secret);
    
    // Shaqaala xaqiijinta, u kala saar sida Paytrail u doonayo:
    // The verification process requires sorting the parameters as Paytrail expects:
    const keys = Object.keys(headers)
        .filter(key => key.startsWith('checkout-')) // Keliya isticmaal header-yada 'checkout-'
        .sort((a, b) => a.localeCompare(b)); // Ku kala sooc xarfaha (alphabetically)

    const params = keys.map(key => `${headers[key]}`).join('\n');
    
    hmac.update(params);
    
    // POST-ka wuxuu sidoo kale u baahan yahay body-ga
    // POST request also needs the body
    if (!isQuery) {
        hmac.update('\n' + body);
    }

    return hmac.digest('hex');
}