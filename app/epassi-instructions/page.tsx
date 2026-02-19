'use client';
import { ArrowLeft, MessageCircle, Mail, Smartphone } from 'lucide-react';
import Link from 'next/link';

export default function EpassiPage() {
  const whatsappNumber = "358451234567"; // 👈 Halkan ku qor nambarkaaga rasmiga ah (oo leh 358)
  const emailAddress = "primecare1974@gmail.com"; // 👈 Email-kaaga halkan ku xaqiiji

  return (
    <div className="min-h-screen bg-[#f4f6fb] flex flex-col items-center justify-center p-6 font-[Poppins]">
      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl p-10 border border-gray-100">
        <h1 className="text-2xl font-black text-[#3db6e6] uppercase italic mb-6 tracking-tighter">ePassi Maksuohje</h1>
        
        <div className="space-y-4 text-[12px] font-bold text-gray-700 uppercase italic">
          <div className="p-4 bg-blue-50 rounded-xl border-l-4 border-[#3db6e6] flex gap-3">
            <span className="text-[#3db6e6]">01</span>
            <p>Avaa ePassi-sovellus ja etsi: <span className="text-[#006d67]">PRIMECARE FINLAND</span></p>
          </div>
          <div className="p-4 bg-blue-50 rounded-xl border-l-4 border-[#3db6e6] flex gap-3">
            <span className="text-[#3db6e6]">02</span>
            <p>Syötä hinta ja vahvista maksu.</p>
          </div>
          <div className="p-4 bg-blue-50 rounded-xl border-l-4 border-[#3db6e6] flex gap-3">
            <span className="text-[#3db6e6]">03</span>
            <p>Ota kuvakaappaus (Screenshot) kuitista.</p>
          </div>
        </div>

        {/* --- Qaybta Xiriirka ee Cusub --- */}
        <div className="mt-8 pt-6 border-t border-dashed border-gray-200">
          <p className="text-[10px] font-black text-gray-400 uppercase text-center mb-4 italic">Lähetä kuitti meille tästä:</p>
          
          <div className="grid grid-cols-1 gap-3">
            {/* Badhanka WhatsApp */}
            <a 
              href={`https://wa.me/${whatsappNumber}?text=Hei, tässä on ePassi-kuitti maksustani.`}
              target="_blank"
              className="flex items-center justify-center gap-3 bg-[#25D366] text-white py-4 rounded-2xl font-black text-sm uppercase italic shadow-lg hover:opacity-90 transition-all"
            >
              <MessageCircle size={20} /> Lähetä WhatsAppilla
            </a>

            {/* Badhanka Email-ka */}
            <a 
              href={`mailto:${emailAddress}?subject=ePassi Kuitti`}
              className="flex items-center justify-center gap-3 bg-gray-800 text-white py-4 rounded-2xl font-black text-sm uppercase italic shadow-lg hover:bg-black transition-all"
            >
              <Mail size={20} /> Lähetä Sähköpostilla
            </a>
          </div>
        </div>

        <Link href="/services" className="flex items-center justify-center gap-2 mt-8 text-gray-400 font-bold text-[10px] uppercase italic hover:text-[#006d67]">
          <ArrowLeft size={14} /> Takaisin palveluihin
        </Link>
      </div>
    </div>
  );
}