'use client';

import React, { useState } from 'react';
import { Info } from 'lucide-react';

export default function ServicesPage() {
  const [loading, setLoading] = useState<string | null>(null);

  const handlePayment = async (amount: number, serviceName: string) => {
    setLoading(serviceName);
    try {
      const response = await fetch("/api/paytrail/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, description: serviceName }),
      });

      const data = await response.json();
      if (data.success && data.redirectUrl) {
        window.location.href = data.redirectUrl;
      } else {
        alert("Virhe: " + (data.error || "Maksun luonti epäonnistui"));
      }
    } catch (error) {
      alert("Yhteysvirhe. Yritä uudelleen.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f6fb] pt-32 pb-32 font-[Poppins]">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800;900&display=swap');
        body { font-family: 'Poppins', sans-serif; }
      `}</style>

      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-black text-[#006d67] mb-4 uppercase">Palvelumme</h1>
          <p className="text-gray-600 text-xl max-w-2xl mx-auto">Valitse palvelu ja maksa turvallisesti.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 items-stretch">
          
          {/* CARD 1 */}
          <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden flex flex-col">
            <div className="bg-[#006d67] p-6 text-white text-center font-bold text-xl uppercase tracking-tighter">Uusi resepti</div>
            <div className="p-8 text-center flex flex-col flex-grow">
              <p className="text-6xl font-black text-[#E63946] mb-4 italic">10 €</p>
              <ul className="text-gray-700 space-y-4 mb-8 text-left flex-grow font-medium">
                <li className="flex items-center gap-2">✅ Käsittely arkipäivänä</li>
                <li className="flex items-center gap-2">✅ Julkinen tai yksityinen</li>
                <li className="flex items-center gap-2">✅ Kaikki reseptityypit</li>
              </ul>
              <button 
                onClick={() => handlePayment(10, "Reseptin uusinta")}
                className="w-full bg-[#E63946] text-white py-5 rounded-2xl font-black text-xl hover:bg-[#c82f3b] transition-all transform active:scale-95 shadow-lg mt-auto"
              >
                {loading === "Reseptin uusinta" ? "Odotetaan..." : "MAKSA HETI"}
              </button>
            </div>
          </div>

          {/* CARD 2 */}
          <div className="bg-white rounded-[2.5rem] shadow-2xl border-2 border-[#00916E] overflow-hidden flex flex-col scale-105 z-10">
            <div className="bg-[#00916E] p-6 text-white text-center font-bold text-xl uppercase tracking-tighter">Etälääkäri</div>
            <div className="p-8 text-center flex flex-col flex-grow">
              <p className="text-6xl font-black text-[#E63946] mb-2 italic">43 €</p>
              <p className="text-gray-500 mb-6 font-bold">(68 € ilman Kela-korvausta)</p>
              <ul className="text-gray-700 space-y-4 mb-8 text-left flex-grow font-medium">
                <li className="flex items-center gap-2">👨‍⚕️ Sairauslomatodistus</li>
                <li className="flex items-center gap-2">👨‍⚕️ Hoidon arviointi</li>
                <li className="flex items-center gap-2">👨‍⚕️ Videovastaanotto</li>
              </ul>
              <button 
                onClick={() => handlePayment(43, "Etävastaanotto")}
                className="w-full bg-[#E63946] text-white py-5 rounded-2xl font-black text-xl hover:bg-[#c82f3b] transition-all transform active:scale-95 shadow-lg mt-auto"
              >
                {loading === "Etävastaanotto" ? "Odotetaan..." : "MAKSA HETI"}
              </button>
            </div>
          </div>

          {/* CARD 3 */}
          <div className="bg-[#E63946] text-white rounded-[2.5rem] shadow-xl p-10 flex flex-col">
            <div className="flex justify-center mb-6"><Info size={64} strokeWidth={2.5} /></div>
            <h3 className="text-3xl font-black mb-6 text-center uppercase italic">Tärkeää tietoa!</h3>
            <div className="space-y-4 text-lg font-medium leading-relaxed flex-grow">
              <p>• PrimeCare ei uusi antibiootteja.</p>
              <p>• Ei PKV-lääkkeitä (huumaavat).</p>
              <p>• Ei unilääkkeitä ama vahvoja kipulääkkeitä.</p>
            </div>
            <div className="pt-6 mt-6 border-t border-white/30 italic text-sm text-center font-bold">
              Fadlan hubi inaan barnaamijka u isticmaalin dhowrkaas nooc.
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}