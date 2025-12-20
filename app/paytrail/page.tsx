// app/paytrail/payment-success/page.tsx
'use client';

import React, { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle2, XCircle, ArrowRight } from 'lucide-react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // ⭐ TALLAABADA UGU MUHIIMSAN: Hubi status-ka ay Paytrail soo dirtay
  const status = searchParams.get('checkout-status');
  const signature = searchParams.get('signature');

  // Haddii uusan jirin signature ama status-ku uusan ahayn 'ok', qofka ceyri
  if (!signature || status !== 'ok') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f4f6fb] p-6">
        <div className="bg-white p-10 rounded-[3rem] shadow-2xl text-center max-w-lg">
          <XCircle className="text-red-500 mx-auto mb-6" size={80} />
          <h1 className="text-3xl font-black text-gray-800 uppercase italic mb-4">MAKSUN VARMISTUS EPÄONNISTUI</h1>
          <p className="text-gray-500 font-bold mb-8">Emme voineet vahvistaa maksuasi. Jos maksu veloitettiin, ota yhteyttä tukeen.</p>
          <button onClick={() => router.push('/services')} className="w-full bg-[#006d67] text-white py-4 rounded-2xl font-black uppercase italic tracking-widest">
            PALAA PALVELUUN
          </button>
        </div>
      </div>
    );
  }

  // ✅ Kaliya haddii status === 'ok' ayuu qofku arki karaa boggan
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f4f6fb] p-6">
      <div className="bg-white p-10 rounded-[3rem] shadow-2xl text-center max-w-lg border-t-8 border-[#006d67]">
        <CheckCircle2 className="text-[#006d67] mx-auto mb-6" size={80} />
        <h1 className="text-4xl font-black text-[#006d67] uppercase italic mb-4">MAKSU ONNISTUI!</h1>
        <p className="text-gray-600 font-bold mb-8 italic text-lg">Kiitos tilauksestasi. Olemme vastaanottaneet maksun ja käsittelemme sen pian.</p>
        <button onClick={() => router.push('/')} className="w-full bg-[#E63946] text-white py-4 rounded-2xl font-black uppercase italic tracking-widest flex items-center justify-center gap-2">
          ETUSIVULLE <ArrowRight size={20} />
        </button>
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