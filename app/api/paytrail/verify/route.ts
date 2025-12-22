import { NextResponse } from 'next/server';
import { isHmacValid } from '@/paytrail/paytrail-api';

const SECRET_KEY = (process.env.PAYTRAIL_SECRET_KEY || '1fc5463a5d57862dc0ad3a2822708641ba21e6c1f3c4276cdf8b5d385863ccfd0b419c096ecefb86').trim();

export async function GET(request: Request) {
  const url = new URL(request.url);
  const params = Object.fromEntries(url.searchParams.entries());

  // Hubi haddii saxiixa Paytrail uu yahay mid dhab ah
  const isValid = isHmacValid(params, SECRET_KEY);

  if (isValid && params['checkout-status'] === 'ok') {
    // Lacagtu waa guul - u gudbi bogga guusha
    return NextResponse.redirect(new URL('/paytrail/payment-success', request.url));
  }

  // Haddii ay cilad dhacday ama lacagta la baajiyay
  return NextResponse.redirect(new URL('/paytrail/payment-cancel', request.url));
}