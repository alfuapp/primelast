"use client";

import { CheckCircle } from 'lucide-react';

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen bg-[#f4f6fb] flex items-center justify-center p-4">
      <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-2xl border border-green-200 text-center">
        <CheckCircle className="w-16 h-16 text-[#006d67] mx-auto mb-6 animate-pulse" />
        <h1 className="text-3xl font-bold mb-3 text-[#006d67]">Lacag Bixintaada Waa Guulaysatay!</h1>
        <p className="text-gray-600 mb-6">
          Waad ku mahadsan tahay isticmaalka PrimeCare. Waxaanu kuu xaqiijinay ballantaada.
        </p>
        <p className="text-lg font-semibold text-gray-700 mb-8 p-3 bg-green-50 rounded-lg border border-green-300">
            Fiiro gaar ah: Faahfaahinta adeegga waxaad ka heli kartaa URL-ka: 
            <br className="my-1"/> <code className="text-xs break-all text-green-800">/payment-success?service=...</code>
        </p>
        <a 
          href="/" 
          className="inline-block bg-[#E63946] text-white font-semibold px-6 py-3 rounded-lg hover:bg-[#d43343] transition duration-300"
        >
          Ku Laabo Home Page
        </a>
      </div>
    </div>
  );
}