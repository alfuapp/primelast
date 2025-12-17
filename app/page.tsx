"use client";

import { useState } from "react";
import Image from "next/image";

export default function HomePage() {
  const [loading, setLoading] = useState<string | null>(null);

  const handlePayment = async (amount: number, serviceName: string) => {
    setLoading(serviceName);
    try {
      const response = await fetch("/api/paytrail/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          amount: amount, 
          description: serviceName 
        }),
      });

      const data = await response.json();
      if (data.success && data.redirectUrl) {
        // Toos ugu gudbi Paytrail
        window.location.href = data.redirectUrl;
      } else {
        alert("Virhe: " + (data.error || "Maksun luonti epäonnistui"));
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert("Yhteysvirhe. Yritä uudelleen.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="flex flex-col bg-transparent pb-20">
      {/* ⭐ HERO SECTION */}
      <section className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 px-6 py-16 items-center">
        <div>
          <h1 className="text-5xl md:text-6xl font-black text-[#006d67] leading-[1.1]">
            Reseptin uusiminen <br />
            <span className="text-[#00916E]">kotiovelta.</span>
          </h1>
          <p className="mt-6 text-gray-600 text-xl leading-relaxed max-w-lg">
            Ammattitaitoiset lääkärit käytettävissäsi. Videovastaanotto iyo reseptit helposti verkossa.
          </p>

          <button
            onClick={() => handlePayment(10, "Pika-uusinta Hero")}
            className="mt-10 bg-[#006d67] text-white font-bold px-10 py-5 rounded-2xl shadow-xl hover:bg-[#00534f] transition-all transform hover:scale-[1.03] active:scale-95 text-lg"
          >
            {loading === "Pika-uusinta Hero" ? "Siirrytään maksuun..." : "Uusi resepti heti (10 €)"}
          </button>
        </div>

        <div className="relative flex justify-center drop-shadow-2xl">
          <Image
            src="/images/doctor.png"
            alt="PrimeCare Lääkäri"
            width={550}
            height={550}
            priority
            className="rounded-[3rem] object-cover border-8 border-white"
          />
        </div>
      </section>

      {/* ⭐ SERVICES CARDS */}
      <section className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-3 gap-8">
        
        {/* CARD 1: Resepti */}
        <div className="bg-white rounded-[2rem] shadow-lg border border-gray-100 overflow-hidden group hover:shadow-2xl transition-all">
          <div className="bg-[#006d67] p-6 text-white text-center font-bold text-xl uppercase tracking-widest">
            Uusi resepti
          </div>
          <div className="p-10 text-center">
            <p className="text-5xl font-black text-[#E63946] mb-6">10 €</p>
            <ul className="text-gray-600 space-y-3 mb-10 text-left">
              <li className="flex items-center gap-2">✅ Käsittely arkipäivänä</li>
              <li className="flex items-center gap-2">✅ Kaikki reseptityypit</li>
            </ul>
            <button 
              onClick={() => handlePayment(10, "Reseptin uusinta")}
              className="w-full bg-[#E63946] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#c82f3b] shadow-md transition"
            >
              {loading === "Reseptin uusinta" ? "Odotetaan..." : "Maksa heti"}
            </button>
          </div>
        </div>

        {/* CARD 2: Etävastaanotto */}
        <div className="bg-white rounded-[2rem] shadow-lg border border-gray-100 overflow-hidden group hover:shadow-2xl transition-all scale-105 border-t-8 border-[#00916E]">
          <div className="bg-[#00916E] p-6 text-white text-center font-bold text-xl uppercase tracking-widest">
            Etälääkäri
          </div>
          <div className="p-10 text-center">
            <p className="text-5xl font-black text-[#E63946] mb-1">43 €</p>
            <p className="text-gray-500 mb-6 text-sm">Kela-korvauksen jälkeen</p>
            <ul className="text-gray-600 space-y-3 mb-10 text-left font-medium">
              <li className="flex items-center gap-2">👨‍⚕️ Sairauslomatodistus</li>
              <li className="flex items-center gap-2">👨‍⚕️ Hoidon arviointi</li>
              <li className="flex items-center gap-2">👨‍⚕️ Videovastaanotto</li>
            </ul>
            <button 
              onClick={() => handlePayment(43, "Etävastaanotto")}
              className="w-full bg-[#E63946] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#c82f3b] shadow-md transition"
            >
              {loading === "Etävastaanotto" ? "Odotetaan..." : "Maksa heti"}
            </button>
          </div>
        </div>

        {/* CARD 3: Info */}
        <div className="bg-[#E63946] text-white rounded-[2rem] shadow-lg p-10 flex flex-col justify-center">
          <div className="text-4xl mb-6">⚠️</div>
          <h3 className="text-2xl font-black mb-4">Huomio!</h3>
          <p className="text-lg opacity-90 leading-relaxed">
            PrimeCare ei uusi PKV-lääkkeitä, unilääkkeitä ama vahvoja kipulääkkeitä. 
          </p>
        </div>
      </section>
    </div>
  );
}