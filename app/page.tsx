'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from './lib/firebase'; // Hubi in jidkani (path) sax yahay
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import { Stethoscope, Pill, ShieldCheck, ArrowRight, Heart, Activity, LogOut } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  // Hubi haddii uu user-ku jiro si loo tusiyo Status Bar-ka
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    router.refresh(); // Tani waxay nadiifinaysaa xogta bogga
  };

  return (
    <div className="bg-[#f4f6fb] min-h-screen font-[Poppins]">
      
      {/* ⭐ 1. STATUS BAR (Magaca & Logout) - Kaliya marka uu qofku Login yahay */}
      {user && (
        <div className="bg-[#006d67] border-t border-white/10 py-3 px-6 flex justify-between items-center text-white shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60 italic">Kirjautunut sisään</span>
            <span className="text-sm font-bold tracking-tight lowercase italic border-b border-white/30">{user.email}</span>
          </div>
          
          <button 
            onClick={handleLogout} 
            className="flex items-center gap-2 bg-white/10 border border-white/20 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#E63946] hover:border-[#E63946] transition-all shadow-inner"
          >
            <LogOut size={14} /> LOGOUT
          </button>
        </div>
      )}

      {/* ⭐ 2. HERO SECTION */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="text-center md:text-left space-y-6">
            <div className="inline-flex items-center gap-2 bg-green-50 text-[#006d67] px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest italic border border-green-100">
              <ShieldCheck size={16} /> Suomalainen Online-Lääkäripalvelu
            </div>
            {/* Tusaale ahaan halkan: */}
<h1 className="text-4xl md:text-7xl font-black text-[#006d67] uppercase italic leading-none">
  PrimeCare Palvelut
</h1>
            <p className="text-lg text-gray-600 font-medium leading-relaxed max-w-xl">
              PrimeCare tarjoaa nopean, turvallisen ja asiantuntevan avun suoraan kotiisi. 
              Vältä jonot ja hoida terveysasiat verkossa silloin, kun se sinulle parhaiten sopii.
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <button 
                onClick={() => router.push('/services')}
                className="bg-[#006d67] text-white px-10 py-5 rounded-2xl font-black text-lg shadow-2xl hover:bg-[#005a54] transition-all transform hover:scale-105"
              >
                TUTUSTU PALVELUIHIN →
              </button>
            </div>
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

      {/* ⭐ 3. SERVICES PREVIEW */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-[#006d67] uppercase italic tracking-tighter">Palvelumme</h2>
          <p className="text-gray-500 font-bold mt-2 italic">Valitse tarpeisiisi sopiva palvelu ja aloita asiointi.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* CARD 1: RESEPTI */}
          <div className="group bg-white p-10 rounded-[2.5rem] shadow-xl border border-gray-100 hover:border-[#E63946] transition-all hover:-translate-y-2 cursor-pointer" onClick={() => router.push('/services')}>
            <div className="bg-red-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#E63946] group-hover:text-white transition-all">
              <Pill size={32} />
            </div>
            <h3 className="text-2xl font-black text-[#006d67] mb-4 tracking-tight uppercase italic">Reseptin uusinta</h3>
            <p className="text-gray-500 font-medium text-sm leading-relaxed mb-8">
              Nopea ja helppo reseptin uusiminen suoraan apteekkiin ilman lääkärikäyntiä.
            </p>
            <div className="flex items-center gap-2 font-black text-[#E63946] text-sm uppercase italic">
              Lue lisää <ArrowRight size={16} />
            </div>
          </div>

          {/* CARD 2: VASTAANOTTO */}
          <div className="group bg-white p-10 rounded-[2.5rem] shadow-xl border border-gray-100 hover:border-[#006d67] transition-all hover:-translate-y-2 cursor-pointer" onClick={() => router.push('/services')}>
            <div className="bg-green-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#006d67] group-hover:text-white transition-all">
              <Stethoscope size={32} />
            </div>
            <h3 className="text-2xl font-black text-[#006d67] mb-4 tracking-tight uppercase italic">Lääkärin vastaanotto</h3>
            <p className="text-gray-500 font-medium text-sm leading-relaxed mb-8">
              Varaa aika videovastaanotolle. Asiantunteva apu ja neuvonta kotisohvalta.
            </p>
            <div className="flex items-center gap-2 font-black text-[#006d67] text-sm uppercase italic">
              Varaa aika <ArrowRight size={16} />
            </div>
          </div>

          {/* CARD 3: TIETOTURVA */}
          <div className="group bg-[#006d67] p-10 rounded-[2.5rem] shadow-xl text-white transition-all hover:-translate-y-2">
            <div className="bg-white/20 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
              <Heart size={32} />
            </div>
            <h3 className="text-2xl font-black mb-4 tracking-tight uppercase italic">Luotettava apu</h3>
            <p className="text-white/80 font-medium text-sm leading-relaxed mb-8">
              Tunnistautuminen ja suojattu yhteys takaavat potilasturvallisuuden.
            </p>
            <div className="text-xs font-black uppercase tracking-widest text-[#ffb400] italic">100% Suojattu Palvelu</div>
          </div>
        </div>

        {/* ⭐ 4. DIGNIINTA DAAWOOYINKA (Red Alert Section) */}
        <div className="max-w-4xl mx-auto mt-20">
          <div className="bg-red-50 border-2 border-dashed border-[#E63946] rounded-[2.5rem] p-8 flex flex-col md:flex-row items-center gap-6 shadow-inner">
            <div className="bg-[#E63946] text-white p-4 rounded-2xl shadow-lg">
              <ShieldCheck size={40} />
            </div>
            <div className="text-center md:text-left space-y-2">
              <h3 className="text-xl font-black text-[#E63946] uppercase italic tracking-tighter">
                Huomioi reseptien uusinnassa!
              </h3>
              <p className="text-sm md:text-base font-bold text-gray-700 leading-relaxed italic">
                Tietoturvasyistä ja lääketieteellisin perustein <span className="text-[#E63946] underline">emme uusi</span> antibiootteja, 
                vahvoja kipulääkkeitä (PKV), unilääkkeitä tai muita huumaavia lääkeaineita.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-white py-10 text-center border-t border-gray-100">
        <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.3em] italic">
          © {new Date().getFullYear()} PrimeCare Finland - Turvallinen Online-Terveydenhuolto
        </p>
      </footer>
    </div>
  );
}