'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CreditCard, Loader2, ArrowLeft, Lock } from 'lucide-react';

function PaytrailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const orderId = searchParams.get('orderId');
  const amount = searchParams.get('amount');
  
  const [isRedirecting, setIsRedirecting] = useState(false);

  const handlePaymentRedirect = async () => {
    if (!orderId || !amount) {
      alert("Tilaustiedot puuttuvat.");
      return;
    }
    
    setIsRedirecting(true);
    try {
      // 1. Wac API-ga Backend-ka si loo abuuro xiriirka Paytrail
      const response = await fetch('/api/paytrail/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, amount }),
      });

      const data = await response.json();

      // 2. ✅ HUBI: Halkan waa halka isbeddelka weyn uu ku jiro
      if (data.success && data.href) {
        // Tan ayaa ku geeynaysa bogga bangiga (Paytrail) ee kuuma dirayso galkaaga Success-ka
        window.location.href = data.href; 
      } else {
        throw new Error(data.error || "Maksun aloitus epäonnistui");
      }
    } catch (error: any) {
      console.error("Payment error:", error);
      alert("Virhe: " + error.message);
      setIsRedirecting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f6fb] py-12 px-6 font-[Poppins]">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100">
          <div className="bg-[#006d67] p-10 text-center text-white relative overflow-hidden">
            <div className="relative z-10">
              <div className="bg-white/20 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-4 backdrop-blur-md">
                <CreditCard size={40} />
              </div>
              <h1 className="text-3xl font-black uppercase italic tracking-tighter leading-none">Vahvista Maksu</h1>
              <p className="text-white/70 font-bold mt-2 uppercase text-[10px] tracking-widest">Suojattu Paytrail-yhteys</p>
            </div>
            <Lock className="absolute top-0 right-0 opacity-10 transform translate-x-10 -translate-y-10" size={200} />
          </div>

          <div className="p-10 space-y-8 text-center">
            <div className="bg-gray-50 rounded-[2.5rem] p-8 border-2 border-dashed border-gray-200">
              <p className="text-gray-400 font-black uppercase text-[10px] italic mb-2 tracking-widest leading-none">Tilaus: {orderId}</p>
              <p className="text-5xl font-black text-[#E63946] leading-none">{amount}€</p>
            </div>

            <button 
              onClick={handlePaymentRedirect}
              disabled={isRedirecting}
              className="w-full bg-[#E63946] text-white py-6 rounded-[2rem] font-black text-2xl shadow-xl hover:bg-[#c82f3b] transition-all transform active:scale-95 uppercase italic flex items-center justify-center gap-3 tracking-tighter"
            >
              {isRedirecting ? (
                <><Loader2 className="animate-spin" /> SIIRRYTÄÄN PANKKIIN...</>
              ) : (
                "VAHVISTA JA MAKSA NYT →"
              )}
            </button>
            
            <button onClick={() => router.back()} className="w-full text-center text-gray-400 font-bold text-xs uppercase tracking-widest italic">
              <ArrowLeft size={14} className="inline mr-2" /> Takaisin
            </button>
          </div>
        </div>
        
        <p className="mt-8 text-center text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] italic">
          100% Turvallinen ja suojattu maksuliikenne
        </p>
      </div>
    </div>
  );
}

export default function PaytrailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-black text-[#006d67] italic uppercase">Ladataan...</div>}>
      <PaytrailContent />
    </Suspense>
  );
}