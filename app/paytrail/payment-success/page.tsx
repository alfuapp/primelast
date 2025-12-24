'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
// ⭐ Hubi in jidka (path) Firebase uu sax yahay marka loo eego sawirkaaga 469e08
import { db } from '../../lib/firebase'; 
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    const finalizeOrder = async () => {
      // 1. Hubi in Paytrail ay soo celisay status sax ah
      const checkoutStatus = searchParams.get('checkout-status');
      const orderId = searchParams.get('checkout-stamp');
      
      if (checkoutStatus === 'ok' && orderId) {
        try {
          // ⭐ Halkan ayaan Firestore ku kaydinaynaa xogta rasmiga ah ee macmiilka
          await addDoc(collection(db, "tilaukset"), {
            orderId: orderId,
            // Waxaan ka soo saaraynaa URL-ka macluumaadka macmiilka ee dhabta ah
            etunimi: searchParams.get('checkout-firstname') || "Asiakas",
            sukunimi: searchParams.get('checkout-lastname') || "",
            email: searchParams.get('checkout-email') || "Ei sähköpostia",
            // Paytrail waxay lacagta ku soo celisaa senti (cents), markaa waxaan u qaybinaynaa 100
            hinta: Number(searchParams.get('checkout-amount')) / 100,
            status: 'pending',
            paymentStatus: 'paid', // Tani waxay Dashboard-ka ka dhigaysaa mid cagaar ah
            createdAt: serverTimestamp(),
            paymentMethod: searchParams.get('checkout-provider') || "Paytrail"
          });

          setStatus('success');
        } catch (error) {
          console.error("Firestore Error:", error);
          // Haddii lacagtu OK tahay laakiin Firestore dhibo, weli macmiilka tus 'success'
          setStatus('success'); 
        }
      } else {
        setStatus('error');
      }
    };

    finalizeOrder();
  }, [searchParams]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f4f6fb] font-black text-[#006d67] italic italic">
        <Loader2 className="animate-spin mb-4" size={40} />
        <p className="uppercase tracking-widest text-xs">Vahvistetaan varausta...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f4f6fb] p-6 text-center font-[Poppins]">
      <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl max-w-lg border-t-8 border-[#006d67] transition-all transform hover:scale-105">
        {status === 'success' ? (
          <>
            <CheckCircle2 className="text-[#006d67] mx-auto mb-6 shadow-sm" size={80} />
            <h1 className="text-4xl font-black text-[#006d67] uppercase italic mb-4 leading-none tracking-tighter">KIITOS!</h1>
            <p className="font-bold text-gray-500 mb-8 italic text-sm leading-relaxed uppercase tracking-widest">
              Maksusi on vahvistettu rasmiga ah. PrimeCare aloittaa käsittelyn pian.
            </p>
            <div className="space-y-3">
              <button 
                onClick={() => router.push('/admin')} 
                className="w-full bg-[#006d67] text-white py-4 rounded-2xl font-black uppercase italic shadow-xl hover:bg-[#004d48] transition-all"
              >
                TARKISTA DASHBOARD
              </button>
              <button 
                onClick={() => router.push('/')} 
                className="w-full bg-gray-100 text-gray-500 py-3 rounded-2xl font-black uppercase italic text-[10px] tracking-widest"
              >
                ETUSIVULLE
              </button>
            </div>
          </>
        ) : (
          <>
            <XCircle className="text-red-500 mx-auto mb-6" size={80} />
            <h1 className="text-4xl font-black text-red-500 uppercase italic mb-4 leading-none tracking-tighter">VIRHE!</h1>
            <p className="font-bold text-gray-500 mb-8 italic text-xs uppercase tracking-widest">
              Maksu epäonnistui tai se peruutettiin. Kokeile uudelleen.
            </p>
            <button 
              onClick={() => router.push('/services')} 
              className="w-full bg-gray-200 text-gray-700 py-4 rounded-2xl font-black uppercase italic"
            >
              TAKAISIN PALVELUIHIN
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#f4f6fb]">
        <Loader2 className="animate-spin text-[#006d67]" size={40} />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}