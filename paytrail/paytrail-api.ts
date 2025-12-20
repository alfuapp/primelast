import * as crypto from 'crypto';

const MERCHANT_ID = (process.env.PAYTRAIL_MERCHANT_ID || '375917').trim();
const SECRET_KEY = (process.env.PAYTRAIL_SECRET_KEY || 'SAIPPUAKAUPPIAS').trim();
const PAYTRAIL_API_URL = 'https://services.paytrail.com/payments';
const BASE_URL = (process.env.NEXT_PUBLIC_BASE_URL || 'https://www.primecare.fi').trim();

// 1. SHAQADA HUBISA SIGNATURE-KA (Verification) - Tan ayaa dhismaha fashilisay
export const isHmacValid = (params: Record<string, string | string[] | undefined>, secret: string): boolean => {
  const hmac = params['signature'];
  if (!hmac || Array.isArray(hmac)) return false;

  const keys = Object.keys(params)
    .filter((key) => key.startsWith('checkout-'))
    .sort();

  const hmacPayload = keys
    .map((key) => `${key}:${params[key]}`)
    .join('\n');

  const calculatedHmac = crypto
    .createHmac('sha256', secret)
    .update(hmacPayload)
    .digest('hex');

  return calculatedHmac === hmac;
};

// 2. Shaqada xisaabisa HMAC (Payload Signing)
const calculateHmac = (secret: string, params: Record<string, any>, body: any) => {
  const hmacPayload = Object.keys(params)
    .sort()
    .map((key) => [key, params[key]].join(':'))
    .concat(body ? JSON.stringify(body) : '')
    .join('\n');
  return crypto.createHmac('sha256', secret).update(hmacPayload).digest('hex');
};

// 3. Shaqada dhalisa lacag bixinta
export const createPaymentRequest = async (amountInEuro: number, customerInfo: any, serviceName: string) => {
  const amountInCents = Math.round(amountInEuro * 100); // U beddel Integer (cents)
  const stamp = `PC-${Date.now()}`;
  const nonce = crypto.randomBytes(16).toString('hex');
  const timestamp = new Date().toISOString();

  const body = {
    stamp: stamp,
    reference: stamp,
    amount: amountInCents,
    currency: 'EUR',
    language: 'FI',
    items: [
      {
        unitPrice: amountInCents,
        units: 1,
        vatPercentage: 25.5,
        productCode: 'PC-001',
        description: serviceName,
        deliveryDate: new Date().toISOString().split('T')[0],
      }
    ],
    customer: {
      email: customerInfo.email || 'asiakas@primecare.fi',
      firstName: customerInfo.firstName,
      lastName: customerInfo.lastName || '',
      phone: customerInfo.phone,
    },
    redirectUrls: {
      // Halkan waxaa loogu talagalay macmiilka (Browser-ka)
      success: `${BASE_URL}/paytrail/payment-success`, 
  cancel: `${BASE_URL}/paytrail/payment-cancel`,
    },
    callbackUrls: {
      // Halkan waxaa loogu talagalay Paytrail inay xogta ku soo xaqiijiso (Background)
      success: `${BASE_URL}/api/paytrail/verify`,
      cancel: `${BASE_URL}/api/paytrail/verify`,
    }
  };

  const headers = {
    'checkout-account': MERCHANT_ID,
    'checkout-algorithm': 'sha256',
    'checkout-method': 'POST',
    'checkout-nonce': nonce,
    'checkout-timestamp': timestamp,
  };

  const signature = calculateHmac(SECRET_KEY, headers, body);

  try {
    const response = await fetch(PAYTRAIL_API_URL, {
      method: 'POST',
      headers: {
        ...headers,
        'Content-Type': 'application/json; charset=utf-8',
        'signature': signature,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    if (!response.ok) return { success: false, error: data.message || 'Payment failed' };
    return { success: true, url: data.href };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};