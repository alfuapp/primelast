'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { db } from '../../lib/firebase'; // ⭐ WAA TAN SAXDA AH HADDA
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
          // ⭐ MASHIINKA XOGTA: Halkan ayuu magacaaga ka soo qabanayaa URL-ka
          await addDoc(collection(db, "tilaukset"), {
            orderId: orderId,
            
            // Magaca: Wuxuu ka raadinayaa 'name' oo ah kii foomka aad ku qortay
            etunimi: searchParams.get('name') || searchParams.get('checkout-firstname') || "Asiakas",
            sukunimi: searchParams.get('checkout-lastname') || "",
            
            // Email-ka dhabta ah
            email: searchParams.get('email') || searchParams.get('checkout-email') || "Ei sähköpostia",
            
            // Xogta kale
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
      <p className="font-black text-[#006d67] uppercase italic">Vahvistetaan varausta...</p>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f4f6fb] p-6 text-center font-[Poppins]">
      <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl max-w-lg border-t-8 border-[#006d67]">
        <CheckCircle2 className="text-[#006d67] mx-auto mb-6" size={80} />
        <h1 className="text-4xl font-black text-[#006d67] uppercase italic mb-4">KIITOS!</h1>
        <p className="font-bold text-gray-400 mb-8 italic text-[10px] uppercase tracking-widest leading-relaxed">
          Maksu ja varaus on vastaanotettu onnistuneesti.
        </p>
        <button onClick={() => router.push('/')} className="w-full bg-[#006d67] text-white py-4 rounded-2xl font-black uppercase italic shadow-xl tracking-widest hover:bg-black transition-all">
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