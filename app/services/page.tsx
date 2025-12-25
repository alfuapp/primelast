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
      }, 180000); 
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (serviceType === 'vastaanotto' && (!formData.paiva || !formData.aika)) {
      return alert("Ole hyvä ja valitse päivä ja kellonaika.");
    }

    setOrderLoading(true);
    try {
      const orderId = `PRC-${Math.floor(100000 + Math.random() * 900000)}`;
      const hinta = serviceType === 'vastaanotto' ? 43 : 10;

      // ⭐ Xogta waxaa lagu darayaa URL-ka success-ka si Success Page-ku Firestore ugu kaydiyo
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
          paiva: formData.paiva,
          aika: formData.aika,
          puh: formData.puh
        })
      });

      const data = await res.json();

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
      {user && (
        <div className="bg-[#006d67] border-t border-white/10 py-3 px-6 flex justify-between items-center text-white shadow-lg sticky top-0 z-50">
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
               <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60 italic leading-none text-xs">Käyttäjä</span>
               <span className="text-sm font-bold lowercase italic">{user.email}</span>
            </div>
          </div>
          <button onClick={handleLogout} className="bg-white/10 border border-white/20 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#E63946] transition-all">
            LOGOUT
          </button>
        </div>
      )}

      <div className="max-w-4xl mx-auto py-12 px-6">
        <h1 className="text-4xl md:text-6xl font-black text-[#006d67] text-center mb-16 uppercase italic tracking-tighter leading-none drop-shadow-sm">Valitse Palvelu</h1>
        
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div onClick={() => setServiceType('resepti')} className={`cursor-pointer p-10 rounded-[3rem] bg-white border-8 transition-all hover:shadow-2xl flex flex-col items-center text-center ${serviceType === 'resepti' ? 'border-[#E63946] scale-105' : 'border-white opacity-60 shadow-md'}`}>
            <Pill className="text-[#E63946] mb-4" size={50} />
            <h3 className="text-2xl font-black text-[#006d67] uppercase italic leading-none mb-2">Resepti</h3>
            <p className="text-[#006d67] font-black text-3xl italic">10€</p>
          </div>

          <div onClick={() => setServiceType('vastaanotto')} className={`cursor-pointer p-10 rounded-[3rem] bg-white border-8 transition-all hover:shadow-2xl flex flex-col items-center text-center ${serviceType === 'vastaanotto' ? 'border-[#E63946] scale-105' : 'border-white opacity-60 shadow-md'}`}>
            <Stethoscope className="text-[#006d67] mb-4" size={50} />
            <h3 className="text-2xl font-black text-[#006d67] uppercase italic leading-none mb-2">Vastaanotto</h3>
            <p className="text-[#006d67] font-black text-3xl italic">43€</p>
          </div>
        </div>

        {serviceType && (
          <form onSubmit={handleSubmit} className="bg-red p-10 md:p-16 rounded-[4rem] shadow-[20px_20px_0px_0px_rgba(0,209,103,0.1)] space-y-10 border-4 border-gray-900 animate-in fade-in slide-in-from-bottom-5">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-sm font-black uppercase text-gray-500 italic ml-4">Etunimi</label>
                <input required placeholder="Kirjoita nimi..." className="w-full p-6 bg-red rounded-3xl border-4 border-gray-900 focus:border-[#006d67] focus:ring-4 focus:ring-[#006d67]/10 outline-none font-bold text-xl text-gray-800 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.05)] transition-all" onChange={e => setFormData({...formData, etunimi: e.target.value})} />
              </div>
              <div className="space-y-3">
                <label className="text-sm font-black uppercase text-gray-900 italic ml-4">Sukunimi</label>
                <input required placeholder="Kirjoita sukunimi..." className="w-full p-6 bg-white rounded-3xl border-4 border-gray-900 focus:border-[#006d67] outline-none font-bold text-xl text-gray-800 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.05)] transition-all" onChange={e => setFormData({...formData, sukunimi: e.target.value})} />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-black uppercase text-gray-900 italic ml-4">Puhelinnumero</label>
              <input required type="tel" placeholder="040 123 4567" className="w-full p-6 bg-green rounded-3xl border-4 border-gray-900 focus:border-[#006d67] outline-none font-bold text-xl text-gray-800 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.05)] transition-all" onChange={e => setFormData({...formData, puh: e.target.value})} />
            </div>
            
            <div className="space-y-3">
              <label className="text-sm font-black uppercase text-[#006d67] italic ml-4">Lisätietoja </label>
              <textarea maxLength={300} placeholder="Kirjoita lyhyesti asiasi..." className="w-full p-8 rounded-[2.5rem] border-4 border-gray-900 focus:border-[#006d67] outline-none font-bold text-xl text-gray-800 h-44 resize-none bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,0.05)]" onChange={e => setFormData({...formData, viesti: e.target.value})}></textarea>
              <p className="text-xs text-right text-gray-400 font-black italic pr-6">{formData.viesti?.length || 0}/300</p>
            </div>

            {serviceType === 'vastaanotto' && (
              <div className="bg-[#f4f6fb] p-10 rounded-[3.5rem] border-4 border-brown-900 space-y-8">
                <div className="space-y-4">
                  <label className="text-md font-black uppercase text-[#006d67] italic block ml-2">1. Valitse päivä</label>
                  <input required type="date" className="w-full p-6 rounded-2xl border-4 border-bla focus:border-[#006d67] outline-none font-black text-xl text-gray-800" onChange={e => setFormData({...formData, paiva: e.target.value})} />
                </div>
                <div className="space-y-4">
                  <label className="text-md font-black uppercase text-[#006d67] italic block ml-2">2. Valitse aika</label>
                  <div className="grid grid-cols-2 gap-4">
                    {['17:00', '18:00', '19:00', '20:00'].map(t => (
                      <button key={t} type="button" onClick={() => setFormData({...formData, aika: t})} className={`p-6 text-lg font-black rounded-2xl transition-all border-4 ${formData.aika === t ? 'bg-[#009900] text-white border-[#006d67] shadow-lg scale-105' : 'bg-white text-gray-400 border-gray-200 hover:border-gray-900'}`}>{t}</button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <button type="submit" disabled={orderLoading} className="w-full bg-[#E63946] text-white py-8 rounded-[3rem] font-black text-3xl shadow-[0px_15px_30px_rgba(230,57,70,0.3)] hover:bg-[#c82f3b] transition-all transform active:scale-95 uppercase italic tracking-wider mt-6 flex items-center justify-center gap-4">
              {orderLoading ? <Loader2 className="animate-spin" size={32} /> : "VAHVISTA JA MAKSA →"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}