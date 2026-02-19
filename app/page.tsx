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
  Video,
  MessageSquare,
  ArrowRight,
  FileText
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
    <div className="bg-[#E8F8F5] min-h-screen font-[Poppins] no-scrollbar overflow-x-hidden">
      
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
      <section className="bg-white py-12 md:py-20 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="text-center md:text-left space-y-6 order-2 md:order-1">
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
              className="w-full md:w-auto bg-[#006d67] text-white px-10 py-5 rounded-2xl font-black text-lg shadow-2xl hover:bg-black transition-all transform hover:scale-105"
            >
              VARAA AIKA NYT →
            </button>
          </div>

          <div className="relative flex justify-center order-1 md:order-2">
            <div className="absolute -top-5 -left-5 md:-top-10 md:-left-10 bg-white p-4 rounded-3xl shadow-xl z-10">
                <Activity className="text-[#E63946]" size={32} />
            </div>
            
            <div className="w-full max-w-sm md:max-w-md h-[300px] md:h-[450px] bg-gray-100 rounded-[2rem] shadow-2xl overflow-hidden border-4 border-white">
                <img 
                  src="/images/prime-.png" 
                  alt="Doctor" 
                  className="w-full h-full object-cover object-top" 
                />
            </div>
          </div>
        </div>
      </section>

      {/* 3. SERVICES SECTION */}
      <section className="bg-[#f4f6fb] py-20 px-6">
        <div className="flex flex-col items-center gap-3 mb-10">
  <span className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] italic">
    Meillä voit maksaa:
  </span>
  <div className="flex flex-wrap justify-center items-center gap-5 bg-white px-6 py-4 rounded-3xl border border-gray-100 shadow-sm">
    
    {/* ePassi - Waxaan u qornay si qoraal iyo icon isku jira ah si uu u muuqdo */}
    <div className="flex items-center gap-1 bg-[#3db6e6] px-2 py-1 rounded-md">
       <span className="text-white font-black text-[12px] italic">ePassi</span>
    </div>
    
    <div className="h-4 w-[1px] bg-gray-200"></div>

    {/* Visa Icon (SVG) */}
    <svg className="h-4 md:h-5" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18.985 34.938h6.14l3.832-23.876h-6.14l-3.832 23.876z" fill="#1A1F71"/>
      <path d="M47.11 11.455c-1.127-.426-2.912-.888-5.118-.888-5.636 0-9.613 2.871-9.646 7.02-.036 3.04 2.844 4.735 5.009 5.748 2.221 1.037 2.969 1.696 2.959 2.617-.018 1.411-1.764 2.05-3.394 2.05-2.274 0-3.483-.326-5.337-1.108l-.75-.349-.8 4.757.77.342c2.046.918 4.385 1.714 6.8 1.748 6.002.01 9.904-2.846 9.957-7.25.025-2.418-1.503-4.254-4.814-5.78-2-.958-3.226-1.598-3.212-2.57.006-.867.973-1.785 3.085-1.785 1.748-.031 3.023.364 3.996.764l.477.213.818-4.838-.747-.282z" fill="#1A1F71"/>
    </svg>

    {/* Mastercard Icon (SVG) */}
    <svg className="h-6 md:h-8" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="16" r="10" fill="#EB001B" fillOpacity="0.8"/>
      <circle cx="20" cy="16" r="10" fill="#F79E1B" fillOpacity="0.8"/>
    </svg>

    <div className="h-4 w-[1px] bg-gray-200"></div>

    {/* Bank & Paytrail */}
    <div className="flex items-center gap-2">
      <div className="bg-blue-900 text-white px-2 py-0.5 rounded text-[8px] font-black italic">PAYTRAIL</div>
      <span className="text-[10px] font-black text-gray-700 italic">PANKKI</span>
    </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* Card 1: Resepti */}
          <div onClick={() => router.push('/services')} className="group cursor-pointer bg-[#006d67] p-8 rounded-[2rem] shadow-xl hover:-translate-y-2 transition-all flex flex-col justify-between min-h-[280px]">
            <div>
              <div className="bg-white/20 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <FileText size={24} className="text-white" />
              </div>
              <h3 className="text-xl font-black text-white uppercase italic mb-2 tracking-tighter">Reseptin uusiminen</h3>
              <p className="text-white/80 font-bold text-[11px]">Uusi lääkityksesi nopeasti ilman käyntiä.</p>
            </div>
            <div className="flex justify-between items-end mt-4">
              <div className="text-white font-black text-3xl italic">9€</div>
              <ArrowRight className="text-white" size={20} />
            </div>
          </div>

          {/* Card 2: Video */}
          <div onClick={() => router.push('/services')} className="group cursor-pointer bg-[#0055aa] p-8 rounded-[2rem] shadow-xl hover:-translate-y-2 transition-all flex flex-col justify-between min-h-[280px]">
            <div>
              <div className="bg-white/20 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Video size={24} className="text-white" />
              </div>
              <h3 className="text-xl font-black text-white uppercase italic mb-2 tracking-tighter">Videovastaanotto</h3>
              <p className="text-white/80 font-bold text-[11px]">Henkilökohtainen lääkärikäynti livenä.</p>
            </div>
            <div className="flex justify-between items-end mt-4">
              <div className="flex flex-col">
                <div className="text-white font-black text-3xl italic leading-none">7€</div>
                <span className="text-[9px] font-bold text-white/60 uppercase italic">Kela-korvauksella</span>
              </div>
              <ArrowRight className="text-white" size={20} />
            </div>
          </div>

          {/* Card 3: Chat */}
          <div onClick={() => router.push('/services')} className="group cursor-pointer bg-[#1B2631] p-8 rounded-[2rem] shadow-xl hover:-translate-y-2 transition-all flex flex-col justify-between min-h-[280px]">
            <div>
              <div className="bg-white/20 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <MessageSquare size={24} className="text-white" />
              </div>
              <h3 className="text-xl font-black text-white uppercase italic mb-2 tracking-tighter">Puhelin & Chat</h3>
              <p className="text-white/80 font-bold text-[11px]">Nopea apu viestillä tai puhelulla.</p>
            </div>
            <div className="flex justify-between items-end mt-4">
              <div className="flex flex-col">
                <div className="text-white font-black text-3xl italic leading-none">7€</div>
                <span className="text-[9px] font-bold text-white/60 uppercase italic">Kela-korvauksella</span>
              </div>
              <ArrowRight className="text-white" size={20} />
            </div>
          </div>
        </div>

        {/* Alert Section */}
        <div className="max-w-4xl mx-auto mt-16 px-4">
          <div className="bg-red-50 border-2 border-dashed border-[#E63946] rounded-[2.5rem] p-8 flex flex-col md:flex-row items-center gap-6 shadow-sm">
            <div className="bg-[#E63946] text-white p-4 rounded-2xl">
              <ShieldCheck size={32} />
            </div>
            <div className="space-y-1 text-center md:text-left">
              <h3 className="text-xl font-black text-[#E63946] uppercase italic tracking-tighter leading-tight">
                Huomioi reseptien uusinnassa!
              </h3>
              <p className="text-sm font-bold text-gray-800 italic leading-snug">
                Emme uusi antibiootteja, vahvoja kipulääkkeitä tai huumaavia aineita.
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