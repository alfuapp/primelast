'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CreditCard, ShieldCheck, ArrowLeft, Loader2, Lock } from 'lucide-react';

function PaytrailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const orderId = searchParams.get('orderId');
  const amount = searchParams.get('amount');
  
  const [loading, setLoading] = useState(true);
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (!orderId) {
      router.push('/'); 
    }
    setLoading(false);
  }, [orderId, router]);

  const handlePaymentRedirect = async () => {
    setIsRedirecting(true);
    try {
      // 1. Wac API-ga Backend-ka
      const response = await fetch('/api/paytrail/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: orderId,
          amount: amount,
        }),
      });

      const data = await response.json();

      // 2. Akhri 'href' ee uu Backend-ku soo celiyey
      if (data.href) {
        window.location.href = data.href;
      } else {
        alert("Maksua ei voitu aloittaa. Yritä uudelleen.");
        setIsRedirecting(false);
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert("Yhteysvirhe maksupalveluun.");
      setIsRedirecting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <Loader2 className="animate-spin text-[#006d67]" size={48} />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f4f6fb] py-12 px-6 font-[Poppins]">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100">
          
          <div className="bg-[#006d67] p-10 text-center text-white relative overflow-hidden">
            <div className="relative z-10">
              <div className="bg-white/20 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-4 backdrop-blur-md">
                <CreditCard size={40} />
              </div>
              <h1 className="text-3xl font-black uppercase italic">Maksuvaihe</h1>
              <p className="text-white/70 font-bold mt-2 uppercase text-[10px]">Paytrail-maksuvarmistus</p>
            </div>
            <Lock className="absolute top-0 right-0 opacity-10 transform translate-x-10 -translate-y-10" size={200} />
          </div>

          <div className="p-10 space-y-8">
            <div className="bg-gray-50 rounded-[2rem] p-8 border-2 border-dashed border-gray-200 text-center">
              <p className="text-gray-400 font-black uppercase text-[10px] italic mb-2">Tilaus: {orderId}</p>
              <p className="text-5xl font-black text-[#E63946]">{amount}€</p>
            </div>

            <button 
              onClick={handlePaymentRedirect}
              disabled={isRedirecting}
              className="w-full bg-[#E63946] text-white py-6 rounded-[2rem] font-black text-2xl shadow-xl hover:bg-[#c82f3b] transition-all transform active:scale-95 uppercase flex items-center justify-center gap-3"
            >
              {isRedirecting ? <Loader2 className="animate-spin" /> : "MAKSA NYT →"}
            </button>
            
            <button onClick={() => router.push('/services')} className="w-full text-center text-gray-400 font-bold text-xs uppercase tracking-widest">
              <ArrowLeft size={14} className="inline mr-2" /> Takaisin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaytrailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Ladataan...</div>}>
      <PaytrailContent />
    </Suspense>
  );
}