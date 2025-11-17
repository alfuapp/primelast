"use client";

import { useState, useMemo } from "react";
import { Loader2, DollarSign } from 'lucide-react';

type PriceId = "consultation_basic" | "prescription_renewal" | "follow_up";

const PRICE_LABELS: Record<PriceId, string> = {
  consultation_basic: "Videovastaanotto – 39€",
  prescription_renewal: "Reseptin uusinta – 9,90€",
  follow_up: "Seurantakäynti – 25€",
};

// Qiimaha Sentis ah (Muhiim: Lacagta waxaa lagu xisaabinayaa server-ka, laakiin tani waa muujinta)
const PRICE_MAP: Record<PriceId, number> = {
  consultation_basic: 3900, 
  prescription_renewal: 990, 
  follow_up: 2500, 
};

export default function TestPaymentPage() {
  const [selected, setSelected] = useState<PriceId>("consultation_basic");
  const [email, setEmail] = useState("test@example.com"); 
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  /**
   * Waxay la hadashaa API-ga Paytrail si ay u hesho URL-ka dib u dirista.
   */
  async function handlePaytrail() {
    try {
      setLoading(true);
      setMessage("");
      
      const res = await fetch("/api/create-paytrail-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // Hubi in la diray PriceId sax ah
          priceId: selected, 
          customer: {
            email: email || "test@example.com",
            firstName: "PrimeCare", // Tusaale Magaca Hore
            lastName: "Client", // Tusaale Magaca Dambe
          },
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        // Xannibaadda Khaladka Server-ka
        throw new Error(data.error || "Khalad dhacay Paytrail: " + data.statusMessage || "Lama helin fariin faahfaahsan.");
      }

      // Dib u dirista bogga Paytrail (Waa xiriiriyaha Bangiyada)
      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
      } else {
        throw new Error("Xiriiriye dib u diris ah lagama helin Paytrail API-ga.");
      }
    } catch (err: any) {
      console.error('Khalad Paytrail:', err);
      // Hadda waxaan ku soo bandhigaynaa fariinta khaladka sidii ay u timid
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  }
  
  // Xisaabinta qiimaha (Euro) si loo muujiyo
  const selectedPriceInEuro = useMemo(() => PRICE_MAP[selected] / 100, [selected]);

  return (
    <div className="min-h-screen bg-[#f4f6fb] flex items-start justify-center pt-20">
      {/* PAYMENT BOX */}
      <section
        className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-2xl border w-full"
      >
        <h2 className="text-3xl font-bold mb-4 text-[#006d67] flex items-center">
          <DollarSign className="w-6 h-6 mr-2" />
          Tijaabada Lacag Bixinta (Test Payment)
        </h2>
        <p className="mb-6 text-gray-600">Fadlan dooro adeegga oo sii wad lacag bixinta Paytrail.</p>

        <label className="block text-sm font-semibold mb-1 text-gray-700">Sähköposti (valinnainen)</label>
        <input
          type="email"
          className="w-full border rounded-lg p-3 mb-4 focus:ring-2 focus:ring-[#006d67] focus:border-transparent transition"
          placeholder="asiakas@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />

        <label className="block text-sm font-semibold mb-1 text-gray-700">Palvelu</label>
        <select
          className="w-full border rounded-lg p-3 mb-6 bg-white focus:ring-2 focus:ring-[#006d67] focus:border-transparent transition"
          value={selected}
          onChange={(e) => setSelected(e.target.value as PriceId)}
          disabled={loading}
        >
          {Object.entries(PRICE_LABELS).map(([id, label]) => (
            <option key={id} value={id}>
              {label}
            </option>
          ))}
        </select>
        
        <p className="text-xl font-extrabold text-[#E63946] mb-4">
            Qiimaha la Tijaabinayo: {selectedPriceInEuro.toFixed(2)} €
        </p>

        <div className="flex flex-col gap-4">
          {/* BADHANKA PAYTRAIL KALIYA */}
          <button
            onClick={handlePaytrail}
            disabled={loading}
            className="flex items-center justify-center bg-[#006d67] hover:bg-[#00534f] text-white font-semibold py-3 rounded-lg transition duration-200 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : "Maksa Paytrail (dib u diris)"}
          </button>
        </div>

        {message && (
          <div className="mt-6 bg-yellow-100 border border-yellow-300 p-4 rounded-lg text-sm text-yellow-800 break-all">
            <strong className="font-bold block mb-1">Fariinta Xaaladda:</strong>
            <pre className="whitespace-pre-wrap">{message}</pre>
          </div>
        )}
        
      </section>
    </div>
  );
}