import { NextResponse } from 'next/server';
import { isHmacValid } from '@/paytrail/paytrail-api';
import { db } from '../../../lib/firebase';
import { collection, query, where, getDocs, updateDoc, serverTimestamp } from 'firebase/firestore';

const SECRET_KEY = process.env.PAYTRAIL_SECRET_KEY!.trim();

export async function GET(request: Request) {
  const url = new URL(request.url);
  const params = Object.fromEntries(url.searchParams.entries());

  // 1️⃣ Verify HMAC (qodobka ugu muhiimsan)
  const isValid = isHmacValid(params, SECRET_KEY);
  if (!isValid) {
    return new NextResponse('Invalid HMAC', { status: 401 });
  }

  // 2️⃣ Hubi status
  if (params['checkout-status'] !== 'ok') {
    return new NextResponse('Payment not completed', { status: 200 });
  }

  // 3️⃣ Hel orderId (checkout-stamp)
  const orderId = params['checkout-stamp'];
  if (!orderId) {
    return new NextResponse('Missing order id', { status: 400 });
  }

  // 4️⃣ Hel order-ka Firestore
  const q = query(
    collection(db, 'tilaukset'),
    where('orderId', '==', orderId)
  );
  const snap = await getDocs(q);

  if (snap.empty) {
    return new NextResponse('Order not found', { status: 404 });
  }

  // 5️⃣ HALKAN KALIYA ayaad PAID ku qortaa
  await updateDoc(snap.docs[0].ref, {
    paymentStatus: 'paid',
    verifiedAt: serverTimestamp(),
    paytrailTransactionId: params['checkout-transaction-id'] || null,
  });

  // 6️⃣ Paytrail jawaab
  return new NextResponse('OK', { status: 200 });
}
