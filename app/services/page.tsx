'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { db, auth } from '../lib/firebase';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import { LogOut, Loader2, ShieldCheck, Pill, Stethoscope } from 'lucide-react';

export default function ServicesPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [orderLoading, setOrderLoading] = useState(false);
  const [serviceType, setServiceType] = useState<'resepti' | 'vastaanotto' | null>(null);
  const [formData, setFormData] = useState({ 
    etunimi: '', sukunimi: '', puh: '', viesti: '', paiva: '', aika: '', hyvaksynta: false 
  });

  const handleLogout = useCallback(async () => {
    try {
      await signOut(auth);
      window.location.href = '/login'; 
    } catch (error) {
      console.error("Logout error:", error);
    }
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    const resetTimer = () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        handleLogout();
        alert("Istunnoton tila: Sinut on kirjattu ulos automaattisesti turvallisuussyistä.");
      }, 180000); // 3 daqiiqo
    };

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.replace('/login');
      } else {
        setUser(currentUser);
        setLoading(false);
        resetTimer();
      }
    });

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => window.addEventListener(event, resetTimer));

    return () => {
      unsubscribe();
      if (timer) clearTimeout(timer);
      events.forEach(event => window.removeEventListener(event, resetTimer));
    };
  }, [router, handleLogout]);

  // ⭐ SHURUUDDA CUSUB: Xogta waxaa loo dirayaa Paytrail Create API
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (serviceType === 'vastaanotto' && (!formData.paiva || !formData.aika)) {
      return alert("Ole hyvä ja valitse päivä ja kellonaika.");
    }

    setOrderLoading(true);
    try {
      const orderId = `PRC-${Math.floor(100000 + Math.random() * 900000)}`;
      const hinta = serviceType === 'vastaanotto' ? 43 : 10;

      // 1. U dir xogta API-ga Create Payment si uu Paytrail link u soo abuuro
      const res = await fetch('/api/paytrail/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          amount: hinta,
          customerEmail: user?.email,
          customerName: `${formData.etunimi} ${formData.sukunimi}`,
          palvelu: serviceType,
          viesti: formData.viesti,
          paiva: formData.paiva, // Wixii xog ah oo Success page-ka u baahan yahay
          aika: formData.aika,
          puh: formData.puh
        })
      });

      const data = await res.json();

      // 2. Haddii Paytrail ay soo celiso link-ga (href), macmiilka u dir halkaas
      if (data.href) {
        window.location.href = data.href;
      } else {
        throw new Error("Maksulinkkiä ei saatu.");
      }
    } catch (e) { 
      console.error("Payment Error:", e);
      alert("Virhe maksun aloittamisessa. Yritä uudelleen."); 
      setOrderLoading(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-white font-black text-[#006d67] animate-pulse italic text-2xl tracking-tighter">PRIMECARE...</div>;

  return (
    <div className="bg-[#f4f6fb] min-h-screen font-[Poppins]">
      {/* STATUS BAR */}
      {user && (
        <div className="bg-[#006d67] border-t border-white/10 py-3 px-6 flex justify-between items-center text-white shadow-lg sticky top-0 z-50">
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
               <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60 italic leading-none">Kirjautunut sisään</span>
               <span className="text-sm font-bold lowercase italic">{user.email}</span>
            </div>
            {user.email === "primecare1974@gmail.com" && (
              <button onClick={() => router.push('/admin')} className="flex items-center gap-2 bg-[#E63946] text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-[#E63946] transition-all shadow-lg ml-4">
                <ShieldCheck size={14} /> ADMIN PANEELI
              </button>
            )}
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 bg-white/10 border border-white/20 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#E63946] transition-all shadow-inner">
            <LogOut size={14} /> LOGOUT
          </button>
        </div>
      )}

      <div className="max-w-5xl mx-auto py-12 px-6">
        <h1 className="text-4xl md:text-5xl font-black text-[#006d67] text-center mb-12 uppercase italic tracking-tighter leading-none">Valitse tarvitsemasi palvelu</h1>
        
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div onClick={() => setServiceType('resepti')} className={`cursor-pointer p-8 rounded-[3rem] bg-white border-4 transition-all hover:shadow-2xl flex flex-col items-center text-center ${serviceType === 'resepti' ? 'border-[#E63946] scale-105' : 'border-transparent opacity-70'}`}>
            <div className="bg-red-50 w-20 h-20 rounded-[2rem] flex items-center justify-center mb-6 shadow-inner"><Pill className="text-[#E63946]" size={40} /></div>
            <h3 className="text-2xl font-black text-[#006d67] uppercase italic leading-none mb-2">Reseptin uusinta</h3>
            <p className="text-[#006d67] font-black text-2xl italic">10€</p>
          </div>

          <div onClick={() => setServiceType('vastaanotto')} className={`cursor-pointer p-8 rounded-[3rem] bg-white border-4 transition-all hover:shadow-2xl flex flex-col items-center text-center ${serviceType === 'vastaanotto' ? 'border-[#E63946] scale-105' : 'border-transparent opacity-70'}`}>
            <div className="bg-green-50 w-20 h-20 rounded-[2rem] flex items-center justify-center mb-6 shadow-inner"><Stethoscope className="text-[#006d67]" size={40} /></div>
            <h3 className="text-2xl font-black text-[#006d67] uppercase italic leading-none mb-2">Lääkärin vastaanotto</h3>
            <p className="text-[#006d67] font-black text-2xl italic">43€</p>
          </div>
        </div>

        {serviceType && (
          <form onSubmit={handleSubmit} className="bg-white p-8 md:p-12 rounded-[3.5rem] shadow-2xl space-y-8 border border-gray-100 animate-in fade-in slide-in-from-bottom-5 duration-700">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase text-gray-400 ml-4 tracking-widest">Etunimi</label>
                <input required className="w-full p-5 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-[#006d67] outline-none font-bold text-gray-700 transition-all" onChange={e => setFormData({...formData, etunimi: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase text-gray-400 ml-4 tracking-widest">Sukunimi</label>
                <input required className="w-full p-5 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-[#006d67] outline-none font-bold text-gray-700 transition-all" onChange={e => setFormData({...formData, sukunimi: e.target.value})} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase text-gray-400 ml-4 tracking-widest">Puhelinnumero</label>
              <input required type="tel" className="w-full p-5 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-[#006d67] outline-none font-bold text-gray-700 transition-all" onChange={e => setFormData({...formData, puh: e.target.value})} />
            </div>
            
            <div className="space-y-3">
              <label className="text-[11px] font-black uppercase text-[#006d67] ml-4 tracking-widest italic">Lisätietoja (max 300 merkkiä)</label>
              <textarea maxLength={300} placeholder="Kirjoita tähän lyhyesti asiasi..." className="w-full p-6 rounded-3xl border-2 border-[#f4f6fb] focus:border-[#006d67] outline-none font-bold text-gray-700 h-32 resize-none bg-gray-50/50" onChange={e => setFormData({...formData, viesti: e.target.value})}></textarea>
              <p className="text-[10px] text-right text-gray-400 font-bold italic pr-4">{formData.viesti?.length || 0}/300</p>
            </div>

            {serviceType === 'vastaanotto' && (
              <div className="grid md:grid-cols-1 gap-8 bg-[#f4f6fb] p-10 rounded-[3rem] border border-gray-100">
                <div className="space-y-4">
                  <label className="text-[12px] font-black uppercase text-[#006d67] tracking-widest leading-none block ml-2">1. Valitse päivämäärä</label>
                  <input required type="date" className="w-full p-5 rounded-2xl border-2 border-white focus:border-[#006d67] outline-none font-black text-gray-700 shadow-sm" onChange={e => setFormData({...formData, paiva: e.target.value})} />
                </div>
                <div className="space-y-4">
                  <label className="text-[12px] font-black uppercase text-[#006d67] tracking-widest leading-none block ml-2">2. Valitse kellonaika</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {['17:00', '17:30', '18:00', '18:30', '19:00', '19:30'].map(t => (
                      <button key={t} type="button" onClick={() => setFormData({...formData, aika: t})} className={`p-4 text-xs font-black rounded-2xl transition-all border-2 shadow-sm ${formData.aika === t ? 'bg-[#006d67] text-white border-[#006d67] scale-105' : 'bg-white text-gray-400 border-transparent hover:border-gray-200'}`}>{t}</button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <button type="submit" disabled={orderLoading} className="w-full bg-[#E63946] text-white py-6 rounded-[2.5rem] font-black text-2xl shadow-2xl hover:bg-[#c82f3b] transition-all transform active:scale-95 uppercase italic tracking-[0.1em] mt-8 flex items-center justify-center gap-4">
              {orderLoading ? <><Loader2 className="animate-spin" size={28} /> KÄSITELLÄÄN...</> : "VAHVISTA JA MAKSA →"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}