'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { db } from '../../lib/firebase'; 
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    const finalizeOrder = async () => {
      // 1. Hubi in Paytrail ay leedahay status=ok
      const checkoutStatus = searchParams.get('checkout-status');
      
      if (checkoutStatus === 'ok') {
        try {
          // ⭐ Halkan ayaan Firestore ku qoreynaa xogta dalabka
          await addDoc(collection(db, "tilaukset"), {
            orderId: searchParams.get('checkout-stamp'),
            // Paytrail waxay xogtan ku soo celisaa URL-ka (GET parameters)
            etunimi: searchParams.get('checkout-firstname') || "Asiakas",
            email: searchParams.get('checkout-email') || "Ei sähköpostia",
            hinta: Number(searchParams.get('checkout-amount')) / 100,
            // Xogta dheeriga ah (Status)
            status: 'pending', 
            paymentStatus: 'paid', // Tan ayaa fure u ah inuu Dashboard-ka ka soo muuqdo
            createdAt: serverTimestamp(),
          });
          
          setStatus('success');
        } catch (error) {
          console.error("Firestore Error:", error);
          setStatus('success'); // Inkastoo Firestore dhibo, lacagtu waa OK
        }
      } else {
        setStatus('error');
      }
    };

    finalizeOrder();
  }, [searchParams]);

  if (status === 'loading') return <div className="min-h-screen flex items-center justify-center bg-[#f4f6fb] font-black text-[#006d67] italic animate-pulse">VAHVISTETAAN TILAUSTA...</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f4f6fb] p-6 text-center font-[Poppins]">
      <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl max-w-lg border-t-8 border-[#006d67]">
        {status === 'success' ? (
          <>
            <CheckCircle2 className="text-[#006d67] mx-auto mb-6" size={80} />
            <h1 className="text-4xl font-black text-[#006d67] uppercase italic mb-4 leading-none tracking-tighter">KIITOS!</h1>
            <p className="font-bold text-gray-500 mb-8 italic">Maksusi on vahvistettu ja tiedot on tallennettu.</p>
            <button 
              onClick={() => router.push('/admin')} 
              className="w-full bg-[#006d67] text-white py-4 rounded-2xl font-black uppercase italic shadow-xl tracking-widest hover:scale-105 transition-all"
            >
              TARKISTA DASHBOARD
            </button>
          </>
        ) : (
          <>
            <XCircle className="text-red-500 mx-auto mb-6" size={80} />
            <h1 className="text-4xl font-black text-red-500 uppercase italic mb-4 leading-none">VIRHE!</h1>
            <p className="font-bold text-gray-500 mb-8 italic">Maksua ei voitu vahvistaa.</p>
            <button onClick={() => router.push('/services')} className="w-full bg-gray-200 text-gray-700 py-4 rounded-2xl font-black uppercase italic">TAKAISIN</button>
          </>
        )}
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Ladataan...</div>}>
      <SuccessContent />
    </Suspense>
  );
}