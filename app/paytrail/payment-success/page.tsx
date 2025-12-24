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
      const checkoutStatus = searchParams.get('checkout-status');
      
      if (checkoutStatus === 'ok') {
        try {
          // ⭐ Halkan ayaan Firestore ku kaydinaynaa xogta foomka ee dhabta ah
          await addDoc(collection(db, "tilaukset"), {
            orderId: searchParams.get('checkout-stamp'),
            etunimi: searchParams.get('checkout-firstname') || "Asiakas",
            sukunimi: searchParams.get('checkout-lastname') || "",
            email: searchParams.get('checkout-email') || "Ei sähköpostia",
            hinta: Number(searchParams.get('checkout-amount')) / 100,
            
            // ⭐ KUWAN AYAA HADDA MUHIIM AH:
            puh: searchParams.get('puh') || "Ei puhelinnumeroa", 
            viesti: searchParams.get('viesti') || "Ei viestiä",
            palvelu: searchParams.get('palvelu') || "Palvelu",

            status: 'pending',
            paymentStatus: 'paid', 
            createdAt: serverTimestamp(),
          });

          setStatus('success');
        } catch (error) {
          console.error("Firestore Error:", error);
          setStatus('success'); 
        }
      } else {
        setStatus('error');
      }
    };
    finalizeOrder();
  }, [searchParams]);

  if (status === 'loading') return <div className="min-h-screen flex items-center justify-center bg-[#f4f6fb] font-black text-[#006d67] italic animate-pulse">VAHVISTETAAN...</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f4f6fb] p-6 text-center font-[Poppins]">
      <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl max-w-lg border-t-8 border-[#006d67]">
        {status === 'success' ? (
          <>
            <CheckCircle2 className="text-[#006d67] mx-auto mb-6" size={80} />
            <h1 className="text-4xl font-black text-[#006d67] uppercase italic mb-4 leading-none">GUUL!</h1>
            <p className="font-bold text-gray-500 mb-8 italic">Maksusi on vahvistettu. Kaikki tiedot on tallennettu.</p>
            <button onClick={() => router.push('/admin')} className="w-full bg-[#006d67] text-white py-4 rounded-2xl font-black uppercase italic shadow-xl">DASHBOARD-KA TAG</button>
          </>
        ) : (
          <div className="text-red-500 font-black italic uppercase">Maksu epäonnistui!</div>
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