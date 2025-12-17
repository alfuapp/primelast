"use client";
import Link from "next/link";

export default function CancelPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f4f6fb] px-6">
      <div className="max-w-md w-full bg-white rounded-[3rem] shadow-2xl p-10 text-center border border-gray-100 relative overflow-hidden">
        {/* Red top bar */}
        <div className="absolute top-0 left-0 w-full h-2 bg-[#E63946]"></div>
        
        <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-8">
          <svg className="w-12 h-12 text-[#E63946]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>

        <h1 className="text-3xl font-black text-gray-800 mb-4">Maksu keskeytettiin</h1>
        <p className="text-gray-600 text-lg mb-8 leading-relaxed">
          Maksuprosessia ei viety loppuun asti. Tililtäsi ei ole veloitettu mitään.
        </p>

        <Link href="/" className="block w-full bg-[#006d67] text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-[#00534f] transition-all text-center">
          Yritä uudelleen
        </Link>
      </div>
    </div>
  );
}