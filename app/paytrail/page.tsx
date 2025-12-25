'use client';

import React, { Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

function SuccessContent() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const finalizeOrder = async () => {
      const checkoutStatus = searchParams.get('checkout-status');
      const orderId = searchParams.get('checkout-stamp');
      
      if (checkoutStatus === 'ok' && orderId) {
        try {
          // ⭐ HALKAN AYAA AH "MASHIINKA" XOGTA GEEYA FIREBASE
          await addDoc(collection(db, "tilaukset"), {
            orderId: orderId,
            
            // 1. Magaca: Haddii uu Paytrail ka waayo (checkout-firstname), 
            // wuxuu ka raadinayaa URL-ka (name) aan horay ugu dhex qarinay.
            etunimi: searchParams.get('checkout-firstname') || searchParams.get('name') || "Asiakas",
            sukunimi: searchParams.get('checkout-lastname') || "",
            
            // 2. Email-ka: Sidoo kale halkan ayuu ka saxayaa
            email: searchParams.get('checkout-email') || searchParams.get('email') || "Ei sähköpostia",
            
            // 3. Kuwani waa kuwii kuu shaqaynayay (Telefoonka iyo Viestiga)
            puh: searchParams.get('puh') || "Ei numeroa", 
            viesti: searchParams.get('viesti') || "Ei viestiä",
            palvelu: searchParams.get('palvelu') || "Palvelu",
            
            hinta: Number(searchParams.get('checkout-amount')) / 100,
            status: 'pending',
            paymentStatus: 'paid', 
            createdAt: serverTimestamp(),
          });
          console.log("Xogta si sax ah ayaa loo geliyey Firebase!");
        } catch (error) {
          console.error("Firebase Error:", error);
        }
      }
    };
    finalizeOrder();
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f4f6fb]">
       <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl text-center border-t-8 border-[#006d67]">
          <h1 className="text-4xl font-black text-[#006d67] uppercase italic mb-4">Maksi Onnistui!</h1>
          <p className="font-bold text-gray-500 uppercase italic text-xs">Xogtaada waa la keydiyey.</p>
       </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div>Ladataan...</div>}>
      <SuccessContent />
    </Suspense>
  );
}