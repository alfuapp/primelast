'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
// Jidka saxda ah ee galka 'lib' (Hubi inuu yahay ../../lib/firebase haddii uu labo heer kor u jiro)
import { db } from '../../lib/firebase'; 
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { CheckCircle, ArrowRight, Loader2 } from 'lucide-react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [saving, setSaving] = useState(true);

  useEffect(() => {
    const saveOrder = async () => {
      const orderId = searchParams.get('orderId');
      const status = searchParams.get('checkout-status');

      // 1. Kaliya keydi haddii lacagtu ay 'ok' tahay (Status ka yimid Paytrail)
      if (orderId && (status === 'ok' || status === 'pending')) {
        try {
          // 2. Firestore ku qor xogta dhabta ah ee laga soo akhriyey URL-ka
          await setDoc(doc(db, "tilaukset", orderId), {
            orderId: orderId,
            etunimi: searchParams.get('etunimi') || "Asiakas",
            sukunimi: searchParams.get('sukunimi') || "",
            puh: searchParams.get('puh') || "Ei numeroa",
            email: searchParams.get('email') || "Ei sähköpostia",
            viesti: searchParams.get('viesti') || "",
            palvelu: searchParams.get('palvelu'),
            // Xisaabta Kela ee 4-ta adeeg
            hinta: Number(searchParams.get('hinta')),
            totalAmount: Number(searchParams.get('totalAmount')),
            kelaShare: Number(searchParams.get('kelaShare')),
            paiva: searchParams.get('paiva') || "",
            aika: searchParams.get('aika') || "",
            paymentStatus: 'paid',
            status: 'pending',
            transactionId: searchParams.get('checkout-transaction-id') || "T-TEST",
            createdAt: serverTimestamp()
          });
          
          setSaving(false);
        } catch (e) {
          console.error("Firestore Save Error:", e);
          setSaving(false);
        }
      } else {
        // Haddii lacagtu aysan guulaysan
        setSaving(false);
      }
    };

    saveOrder();
  }, [searchParams]);

  if (saving) return (
    <div className="h-screen flex flex-col items-center justify-center bg-white">
      <Loader2 className="animate-spin text-[#006d67] mb-4" size={48} />
      <p className="font-black uppercase italic text-[#006d67]">Vahvistetaan maksua...</p>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6 font-[Poppins]">
      <div className="max-w-md w-full bg-white p-10 text-center shadow-2xl border-t-8 border-[#006d67]">
        <div className="flex justify-center mb-6">
          <CheckCircle size={80} className="text-[#006d67]" />
        </div>
        <h1 className="text-3xl font-black uppercase italic tracking-tighter mb-2">Kiitos!</h1>
        <p className="text-gray-500 font-bold text-sm mb-8 uppercase tracking-widest italic">
          Maksu on vahvistettu, {searchParams.get('etunimi')}!
        </p>
        
        <div className="bg-gray-50 p-6 mb-8 text-left space-y-2 border-l-4 border-[#006d67]">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Tilausnumero</p>
          <p className="font-bold text-lg">#{searchParams.get('orderId')}</p>
          <p className="text-[9px] font-bold text-gray-400 uppercase">Palvelu: {searchParams.get('palvelu')}</p>
        </div>

        <button 
          onClick={() => router.push('/')}
          className="w-full bg-black text-white py-5 font-black uppercase italic tracking-widest flex items-center justify-center gap-3 hover:bg-[#006d67] transition-all shadow-lg"
        >
          Palaa Etusivulle <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center font-black italic uppercase animate-pulse text-[#006d67]">Ladataan...</div>}>
      <SuccessContent />
    </Suspense>
  );
}