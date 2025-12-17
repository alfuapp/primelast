"use client";
import Link from "next/link";

export default function SuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f4f6fb] px-6">
      <div className="max-w-md w-full bg-white rounded-[3rem] shadow-2xl p-10 text-center border border-gray-100 relative overflow-hidden">
        {/* Green top bar */}
        <div className="absolute top-0 left-0 w-full h-2 bg-[#006d67]"></div>
        
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
          <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-3xl font-black text-[#006d67] mb-4">Maksu onnistui!</h1>
        <p className="text-gray-600 text-lg mb-8 leading-relaxed">
          Kiitos tilauksestasi. Maksusi on vahvistettu ja palvelu on nyt käsittelyssä.
          <span className="block mt-2 font-medium text-gray-800">Lähetimme vahvistuksen sähköpostiisi.</span>
        </p>

        <Link href="/" className="block w-full bg-[#006d67] text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-[#00534f] transition-all transform active:scale-95 text-center">
          Palaa etusivulle
        </Link>
      </div>
    </div>
  );
}