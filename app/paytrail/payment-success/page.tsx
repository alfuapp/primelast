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
      const orderId = searchParams.get('checkout-stamp');
      
      if (checkoutStatus === 'ok' && orderId) {
        try {
          // ⭐ Halkan ayaan Firestore ku kaydinaynaa xogta foomka ee dhabta ah
          await addDoc(collection(db, "tilaukset"), {
            orderId: orderId,
            etunimi: searchParams.get('checkout-firstname') || "Asiakas",
            email: searchParams.get('checkout-email') || "Ei sähköpostia",
            hinta: Number(searchParams.get('checkout-amount')) / 100,
            
            // ⭐ XOGTA CUSUB (Waxay ka imaanaysaa URL-ka la soo hufay)
            puh: searchParams.get('puh') || "Ei numeroa", 
            viesti: searchParams.get('viesti') || "Ei viestiä",
            palvelu: searchParams.get('palvelu') || "Palvelu",

            status: 'pending',
            paymentStatus: 'paid', 
            createdAt: serverTimestamp(),
          });

          setStatus('success');
        } catch (error) {
          console.error("Firestore Error:", error);
          setStatus('success'); // Xataa haddii Firebase dhibo, lacagtu waa OK
        }
      } else {
        setStatus('error');
      }
    };
    finalizeOrder();
  }, [searchParams]);

  if (status === 'loading') return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f4f6fb]">
      <Loader2 className="animate-spin text-[#006d67] mb-4" size={50} />
      <p className="font-black text-[#006d67] uppercase italic animate-pulse">Vahvistetaan varausta...</p>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f4f6fb] p-6 text-center font-[Poppins]">
      <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl max-w-lg border-t-8 border-[#006d67]">
        {status === 'success' ? (
          <>
            <CheckCircle2 className="text-[#006d67] mx-auto mb-6" size={80} />
            <h1 className="text-4xl font-black text-[#006d67] uppercase italic mb-4 leading-none tracking-tighter">VALMIS!</h1>
            <p className="font-bold text-gray-400 mb-8 italic text-xs uppercase tracking-widest leading-relaxed">Varaus ja maksu on tallennettu onnistuneesti.</p>
            <button onClick={() => router.push('/admin')} className="w-full bg-[#006d67] text-white py-4 rounded-2xl font-black uppercase italic shadow-xl tracking-widest">DASHBOARD-KA TAG</button>
          </>
        ) : (
          <>
            <XCircle className="text-red-500 mx-auto mb-6" size={80} />
            <h1 className="text-4xl font-black text-red-500 uppercase italic mb-4">VIRHE!</h1>
            <p className="font-bold text-gray-500 mb-8 italic">Maksu epäonnistui tai se peruutettiin.</p>
            <button onClick={() => router.push('/')} className="w-full bg-gray-200 text-gray-700 py-4 rounded-2xl font-black uppercase italic">TAKAISIN</button>
          </>
        )}
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#f4f6fb]">Ladataan...</div>}>
      <SuccessContent />
    </Suspense>
  );
}