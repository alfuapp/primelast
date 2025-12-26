'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { db, auth } from '../lib/firebase';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import { LogOut, Loader2, ShieldCheck, Pill, Stethoscope, AlertTriangle, PhoneCall, ArrowRight } from 'lucide-react';

export default function ServicesPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [orderLoading, setOrderLoading] = useState(false);
  const [serviceType, setServiceType] = useState<'resepti' | 'vastaanotto' | null>(null);
  const [formData, setFormData] = useState({ 
    etunimi: '', sukunimi: '', puh: '', viesti: '', paiva: '', aika: '', hyvaksynta: false 
  });

  // 1. Session Management
  const handleLogout = useCallback(async () => {
    try {
      await signOut(auth);
      window.location.href = '/login'; 
    } catch (error) { console.error("Logout error:", error); }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) { router.replace('/login'); } 
      else { setUser(currentUser); setLoading(false); }
    });
    return () => unsubscribe();
  }, [router]);

  // 2. Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (serviceType === 'vastaanotto' && (!formData.paiva || !formData.aika)) {
      return alert("Ole hyvä ja valitse päivä ja kellonaika.");
    }

    setOrderLoading(true);
    try {
      const orderId = `PRC-${Math.floor(100000 + Math.random() * 900000)}`;
      const hinta = serviceType === 'vastaanotto' ? 43 : 10;

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
      if (data.href) { window.location.href = data.href; } 
      else { throw new Error("Maksulinkkiä ei saatu."); }
    } catch (e) {
      alert("Virhe maksun aloittamisessa.");
      setOrderLoading(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-white font-black text-[#006d67] animate-pulse italic text-2xl tracking-tighter">PRIMECARE...</div>;

  return (
    <div className="bg-white min-h-screen font-[Poppins]">
      {/* Status Bar */}
      {user && (
        <div className="bg-[#004d40] py-3 px-6 flex justify-between items-center text-white sticky top-0 z-50">
          <span className="text-xs font-bold italic">{user.email}</span>
          <button onClick={handleLogout} className="text-[10px] font-black uppercase hover:text-red-400">LOGOUT</button>
        </div>
      )}

      <div className="max-w-5xl mx-auto py-16 px-6">
        <h1 className="text-5xl md:text-7xl font-black text-[#1a1a1a] text-center mb-4 uppercase italic tracking-tighter">Valitse <span className="text-[#006d67]">Palvelu</span></h1>
        <p className="text-center text-slate-500 font-bold mb-16 uppercase text-[10px] tracking-[0.3em]">Lue ehdot huolellisesti ennen tilausta</p>
        
        {/* NEW SERVICE SELECTION (Medfin Style - No Rounds) */}
        <div className="space-y-6 mb-16">
          
          {/* Service 1: Resepti */}
          <div 
            onClick={() => setServiceType('resepti')} 
            className={`border-4 p-8 transition-all cursor-pointer flex flex-col md:flex-row justify-between items-center gap-6 ${serviceType === 'resepti' ? 'border-[#006d67] bg-[#f0f9f8]' : 'border-gray-100 bg-white'}`}
          >
            <div className="flex items-center gap-6">
              <div className={`p-4 ${serviceType === 'resepti' ? 'bg-[#006d67] text-white' : 'bg-gray-100 text-gray-400'}`}>
                <Pill size={32} />
              </div>
              <div>
                <h3 className="text-2xl font-black uppercase italic text-gray-900 leading-none">Reseptin uusiminen</h3>
                <p className="text-xs font-bold text-gray-500 mt-2 italic">Vain jatkoreseptit (Ei PKV tai antibiootit)</p>
              </div>
            </div>
            <div className="text-4xl font-black italic text-[#006d67]">10€</div>
          </div>

          {/* Service 2: Vastaanotto */}
          <div 
            onClick={() => setServiceType('vastaanotto')} 
            className={`border-4 p-8 transition-all cursor-pointer flex flex-col md:flex-row justify-between items-center gap-6 ${serviceType === 'vastaanotto' ? 'border-[#0055aa] bg-[#f0f5fa]' : 'border-gray-100 bg-white'}`}
          >
            <div className="flex items-center gap-6">
              <div className={`p-4 ${serviceType === 'vastaanotto' ? 'bg-[#0055aa] text-white' : 'bg-gray-100 text-gray-400'}`}>
                <Stethoscope size={32} />
              </div>
              <div>
                <h3 className="text-2xl font-black uppercase italic text-gray-900 leading-none">Lääkärin neuvonta</h3>
                <p className="text-xs font-bold text-gray-500 mt-2 italic">Videovastaanotto tai puhelinaika</p>
              </div>
            </div>
            <div className="text-4xl font-black italic text-[#0055aa]">43€</div>
          </div>
        </div>

        {/* FORM SECTION */}
        {serviceType && (
          <form onSubmit={handleSubmit} className="border-t-8 border-[#1a1a1a] bg-gray-50 p-8 md:p-16 space-y-12 animate-in fade-in duration-500">
            
            {/* LIABILITY & WARNING SECTION */}
            <div className="space-y-6">
              <div className="bg-red-50 border-l-8 border-red-600 p-6 flex gap-6">
                <AlertTriangle className="text-red-600 shrink-0" size={30} />
                <div>
                  <h4 className="text-red-600 font-black uppercase italic text-sm mb-1">Tärkeä huomautus (Vastuuvapaus)</h4>
                  <p className="text-xs font-bold text-red-900 leading-relaxed italic">
                    Valitsemalla tämän palvelun vahvistat, että olet lukenut ehdot. Väärin valitusta palvelusta (esim. uusi resepti jatkoreseptin sijaan) <span className="underline">maksua ei palauteta</span>. Asiakas on itse vastuussa oikean palvelun valinnasta.
                  </p>
                </div>
              </div>

              {serviceType === 'resepti' && (
                <div className="bg-blue-50 border-l-8 border-blue-600 p-6 flex justify-between items-center">
                  <div className="flex items-center gap-4 text-blue-900">
                    <PhoneCall size={24} />
                    <p className="text-xs font-bold italic leading-tight">Tarvitsetko lääkärin arvion tai täysin uuden lääkityksen? <br /> Vaihda 43€ palveluun välttääksesi hylkäyksen.</p>
                  </div>
                  <button type="button" onClick={() => setServiceType('vastaanotto')} className="text-[10px] font-black uppercase border-b-2 border-blue-600 text-blue-600">Vaihda tästä →</button>
                </div>
              )}
            </div>

            {/* INPUT FIELDS */}
            <div className="grid md:grid-cols-2 gap-8">
              <input required placeholder="ETUNIMI" className="p-6 bg-white border-2 border-gray-200 focus:border-[#006d67] outline-none font-bold text-lg" onChange={e => setFormData({...formData, etunimi: e.target.value})} />
              <input required placeholder="SUKUNIMI" className="p-6 bg-white border-2 border-gray-200 focus:border-[#006d67] outline-none font-bold text-lg" onChange={e => setFormData({...formData, sukunimi: e.target.value})} />
            </div>

            <input required type="tel" placeholder="PUHELINNUMERO (esim. 0401234567)" className="w-full p-6 bg-white border-2 border-gray-200 focus:border-[#006d67] outline-none font-bold text-lg" onChange={e => setFormData({...formData, puh: e.target.value})} />
            
            <textarea maxLength={300} placeholder="KERRO LYHYESTI ASIASI TAI LÄÄKITYS..." className="w-full p-6 bg-white border-2 border-gray-200 focus:border-[#006d67] outline-none font-bold text-lg h-32 resize-none" onChange={e => setFormData({...formData, viesti: e.target.value})}></textarea>

            {/* SCHEDULING FOR VASTAANOTTO */}
            {serviceType === 'vastaanotto' && (
              <div className="p-8 bg-white border-2 border-blue-200 space-y-8">
                <div className="space-y-4">
                  <label className="text-xs font-black uppercase text-blue-600">1. Valitse päivä</label>
                  <input required type="date" className="w-full p-4 border-2 border-gray-100 outline-none font-bold" onChange={e => setFormData({...formData, paiva: e.target.value})} />
                </div>
                <div className="space-y-4">
                  <label className="text-xs font-black uppercase text-blue-600">2. Valitse kellonaika</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {['17:00', '18:00', '19:00', '20:00'].map(t => (
                      <button key={t} type="button" onClick={() => setFormData({...formData, aika: t})} className={`p-4 text-sm font-black transition-all border-2 ${formData.aika === t ? 'bg-[#0055aa] text-white border-[#0055aa]' : 'bg-white text-gray-300 border-gray-100'}`}>{t}</button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* FINAL BUTTON */}
            <button type="submit" disabled={orderLoading} className="w-full bg-[#1a1a1a] text-white py-8 font-black text-2xl hover:bg-[#006d67] transition-all flex items-center justify-center gap-4 uppercase italic tracking-widest">
              {orderLoading ? <Loader2 className="animate-spin" size={32} /> : "VALITSE JA MAKSA →"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}