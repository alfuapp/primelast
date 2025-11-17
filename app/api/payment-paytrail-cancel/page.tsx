'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { XCircle, RefreshCcw } from 'lucide-react';

/**
 * Bogga muujinaya in isticmaalaha uu joojiyay ama uu fashilmay isku dayga lacag bixinta ee Paytrail.
 * * FIIRO GAAR AH: Boggan wuxuu muujinayaa oo kaliya UI. Xaqiijinta Server-ka ee dhabta ah
 * waxaa qabta 'app/api/paytrail-cancel-callback/route.ts'.
 */
const PaytrailCancelPage = () => {
  const [reference, setReference] = useState<string | null>(null);

  // Isticmaal useCallback si loo sameeyo dib u celin fudud, maadaama router-ku aanu shaqaynayn.
  const handleGoHome = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    // Ku celi isticmaalaha bogga hore
    window.location.href = '/';
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
        // Waxaan si toos ah uga helnaa xuduudaha URL-ka browser-ka (window.location.search)
        const urlParams = new URLSearchParams(window.location.search);

        // Soo qaado tixraaca (reference) dalabka URL-ka.
        // Tixraacaan waxaa Paytrail ku soo celiyaa sida 'checkout-reference'.
        const ref = urlParams.get('checkout-reference');
        if (ref) {
          setReference(ref);
        }
    }
  }, []); // Custo: Si toos ah ayuu u shaqeeyaa marka component-ka la geliyo

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      {/* Kaarka Natiijada (Result Card) */}
      <div className="bg-white p-8 md:p-12 rounded-xl shadow-2xl max-w-lg w-full text-center border-t-4 border-red-500 transition-all duration-300">
        
        {/* Astaanta Khaladka/Joojinta */}
        <XCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
        
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
          Lacag Bixinta Waa La Joojiyay
        </h1>
        
        <p className="text-gray-600 mb-6">
          Waxaad joojisay isku dayga lacag bixinta. Dalabkaaga lama dhammaystirin.
        </p>
        
        {/* Muujinta Tixraaca Dalabka (Reference) */}
        {reference && (
          <div className="bg-red-50 p-3 rounded-lg my-4 inline-block text-sm font-medium text-red-700">
            Tixraaca Dalabka: <span className="font-bold">{reference}</span>
          </div>
        )}

        {/* Badhanka Dib Ugu Noqoshada */}
        <div className="mt-8">
          <a
            href="/"
            onClick={handleGoHome}
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-full text-white bg-red-600 hover:bg-red-700 shadow-md transition-transform duration-150 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <RefreshCcw className="w-4 h-4 mr-2" />
            Dib Ugu Laabo Bogga Hore
          </a>
        </div>
        
        <p className="text-xs text-gray-400 mt-6">
          Haddii aad u malaynayso in tani ay tahay khalad, fadlan la xidhiidh taageerada.
        </p>
      </div>
    </div>
  );
};

export default PaytrailCancelPage;