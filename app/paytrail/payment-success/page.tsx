'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle, Home, Loader2 } from 'lucide-react';
import Link from 'next/link';

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get('orderId') || searchParams.get('checkout-reference');
  const [verifying, setVerifying] = useState(true);

  useEffect(() => {
    async function verifyPayment() {
      if (orderId) {
        try {
          // Wuxuu la hadlaa API-ga verify si Firestore loo cusboonaysiiyo
          await fetch(`/api/paytrail/verify?orderId=${orderId}`);
        } catch (error) {
          console.error("Verification error:", error);
        } finally {
          setVerifying(false);
        }
      } else {
        setVerifying(false);
      }
    }
    verifyPayment();
  }, [orderId]);

  return (
    <div className="min-h-screen bg-[#f4f6fb] flex items-center justify-center p-6 font-[Poppins]">
      <div className="bg-white p-12 rounded-[3rem] shadow-2xl text-center max-w-md w-full border border-gray-100">
        {verifying ? (
          <div className="space-y-4">
            <Loader2 className="animate-spin mx-auto text-[#006d67]" size={48} />
            <p className="font-bold text-gray-500 uppercase italic text-xs">Vahvistetaan maksua...</p>
          </div>
        ) : (
          <>
            <div className="bg-green-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
              <CheckCircle size={60} />
            </div>
            
            <h1 className="text-3xl font-black text-[#006d67] mb-2 uppercase italic tracking-tighter">Maksu Onnistui!</h1>
            <p className="text-gray-400 font-bold mb-2 text-xs">Tilaus: {orderId}</p>
            <p className="text-gray-500 font-medium mb-8 italic text-sm leading-relaxed">
              Kiitos tilauksestasi. Olemme vastaanottaneet maksunne ja lääkärimme ottaa teihin yhteyttä pian.
            </p>

            <Link href="/" className="w-full inline-flex items-center justify-center gap-2 bg-[#006d67] text-white py-4 rounded-2xl font-black text-lg shadow-xl hover:bg-[#005a54] transition-all transform active:scale-95 uppercase italic tracking-widest">
              <Home size={20} /> ETUSIVULLE
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div>Ladataan...</div>}>
      <SuccessContent />
    </Suspense>
  );
}