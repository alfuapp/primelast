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
  ShieldPlus,
  ArrowRight
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
    <div className="bg-white min-h-screen font-[Poppins] text-slate-900">
      
      {/* 1. STATUS BAR */}
      {user && (
        <div className="bg-[#004d40] py-2 px-6 flex justify-between items-center text-white">
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/60 italic">Kirjautunut sisään:</span>
            <span className="text-xs font-medium italic">{user.email}</span>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 text-[10px] font-black uppercase hover:text-red-400 transition-all">
            <LogOut size={12} /> LOGOUT
          </button>
        </div>
      )}

      {/* 2. HERO SECTION */}
      <section className="py-16 md:py-24 px-6 border-b border-gray-100">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="flex items-center gap-2 text-[#006d67] font-black uppercase text-xs tracking-[0.2em]">
              <div className="w-10 h-[2px] bg-[#006d67]"></div> Online-Lääkäripalvelu
            </div>
            <h1 className="text-5xl md:text-8xl font-light text-[#1a1a1a] leading-[0.9] tracking-tighter">
              PrimeCare <br /><span className="font-black italic text-[#006d67]">Palvelut.</span>
            </h1>
            <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-lg">
              Asiantunteva lääkäriapu ja reseptien uusinta suoraan kotisohvaltasi. Nopeasti, turvallisesti ja suomalaisella ammattitaidolla.
            </p>
            <button 
              onClick={() => router.push('/services')}
              className="group flex items-center gap-4 bg-[#1a1a1a] text-white px-8 py-5 rounded-none font-bold text-sm tracking-widest hover:bg-[#006d67] transition-all"
            >
              TUTUSTU PALVELUIHIN <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
          <div className="relative">
            <img 
              src="/images/doctor.png" 
              alt="Doctor" 
              className="w-full h-auto rounded-none grayscale hover:grayscale-0 transition-all duration-700 shadow-2xl" 
            />
          </div>
        </div>
      </section>

      {/* 3. SERVICES SECTION (Medfin Style) */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Card 1: Dark Teal */}
          <div className="bg-[#003d33] p-10 md:p-16 rounded-none flex flex-col justify-between min-h-[400px] text-white">
            <div>
              <Stethoscope size={40} className="mb-8 opacity-50" />
              <h3 className="text-3xl font-black uppercase italic mb-4 tracking-tighter">Reseptin uusiminen</h3>
              <p className="text-white/60 font-medium text-base leading-relaxed max-w-xs">
                Uusi reseptisi nopeasti ja vaivattomasti. Palvelu käytettävissäsi 24/7.
              </p>
            </div>
            <div className="flex justify-between items-end">
              <span className="text-5xl font-light tracking-tighter italic">10€</span>
              <button onClick={() => router.push('/services')} className="border-b-2 border-white pb-1 text-xs font-black uppercase tracking-widest hover:text-[#ffb400] hover:border-[#ffb400] transition-all">Tilaa Palvelu</button>
            </div>
          </div>

          {/* Card 2: Medical Blue */}
          <div className="bg-[#0a2342] p-10 md:p-16 rounded-none flex flex-col justify-between min-h-[400px] text-white">
            <div>
              <ShieldPlus size={40} className="mb-8 opacity-50" />
              <h3 className="text-3xl font-black uppercase italic mb-4 tracking-tighter">Lääkärin neuvonta</h3>
              <p className="text-white/60 font-medium text-base leading-relaxed max-w-xs">
                Asiantuntevaa lääkärin neuvontaa kaikissa terveyteen liittyvissä kysymyksissäsi.
              </p>
            </div>
            <div className="flex justify-between items-end">
              <span className="text-5xl font-light tracking-tighter italic">20€</span>
              <button onClick={() => router.push('/services')} className="border-b-2 border-white pb-1 text-xs font-black uppercase tracking-widest hover:text-blue-400 hover:border-blue-400 transition-all">Kysy Lääkäriltä</button>
            </div>
          </div>

          {/* Card 3: Deep Slate */}
          <div className="bg-[#1a1a1a] p-10 md:p-16 rounded-none flex flex-col justify-between min-h-[400px] text-white">
            <div>
              <Heart size={40} className="mb-8 opacity-50" />
              <h3 className="text-3xl font-black uppercase italic mb-4 tracking-tighter">Luotettava apu</h3>
              <p className="text-white/60 font-medium text-base leading-relaxed max-w-xs">
                Tunnistautuminen ja suojattu yhteys takaavat potilasturvallisuuden.
              </p>
            </div>
            <div className="mt-8">
              <span className="text-[#ffb400] text-xs font-black uppercase tracking-widest italic">100% Suojattu Palvelu</span>
            </div>
          </div>

          {/* Card 4: Medical Teal */}
          <div className="bg-[#004d40] p-10 md:p-16 rounded-none flex flex-col justify-between min-h-[400px] text-white">
            <div>
              <Activity size={40} className="mb-8 opacity-50" />
              <h3 className="text-3xl font-black uppercase italic mb-4 tracking-tighter">Nopea Vastaus</h3>
              <p className="text-white/60 font-medium text-base leading-relaxed max-w-xs">
                Käsittelemme pyyntösi välittömästi. Saat vastauksen alle 30 minuutissa.
              </p>
            </div>
            <div className="mt-8 text-white/30 text-[10px] font-bold uppercase tracking-widest">
              Vastausaika: &lt; 30 min
            </div>
          </div>

        </div>
      </section>

      {/* 4. WARNING SECTION */}
      <section className="py-20 bg-[#f9f9f9]">
        <div className="max-w-4xl mx-auto px-6">
          <div className="border-l-8 border-red-600 pl-8 py-4">
            <h3 className="text-2xl font-black text-red-600 uppercase italic mb-4 tracking-tight">Huomioitavaa</h3>
            <p className="text-lg font-bold text-slate-700 leading-relaxed italic">
              Emme uusi antibiootteja, vahvoja kipulääkkeitä (PKV), unilääkkeitä tai muita huumaavia lääkeaineita.
            </p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 bg-white border-t border-gray-100 text-center">
        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.5em]">
          © {new Date().getFullYear()} PrimeCare Finland
        </p>
      </footer>
    </div>
  );
}