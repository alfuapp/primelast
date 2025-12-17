// app/api/paytrail/verify/route.ts

import { NextResponse } from 'next/server';
import { isHmacValid } from '@/paytrail/paytrail-api'; // Hubi in jidkani (path) uu sax yahay

export async function GET(request: Request) {
    const url = new URL(request.url);
    const searchParams = Object.fromEntries(url.searchParams);
    const stamp = searchParams.stamp;

    try {
        // 1. Xaqiijinta HMAC si loo hubiyo in Paytrail ay tahay mida soo dirtay
        // Waa in la isticmaalaa headers-ka iyo query parameters
        const isValid = isHmacValid(request.headers, searchParams);

        if (!isValid) {
            console.error('Verification failed: Invalid HMAC signature.');
            // Haddii HMAC-ku aanu sax ahayn, waxaa la soo celinayaa 403 Forbidden
            return new NextResponse('Forbidden: Invalid signature', { status: 403 });
        }

        // 2. Hubi Xaaladda Bixinta
        const status = searchParams['checkout-status'];
        
        if (status === 'ok') {
            // Haddii bixintu guulaysatay (Status OK)
            // Halkan waxaa lagu qoraa logic-kaaga: xaqiiji amarka, u dir email, iwm.
            
            console.log(`Payment success confirmed for stamp: ${stamp}`);
            
            // Paytrail waxay u baahan tahay jawaab 200 OK si ay u ogaato inaan helnay
            return new NextResponse('Verification successful', { status: 200 });

        } else if (status === 'fail' || status === 'cancel') {
            console.log(`Payment failed or cancelled for stamp: ${stamp}. Status: ${status}`);
            // Xaaladaha kale
            return new NextResponse(`Payment status: ${status}`, { status: 200 });
        }
        
        // Xaalad kasta oo aan la aqoon
        return new NextResponse('Unknown payment status', { status: 200 });

    } catch (error) {
        console.error('Verification API error:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}