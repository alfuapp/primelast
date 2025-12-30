'use client';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Lock, EyeOff, Trash2 } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white py-20 px-6 font-[Poppins]">
      <div className="max-w-3xl mx-auto">
        <Link href="/services" className="inline-flex items-center gap-2 text-[#006d67] font-bold mb-8 hover:underline italic">
          <ArrowLeft size={18} /> Takaisin
        </Link>
        
        <div className="bg-green-50 p-8 rounded-[3rem] mb-10 border border-green-100 flex items-center gap-6">
          <ShieldCheck size={48} className="text-[#006d67]" />
          <h1 className="text-3xl font-black text-[#006d67] uppercase italic tracking-tighter">Tietosuojaseloste</h1>
        </div>

        <div className="space-y-10 text-gray-700 font-medium">
          <section>
            <h2 className="text-xl font-black text-gray-900 uppercase mb-4 flex items-center gap-2">
              <Lock size={20} className="text-[#006d67]" /> 1. Mitä tietoja keräämme?
            </h2>
            <p>Keräämme vain välttämättömät tiedot hoidon toteuttamiseksi: Nimi, puhelinnumero, sähköpostiosoite sekä antamasi tiedot terveydentilastasi.</p>
          </section>

          <section>
            <h2 className="text-xl font-black text-gray-900 uppercase mb-4 flex items-center gap-2">
              <EyeOff size={20} className="text-[#006d67]" /> 2. Tiedon käyttö ja luovutus
            </h2>
            <p>Tietojasi käytetään ainoastaan lääkärin neuvontaan ja reseptien uusimiseen. Emme koskaan myy tai luovuta tietojasi kolmansille osapuolille markkinointitarkoituksiin.</p>
          </section>

          <section>
            <h2 className="text-xl font-black text-gray-900 uppercase mb-4 flex items-center gap-2">
              <Trash2 size={20} className="text-[#006d67]" /> 3. Oikeutesi tietoihin
            </h2>
            <p>Sinulla on oikeus tarkistaa omat tietosi tai pyytää niiden poistamista järjestelmästämme milloin tahansa, kun lakisääteinen potilastietojen säilytysaika on päättynyt.</p>
          </section>
        </div>
      </div>
    </div>
  );
}