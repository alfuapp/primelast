'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, CheckCircle2, Smartphone, Search, Euro, Send, Camera } from 'lucide-react';
import Link from 'next/link';

export default function EpassiInstructions() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#F0F7F9] font-[Poppins] p-6 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100">
        
        {/* Header Section */}
        <div className="bg-[#3db6e6] p-8 text-center text-white relative">
          <button 
            onClick={() => router.back()}
            className="absolute left-6 top-8 bg-white/20 p-2 rounded-full hover:bg-white/30 transition-all"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="bg-white p-3 rounded-2xl inline-block mb-4 shadow-lg">
            <img src="https://www.epassi.fi/hubfs/ePassi_Logo_RGB.png" alt="ePassi" className="h-8" />
          </div>
          <h1 className="text-xl font-black uppercase italic tracking-tighter leading-none">
            ePassi Maksuohje
          </h1>
        </div>

        {/* Instructions List */}
        <div className="p-8 space-y-6">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-center italic mb-4">
            Seuraa näitä ohjeita suorittaaksesi maksun
          </p>

          <div className="space-y-4">
            {/* Step 1 */}
            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <div className="bg-[#3db6e6] text-white p-2 rounded-lg shrink-0">
                <Smartphone size={18} />
              </div>
              <div>
                <h3 className="text-xs font-black uppercase text-gray-900">1. Avaa sovellus</h3>
                <p className="text-[11px] font-bold text-gray-500 italic uppercase">Avaa ePassi-sovellus puhelimessasi.</p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <div className="bg-[#3db6e6] text-white p-2 rounded-lg shrink-0">
                <Search size={18} />
              </div>
              <div>
                <h3 className="text-xs font-black uppercase text-gray-900">2. Etsi palvelu</h3>
                <p className="text-[11px] font-bold text-gray-500 italic uppercase">Hae toimipaikkaa: <span className="text-[#006d67] font-black">PrimeCare Finland</span></p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <div className="bg-[#3db6e6] text-white p-2 rounded-lg shrink-0">
                <Euro size={18} />
              </div>
              <div>
                <h3 className="text-xs font-black uppercase text-gray-900">3. Syötä summa</h3>
                <p className="text-[11px] font-bold text-gray-500 italic uppercase">Kirjoita palvelun hinta ja vahvista maksu.</p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <div className="bg-[#3db6e6] text-white p-2 rounded-lg shrink-0">
                <Camera size={18} />
              </div>
              <div>
                <h3 className="text-xs font-black uppercase text-gray-900">4. Ota kuva</h3>
                <p className="text-[11px] font-bold text-gray-500 italic uppercase">Ota kuvakaappaus (screenshot) kuitista.</p>
              </div>
            </div>

            {/* Step 5 */}
            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <div className="bg-[#3db6e6] text-white p-2 rounded-lg shrink-0">
                <Send size={18} />
              </div>
              <div>
                <h3 className="text-xs font-black uppercase text-gray-900">5. Lähetä kuitti</h3>
                <p className="text-[11px] font-bold text-gray-500 italic uppercase">Lähetä kuitti meille WhatsAppilla tai sähköpostitse.</p>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button 
              onClick={() => router.push('/services')}
              className="w-full bg-[#006d67] text-white py-5 rounded-2xl font-black text-sm uppercase italic tracking-widest shadow-xl hover:bg-black transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle2 size={18} /> SELVÄ, OLEN MAKSANUT
            </button>
          </div>
        </div>

        <div className="bg-gray-50 p-6 text-center">
          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
            Tarvitsetko apua? Ota yhteyttä asiakaspalveluun.
          </p>
        </div>
      </div>
    </div>
  );
}