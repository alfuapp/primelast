import * as crypto from 'crypto';

const MERCHANT_ID = (process.env.PAYTRAIL_MERCHANT_ID || '375917').trim();
const SECRET_KEY = (process.env.PAYTRAIL_SECRET_KEY || 'SAIPPUAKAUPPIAS').trim();
const PAYTRAIL_API_URL = 'https://services.paytrail.com/payments';
const BASE_URL = (process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000').trim();

/**
 * calculateHmac - Waxaa laga soo qaatay tusaalahaaga rasmiga ah
 */
const calculateHmac = (secret: string, params: Record<string, any>, body: any) => {
  const hmacPayload = Object.keys(params)
    .sort()
    .map((key) => [key, params[key]].join(':'))
    .concat(body ? JSON.stringify(body) : '')
    .join('\n');

  return crypto.createHmac('sha256', secret).update(hmacPayload).digest('hex');
};

export const createPaymentRequest = async (
  orderData: { amount: number; reference: string; items: any[] },
  customerInfo: { email: string; firstName: string; lastName: string }
) => {
  const stamp = new Date().getTime().toString();
  const nonce = Array.from(crypto.getRandomValues(new Uint8Array(16)))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  const timestamp = new Date().toISOString();

  // Kani waa Body-ga (Payload)
  const body = {
    stamp,
    reference: orderData.reference,
    amount: orderData.amount,
    currency: 'EUR',
    language: 'FI',
    items: orderData.items,
    customer: customerInfo,
    redirectUrls: {
      success: `${BASE_URL}/payment-success?stamp=${stamp}`,
      cancel: `${BASE_URL}/payment-cancel?stamp=${stamp}`,
    },
    callbackUrls: {
      success: `${BASE_URL}/api/paytrail/verify?stamp=${stamp}`,
      cancel: `${BASE_URL}/api/paytrail/verify?stamp=${stamp}`,
    },
  };

  // Kani waa Madaxyada (Headers)
  const headers = {
    'checkout-account': MERCHANT_ID,
    'checkout-algorithm': 'sha256',
    'checkout-method': 'POST',
    'checkout-nonce': nonce,
    'checkout-timestamp': timestamp,
  };

  // Xisaabi HMAC adoo isticmaalaya shaqadii rasmiga ahayd
  const hmac = calculateHmac(SECRET_KEY, headers, body);

  try {
    const response = await fetch(PAYTRAIL_API_URL, {
      method: 'POST',
      headers: {
        ...headers,
        'Content-Type': 'application/json; charset=utf-8',
        'signature': hmac,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Paytrail Error Body:', data);
      throw new Error(data.message || 'Signature mismatch');
    }

    return { success: true, url: data.href };
  } catch (error: any) {
    console.error('Paytrail Request Error:', error.message);
    return { success: false, error: error.message };
  }
};