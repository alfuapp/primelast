'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { db } from '../lib/firebase'; // ⭐ Xariiqda aad saxday
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { CheckCircle2, Loader2 } from 'lucide-react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const finalizeOrder = async () => {
      const checkoutStatus = searchParams.get('checkout-status');
      const orderId = searchParams.get('checkout-stamp');
      
      if (checkoutStatus === 'ok' && orderId) {
        try {
          // ⭐ MASHIINKA XOGTA: Halkan ayaan ku daray "|| searchParams.get('name')"
          await addDoc(collection(db, "tilaukset"), {
            orderId: orderId,
            
            // Magaca: Haddii uu Paytrail ka waayo, wuxuu ka raadinayaa 'name'
            etunimi: searchParams.get('checkout-firstname') || searchParams.get('name') || "Asiakas",
            sukunimi: searchParams.get('checkout-lastname') || "",
            
            // Email-ka: Haddii uu Paytrail ka waayo, wuxuu ka raadinayaa 'email'
            email: searchParams.get('checkout-email') || searchParams.get('email') || "Ei sähköpostia",
            
            // Xogta kale ee horey u shaqaynaysay
            puh: searchParams.get('puh') || "Ei numeroa", 
            viesti: searchParams.get('viesti') || "Ei viestiä",
            palvelu: searchParams.get('palvelu') || "Palvelu",
            
            hinta: Number(searchParams.get('checkout-amount')) / 100,
            status: 'pending',
            paymentStatus: 'paid', 
            createdAt: serverTimestamp(),
          });
          setLoading(false);
        } catch (error) {
          console.error("Firebase Error:", error);
          setLoading(false);
        }
      }
    };
    finalizeOrder();
  }, [searchParams]);

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f4f6fb]">
      <Loader2 className="animate-spin text-[#006d67] mb-4" size={40} />
      <p className="font-black text-[#006d67] uppercase italic tracking-widest">Tallennetaan varausta...</p>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f4f6fb] p-6 text-center font-[Poppins]">
      <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl max-w-lg border-t-8 border-[#006d67]">
        <CheckCircle2 className="text-[#006d67] mx-auto mb-6" size={80} />
        <h1 className="text-4xl font-black text-[#006d67] uppercase italic mb-4 leading-none tracking-tighter">KIITOS!</h1>
        <p className="font-bold text-gray-400 mb-8 italic text-[10px] uppercase tracking-widest">
          Maksu ja varaus on vahvistettu.
        </p>
        <button onClick={() => router.push('/')} className="w-full bg-[#006d67] text-white py-4 rounded-2xl font-black uppercase italic">
          ETUSIVULLE
        </button>
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