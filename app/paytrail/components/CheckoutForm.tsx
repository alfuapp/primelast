"use client";
import { useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";

function CheckoutContent() {
  const searchParams = useSearchParams();
  const amount = searchParams.get("amount") || "10";
  const service = searchParams.get("service") || "Palvelu";

  const [formData, setFormData] = useState({ firstName: "", phone: "" });
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    if (!formData.firstName || !formData.phone) {
      alert("Fadlan buuxi magacaaga iyo taleefankaaga.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("/api/paytrail/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          amount: Number(amount), // U dir lambar ahaan
          description: service, 
          ...formData 
        }),
      });
      const data = await response.json();
      if (data.success) window.location.href = data.redirectUrl;
    } catch (error) {
      alert("Cilad ayaa dhacday.");
    } finally { setLoading(null); }
  };

  return (
    <div className="min-h-screen bg-[#f4f6fb] py-20 px-6">
      <div className="max-w-xl mx-auto bg-white rounded-[3rem] shadow-2xl p-10 border border-green-50">
        <h2 className="text-3xl font-black text-[#006d67] mb-6 text-center">Tilaustiedot</h2>
        <div className="mb-8 p-4 bg-green-50 rounded-2xl text-center font-bold text-[#006d67]">
          {service} — {amount} €
        </div>
        
        <div className="space-y-4 text-gray-800">
          <input 
            type="text" placeholder="Etunimi *" 
            className="w-full p-4 border-2 border-gray-100 rounded-2xl outline-[#006d67]"
            onChange={(e) => setFormData({...formData, firstName: e.target.value})}
          />
          <input 
            type="text" placeholder="Puhelinnumero *" 
            className="w-full p-4 border-2 border-gray-100 rounded-2xl outline-[#006d67]"
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
          />
          <button 
            onClick={handlePayment}
            className="w-full bg-[#E63946] text-white py-5 rounded-2xl font-bold text-xl shadow-lg active:scale-95 transition"
          >
            {loading ? "Siirrytään maksuun..." : "Vahvista ja maksa"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div>Ladataan...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}