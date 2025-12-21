'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { db, auth } from '../lib/firebase';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Pill, Stethoscope, LogOut, Loader2 } from 'lucide-react';

export default function ServicesPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [orderLoading, setOrderLoading] = useState(false);
  const [serviceType, setServiceType] = useState<'resepti' | 'vastaanotto' | null>(null);
  const [formData, setFormData] = useState({ 
    etunimi: '', sukunimi: '', puh: '', viesti: '', paiva: '', aika: '', hyvaksynta: false 
  });

  // 1. Shaqada Logout-ka (Handle Logout)
  const handleLogout = useCallback(async () => {
    try {
      await signOut(auth);
      window.location.href = '/login'; 
    } catch (error) {
      console.error("Logout error:", error);
    }
  }, []);

  // 2. Amniga: Hubinta Login-ka & Auto-Logout (3 Daqiiqo)
  useEffect(() => {
    let timer: NodeJS.Timeout;

    // Shaqada saacada dib u bilaabeysa
    const resetTimer = () => {
      if (timer) clearTimeout(timer);
      // 180,000ms = 3 Daqiiqo
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
        resetTimer(); // Bilow saacada markuu soo galo
      }
    });

    // Dhageystayaasha dhaqdhaqaaqa macmiilka
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => window.addEventListener(event, resetTimer));

    return () => {
      unsubscribe();
      if (timer) clearTimeout(timer);
      events.forEach(event => window.removeEventListener(event, resetTimer));
    };
  }, [router, handleLogout]);

  // 3. Gudbinta Foomka & Redirect-ka Paytrail
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (serviceType === 'vastaanotto' && (!formData.paiva || !formData.aika)) {
      return alert("Ole hyvä ja valitse päivä ja kellonaika.");
    }

    setOrderLoading(true);
    try {
      const orderId = `PRC-${Math.floor(100000 + Math.random() * 900000)}`;
      const hinta = serviceType === 'vastaanotto' ? 43 : 10;

      await addDoc(collection(db, "tilaukset"), { 
        userId: user?.uid, 
        email: user?.email, 
        palvelu: serviceType, 
        hinta: hinta,
        ...formData, 
        orderId, 
        status: 'pending', 
        createdAt: serverTimestamp() 
      });

      alert("Tilaustiedot tallennettu. Siirrytään maksuun...");
      window.location.href = `/paytrail?orderId=${orderId}&amount=${hinta}`;

    } catch (e) { 
      console.error("Firestore Error:", e);
      alert("Virhe tapahtui tallennuksessa!"); 
      setOrderLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white font-black text-[#006d67] animate-pulse italic text-2xl">
        PRIMECARE...
      </div>
    );
  }

  return (
    <div className="bg-[#f4f6fb] min-h-screen font-[Poppins]">
      {/* STATUS BAR */}
      {user && (
        <div className="bg-[#006d67] border-t border-white/10 py-3 px-6 flex justify-between items-center text-white shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60 italic">Kirjautunut sisään</span>
            <span className="text-sm font-bold tracking-tight lowercase italic border-b border-white/30">{user.email}</span>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 bg-white/10 border border-white/20 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#E63946] transition-all shadow-inner">
            <LogOut size={14} /> LOGOUT
          </button>
        </div>
      )}

      <div className="max-w-5xl mx-auto py-12 px-6">
        <h1 className="text-4xl md:text-5xl font-black text-[#006d67] text-center mb-12 uppercase italic tracking-tighter leading-none">
          Valitse tarvitsemasi palvelu
        </h1>
        
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div onClick={() => setServiceType('resepti')} className={`cursor-pointer p-8 rounded-[2.5rem] bg-white border-4 transition-all hover:shadow-xl ${serviceType === 'resepti' ? 'border-[#E63946] scale-105' : 'border-transparent opacity-60 hover:opacity-100'}`}>
            <div className="bg-red-50 w-14 h-14 rounded-2xl flex items-center justify-center mb-4"><Pill className="text-[#E63946]" size={30} /></div>
            <h3 className="text-2xl font-black text-[#006d67]">Reseptin uusinta</h3>
            <p className="text-[#006d67] font-black text-xl italic leading-none mt-2">10€</p>
          </div>

          <div onClick={() => setServiceType('vastaanotto')} className={`cursor-pointer p-8 rounded-[2.5rem] bg-white border-4 transition-all hover:shadow-xl ${serviceType === 'vastaanotto' ? 'border-[#E63946] scale-105' : 'border-transparent opacity-60 hover:opacity-100'}`}>
            <div className="bg-green-50 w-14 h-14 rounded-2xl flex items-center justify-center mb-4"><Stethoscope className="text-[#006d67]" size={30} /></div>
            <h3 className="text-2xl font-black text-[#006d67]">Lääkärin vastaanotto</h3>
            <p className="text-[#006d67] font-black text-xl italic leading-none mt-2">43€</p>
          </div>
        </div>

        {serviceType && (
          <form onSubmit={handleSubmit} className="bg-white p-8 md:p-12 rounded-[3rem] shadow-2xl space-y-6 border border-gray-100 animate-in fade-in slide-in-from-bottom-5 duration-500">
            <div className="grid md:grid-cols-2 gap-4">
              <input required placeholder="Etunimi" className="p-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-[#006d67] font-bold text-gray-700" onChange={e => setFormData({...formData, etunimi: e.target.value})} />
              <input required placeholder="Sukunimi" className="p-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-[#006d67] font-bold text-gray-700" onChange={e => setFormData({...formData, sukunimi: e.target.value})} />
            </div>

            <input required type="tel" placeholder="Puhelinnumero" className="w-full p-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-[#006d67] font-bold text-gray-700" onChange={e => setFormData({...formData, puh: e.target.value})} />

            {serviceType === 'vastaanotto' && (
              <div className="grid md:grid-cols-1 gap-6 bg-[#f4f6fb] p-8 rounded-[2.5rem] border border-gray-100">
                <div className="space-y-3">
                  <label className="text-[12px] font-black uppercase text-[#006d67] ml-2 italic tracking-widest leading-none">1. Valitse päivämäärä</label>
                  <input required type="date" className="w-full p-5 rounded-2xl border-2 border-white focus:border-[#006d67] outline-none font-bold text-gray-700 shadow-sm transition-all" onChange={e => setFormData({...formData, paiva: e.target.value})} />
                </div>
                <div className="space-y-3">
                  <label className="text-[12px] font-black uppercase text-[#006d67] ml-2 italic tracking-widest leading-none">2. Valitse kellonaika</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {['17:00', '17:30', '18:00', '18:30', '19:00', '19:30'].map(t => (
                      <button key={t} type="button" onClick={() => setFormData({...formData, aika: t})} className={`p-4 text-sm font-black rounded-2xl transition-all border-2 ${formData.aika === t ? 'bg-[#006d67] text-white border-[#006d67] shadow-lg scale-105' : 'bg-white text-gray-400 border-transparent hover:border-gray-200 shadow-sm'}`}>{t}</button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <button type="submit" disabled={orderLoading} className="w-full bg-[#E63946] text-white py-6 rounded-[2rem] font-black text-2xl shadow-xl hover:bg-[#c82f3b] transition-all transform active:scale-95 uppercase italic tracking-[0.1em] mt-8 flex items-center justify-center gap-3">
              {orderLoading ? <><Loader2 className="animate-spin" size={24} /> KÄSITELLÄÄN...</> : "VAHVISTA JA MAKSA →"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}