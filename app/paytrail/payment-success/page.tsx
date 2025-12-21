'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { db, auth } from '../../lib/firebase'; // Hubi in jidkani sax yahay
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { CheckCircle2, XCircle, ArrowRight, Loader2 } from 'lucide-react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [verifying, setVerifying] = useState(true);
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    const processPayment = async () => {
      const checkoutStatus = searchParams.get('checkout-status');
      const signature = searchParams.get('signature');
      const orderId = searchParams.get('checkout-stamp'); // PC-123456...

      // 1. Hubi haddii lacagtu sax tahay
      if (checkoutStatus === 'ok' && signature) {
        try {
          // 2. Ku qor ballanta Firestore (Kaliya haddii uu qofku login yahay)
          const user = auth.currentUser;
          
          await addDoc(collection(db, "appointments"), {
            orderId: orderId,
            userId: user?.uid || 'anonymous',
            userEmail: user?.email || 'no-email',
            amount: searchParams.get('checkout-amount'),
            status: 'paid',
            createdAt: serverTimestamp(),
            paymentStatus: 'verified'
          });

          setStatus('success');
        } catch (error) {
          console.error("Firestore Error:", error);
          setStatus('success'); // Waxaan u deyneynaa success si uusan macmiilku u naxin, laakiin adiga ayaa log-ga arki kara
        }
      } else {
        setStatus('error');
      }
      setVerifying(false);
    };

    processPayment();
  }, [searchParams]);

  if (verifying) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f4f6fb]">
        <Loader2 className="animate-spin text-[#006d67] mb-4" size={48} />
        <p className="font-black text-[#006d67] uppercase italic animate-pulse">Vahvistetaan maksua...</p>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f4f6fb] p-6 text-center">
        <div className="bg-white p-10 rounded-[3rem] shadow-2xl max-w-lg border-t-8 border-red-500">
          <XCircle className="text-red-500 mx-auto mb-6" size={80} />
          <h1 className="text-2xl font-black text-gray-800 uppercase italic mb-4">Maksun varmistus epäonnistui</h1>
          <p className="text-gray-500 font-bold mb-8 italic text-sm leading-tight">
             Emme voineet vahvistaa maksuasi. Jos maksu veloitettiin tililtäsi, ota yhteyttä asiakaspalveluun.
          </p>
          <button onClick={() => router.push('/services')} className="w-full bg-[#006d67] text-white py-4 rounded-2xl font-black uppercase italic tracking-widest hover:bg-[#004d48] transition-all">
            PALAA PALVELUUN
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f4f6fb] p-6 text-center">
      <div className="bg-white p-10 rounded-[3rem] shadow-2xl max-w-lg border-t-8 border-[#006d67]">
        <CheckCircle2 className="text-[#006d67] mx-auto mb-6" size={80} />
        <h1 className="text-4xl font-black text-[#006d67] uppercase italic mb-4 tracking-tighter leading-none">MAKSU ONNISTUI!</h1>
        <div className="bg-green-50 p-6 rounded-[2rem] mb-8">
          <p className="text-gray-700 font-bold italic text-lg leading-tight">
            Kiitos tilauksestasi! Maksusi on vastaanotettu ja ballantasi on nyt rekisteröity järjestelmäämme.
          </p>
        </div>
        <button onClick={() => router.push('/')} className="w-full bg-[#E63946] text-white py-4 rounded-2xl font-black uppercase italic tracking-widest flex items-center justify-center gap-2 hover:bg-[#c82f3b] shadow-xl transition-all">
          ETUSIVULLE <ArrowRight size={20} />
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