'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from './lib/firebase'; 
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import { 
  Stethoscope, 
  ShieldCheck, 
  Heart, 
  Activity, 
  LogOut, 
  ShieldPlus, // Ku dar kani si uu error-ku u baxo
  CheckCircle2 
} from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    router.refresh();
  };

  return (
    <div className="bg-[#E8F8F5] min-h-screen font-[Poppins]">
      
      {/* 1. STATUS BAR */}
      {user && (
        <div className="bg-[#006d67] border-t border-white/10 py-3 px-6 flex justify-between items-center text-white shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60 italic">Kirjautunut sisään</span>
            <span className="text-sm font-bold tracking-tight lowercase italic border-b border-white/30">{user.email}</span>
          </div>
          
          <button 
            onClick={handleLogout} 
            className="flex items-center gap-2 bg-white/10 border border-white/20 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#E63946] transition-all"
          >
            <LogOut size={14} /> LOGOUT
          </button>
        </div>
      )}

      {/* 2. HERO SECTION */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="text-center md:text-left space-y-6">
            <div className="inline-flex items-center gap-2 bg-green-50 text-[#006d67] px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest italic border border-green-100">
              <ShieldCheck size={16} /> Suomalainen Online-Lääkäripalvelu
            </div>
            <h1 className="text-4xl md:text-7xl font-black text-[#006d67] uppercase italic leading-none tracking-tighter">
              PrimeCare Palvelut
            </h1>
            <p className="text-lg text-gray-600 font-medium leading-relaxed max-w-xl">
              PrimeCare tarjoaa nopean, turvallisen ja asiantuntevan avun suoraan kotiisi. 
              Vältä jonot ja hoida terveysasiat verkossa.
            </p>
            <button 
              onClick={() => router.push('/services')}
              className="bg-[#006d67] text-white px-10 py-5 rounded-2xl font-black text-lg shadow-2xl hover:bg-black transition-all transform hover:scale-105"
            >
              TUTUSTU PALVELUIHIN →
            </button>
          </div>
          <div className="relative flex justify-center">
            <div className="absolute -top-10 -left-10 bg-white p-4 rounded-3xl shadow-xl z-10">
               <Activity className="text-[#E63946]" size={32} />
            </div>
            <img 
              src="/images/doctor.png" 
              alt="PrimeCare Specialist" 
              className="w-full max-w-md h-auto rounded-[3rem] shadow-2xl border-4 border-gray-50 object-cover" 
            />
          </div>
        </div>
      </section>

{/* ⭐ 3. SERVICES PREVIEW - 4 Balanced Cards */}
<section className="bg-white py-20 px-6">
  <div className="text-center mb-16">
    <h2 className="text-3xl md:text-5xl font-black text-[#006d67] uppercase italic tracking-tighter">Palvelumme</h2>
    <p className="text-gray-500 font-bold mt-2 italic tracking-wide">Laadukasta hoitoa, silloin kun sitä tarvitset.</p>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
    
    {/* Card 1: Reseptin uusiminen (Cagaar) */}
    <div className="bg-[#006d67] p-10 rounded-[1rem] shadow-[0_20px_50px_rgba(0,109,103,0.25)] border-2 border-white/10 hover:-translate-y-2 transition-all flex flex-col justify-between min-h-[350px]">
      <div>
        <div className="bg-white/20 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
          <Stethoscope size={35} className="text-white" />
        </div>
        <h3 className="text-2xl font-black text-white uppercase italic mb-4">Reseptin uusiminen</h3>
        <p className="text-white/80 font-bold text-sm leading-relaxed">
          Uusi reseptisi nopeasti ja vaivattomasti. Palvelu on käytettävissäsi ympäri vuorokauden.
        </p>
      </div>
      <div className="flex justify-between items-end mt-8">
        <div className="text-white font-black text-4xl italic leading-none">10€</div>
        <span className="bg-white/10 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase border border-white/20">Valitse →</span>
      </div>
    </div>

    {/* Card 2: Lääkärin neuvonta (Buluug Caafimaad) */}
    <div className="bg-[#0055aa] p-10 rounded-[1rem] shadow-[0_20px_50px_rgba(0,85,170,0.25)] border-2 border-white/10 hover:-translate-y-2 transition-all flex flex-col justify-between min-h-[350px]">
      <div>
        <div className="bg-white/20 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
          <ShieldPlus size={35} className="text-white" />
        </div>
        <h3 className="text-2xl font-black text-white uppercase italic mb-4">Lääkärin neuvonta</h3>
        <p className="text-white/80 font-bold text-sm leading-relaxed">
          Asiantuntevaa lääkärin neuvontaa kaikissa terveyteen liittyvissä kysymyksissäsi.
        </p>
      </div>
      <div className="flex justify-between items-end mt-8">
        <div className="text-white font-black text-4xl italic leading-none">20€</div>
        <span className="bg-white/10 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase border border-white/20">Kysy →</span>
      </div>
    </div>

    {/* Card 3: Luotettava Apu (Buluug Madow) */}
    <div className="bg-[#1e293b] p-10 rounded-[1rem] shadow-xl border-2 border-white/30 hover:-translate-y-2 transition-all flex flex-col justify-between min-h-[350px]">
      <div>
        <div className="bg-[#0055aa] w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
          <Heart size={35} className="text-white" fill="white" />
        </div>
        <h3 className="text-2xl font-black text-white uppercase italic mb-4">Luotettava apu</h3>
        <p className="text-white/70 font-bold text-sm leading-relaxed">
          Tunnistautuminen ja suojattu yhteys takaavat potilasturvallisuuden jokaisessa vaiheessa.
        </p>
      </div>
      <div className="mt-8">
        <span className="text-[#ffb400] text-xs font-black uppercase italic tracking-widest">100% Suojattu Palvelu</span>
      </div>
    </div>

    {/* Card 4: Nopea Palvelu (Cagaar dhalaalaya) */}
    <div className="bg-[#004d40] p-10 rounded-[1rem] shadow-xl border-2 border-white/5 hover:-translate-y-2 transition-all flex flex-col justify-between min-h-[350px]">
      <div>
        <div className="bg-[#006d67] w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
          <Activity size={35} className="text-white" />
        </div>
        <h3 className="text-2xl font-black text-white uppercase italic mb-4">Nopea Vastaus</h3>
        <p className="text-white/70 font-bold text-sm leading-relaxed">
          Käsittelemme pyyntösi välittömästi. Saat vastauksen suoraan sähköpostiisi tai puhelimeesi.
        </p>
      </div>
      <div className="mt-8 text-white/70 text-[10px] font-bold uppercase tracking-widest">
        Vastausaika: &lt; 30 min
      </div>
    </div>

  </div>


        {/* Alert Section */}
        <div className="max-w-4xl mx-auto mt-20">
          <div className="bg-red-50 border-4 border-dashed border-[#E63946] rounded-[3rem] p-10 flex flex-col md:flex-row items-center gap-8 shadow-xl">
            <div className="bg-[#E63946] text-white p-6 rounded-3xl shadow-lg">
              <ShieldCheck size={50} />
            </div>
            <div className="space-y-4">
              <h3 className="text-2xl font-black text-[#E63946] uppercase italic tracking-tighter leading-none">
                Huomioi reseptien uusinnassa!
              </h3>
              <p className="text-base font-bold text-gray-800 leading-relaxed italic">
                Tietoturvasyistä <span className="text-[#E63946] underline decoration-2">emme uusi</span> antibiootteja, 
                vahvoja kipulääkkeitä, unilääkkeitä tai muita huumaavia lääkeaineita.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-white py-12 text-center border-t border-gray-100">
        <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.4em] italic">
          © {new Date().getFullYear()} PrimeCare Finland - Turvallinen Online-Terveydenhuolto
        </p>
      </footer>
    </div>
  );
}