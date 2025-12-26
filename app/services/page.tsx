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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setOrderLoading(true);
    try {
      const orderId = `PRC-${Math.floor(100000 + Math.random() * 900000)}`;
      const hinta = serviceType === 'vastaanotto' ? 43 : 10;
      const res = await fetch('/api/paytrail/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId, amount: hinta, customerEmail: user?.email,
          customerName: `${formData.etunimi} ${formData.sukunimi}`,
          palvelu: serviceType, viesti: formData.viesti,
          paiva: formData.paiva, aika: formData.aika, puh: formData.puh
        })
      });
      const data = await res.json();
      if (data.href) { window.location.href = data.href; } 
      else { throw new Error("Error"); }
    } catch (e) {
      alert("Virhe!");
      setOrderLoading(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-white font-black text-[#006d67] animate-pulse italic text-xl uppercase">PrimeCare...</div>;

  return (
    // 'overflow-x-hidden' waxay joojinaysaa in bogga bidix iyo midig loo jiido
    <div className="bg-white min-h-screen font-[Poppins] overflow-x-hidden">
      
      {/* Status Bar */}
      {user && (
        <div className="bg-[#004d40] py-2 px-4 flex justify-between items-center text-white sticky top-0 z-50">
          <span className="text-[10px] font-bold truncate max-w-[200px]">{user.email}</span>
          <button onClick={handleLogout} className="text-[9px] font-black uppercase border border-white/20 px-2 py-1">LOGOUT</button>
        </div>
      )}

      <div className="max-w-4xl mx-auto py-10 px-4 md:px-6">
        <h1 className="text-3xl md:text-5xl font-black text-[#1a1a1a] text-center mb-2 uppercase italic tracking-tighter">
          Valitse <span className="text-[#006d67]">Palvelu</span>
        </h1>
        <p className="text-center text-slate-500 font-bold mb-10 uppercase text-[9px] tracking-widest leading-tight px-4">
          Lue ehdot huolellisesti ennen tilausta
        </p>
        
        {/* Service Selection */}
        <div className="space-y-4 mb-10">
          {/* Service 1 */}
          <div 
            onClick={() => setServiceType('resepti')} 
            className={`border-2 p-5 transition-all cursor-pointer flex justify-between items-center gap-4 ${serviceType === 'resepti' ? 'border-[#006d67] bg-[#f0f9f8]' : 'border-gray-100 bg-white'}`}
          >
            <div className="flex items-center gap-4">
              <div className={`p-3 ${serviceType === 'resepti' ? 'bg-[#006d67] text-white' : 'bg-gray-100 text-gray-400'}`}>
                <Pill size={24} />
              </div>
              <div>
                <h3 className="text-lg font-black uppercase italic text-gray-900 leading-none">Resepti</h3>
                <p className="text-[10px] font-bold text-gray-500 mt-1 italic">Vain jatkoreseptit</p>
              </div>
            </div>
            <div className="text-2xl font-black italic text-[#006d67]">10€</div>
          </div>

          {/* Service 2 */}
          <div 
            onClick={() => setServiceType('vastaanotto')} 
            className={`border-2 p-5 transition-all cursor-pointer flex justify-between items-center gap-4 ${serviceType === 'vastaanotto' ? 'border-[#0055aa] bg-[#f0f5fa]' : 'border-gray-100 bg-white'}`}
          >
            <div className="flex items-center gap-4">
              <div className={`p-3 ${serviceType === 'vastaanotto' ? 'bg-[#0055aa] text-white' : 'bg-gray-100 text-gray-400'}`}>
                <Stethoscope size={24} />
              </div>
              <div>
                <h3 className="text-lg font-black uppercase italic text-gray-900 leading-none">Vastaanotto</h3>
                <p className="text-[10px] font-bold text-gray-500 mt-1 italic">Lääkärin neuvonta</p>
              </div>
            </div>
            <div className="text-2xl font-black italic text-[#0055aa]">43€</div>
          </div>
        </div>

        {/* FORM SECTION */}
        {serviceType && (
          <form onSubmit={handleSubmit} className="border-t-4 border-[#1a1a1a] bg-gray-50 p-5 md:p-10 space-y-8 animate-in fade-in slide-in-from-bottom-2">
            
            {/* Warning Box */}
            <div className="bg-red-50 border-l-4 border-red-600 p-4 flex gap-3">
              <AlertTriangle className="text-red-600 shrink-0" size={20} />
              <div>
                <h4 className="text-red-600 font-black uppercase italic text-[10px] mb-1">Vastuuvapaus</h4>
                <p className="text-[11px] font-bold text-red-900 leading-tight italic">
                  Tärkeä huomautus (Vastuuvapaus)
Valitsemalla tämän palvelun vahvistat, että olet lukenut ehdot. Väärin valitusta palvelusta (esim. uusi resepti jatkoreseptin sijaan) maksua ei palauteta. Asiakas on itse vastuussa oikean palvelun valinnasta. <span className="underline">maksua ei palauteta</span>.
                </p>
              </div>
            </div>

            {/* Upsell for Resepti */}
            {serviceType === 'resepti' && (
              <div className="bg-blue-50 border-l-4 border-blue-600 p-4 flex justify-between items-center gap-2">
                <p className="text-[10px] font-bold text-blue-900 italic leading-tight">Tarvitsetko lääkärin arvion? Vaihda 43€ palveluun.</p>
                <button type="button" onClick={() => setServiceType('vastaanotto')} className="text-[9px] font-black uppercase border-b border-blue-600 text-blue-600 shrink-0">Vaihda →</button>
              </div>
            )}

            {/* Inputs - Yaraynta Farta iyo Buuxinta */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input required placeholder="ETUNIMI" className="w-full p-4 bg-white border border-gray-200 focus:border-[#006d67] outline-none font-bold text-sm" onChange={e => setFormData({...formData, etunimi: e.target.value})} />
              <input required placeholder="SUKUNIMI" className="w-full p-4 bg-white border border-gray-200 focus:border-[#006d67] outline-none font-bold text-sm" onChange={e => setFormData({...formData, sukunimi: e.target.value})} />
            </div>

            <input required type="tel" placeholder="PUHELINNUMERO" className="w-full p-4 bg-white border border-gray-200 focus:border-[#006d67] outline-none font-bold text-sm" onChange={e => setFormData({...formData, puh: e.target.value})} />
            
            <textarea maxLength={300} placeholder="KERRO LYHYESTI ASIASI..." className="w-full p-4 bg-white border border-gray-200 focus:border-[#006d67] outline-none font-bold text-sm h-24 resize-none" onChange={e => setFormData({...formData, viesti: e.target.value})}></textarea>

            {/* Scheduling for Vastaanotto */}
            {serviceType === 'vastaanotto' && (
              <div className="p-4 bg-white border border-blue-100 space-y-4">
                <label className="text-[10px] font-black uppercase text-blue-600">Valitse päivä ja aika</label>
                <input required type="date" className="w-full p-3 border border-gray-100 font-bold text-sm" onChange={e => setFormData({...formData, paiva: e.target.value})} />
                <div className="grid grid-cols-2 gap-2">
                  {['17:00', '18:00', '19:00', '20:00'].map(t => (
                    <button key={t} type="button" onClick={() => setFormData({...formData, aika: t})} className={`p-3 text-xs font-black border ${formData.aika === t ? 'bg-[#0055aa] text-white' : 'bg-gray-50 text-gray-300'}`}>{t}</button>
                  ))}
                </div>
              </div>
            )}

            {/* Final Button - Sidan ayaa looga hortagayaa Scrolling-ka dhinaca ah */}
            <div className="pt-4">
              <button type="submit" disabled={orderLoading} className="w-full bg-[#1a1a1a] text-white py-5 font-black text-lg hover:bg-[#006d67] transition-all flex items-center justify-center gap-3 uppercase italic tracking-widest">
                {orderLoading ? <Loader2 className="animate-spin" size={20} /> : "MAKSA NYT →"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}