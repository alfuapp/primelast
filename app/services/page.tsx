'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { db, auth } from '../lib/firebase';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import { collection, query, where, onSnapshot } from 'firebase/firestore'; 
import { LogOut, Loader2, Pill, Stethoscope, Video, Phone, AlertTriangle, ArrowRight } from 'lucide-react';

export default function ServicesPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [orderLoading, setOrderLoading] = useState(false);
  // Noocyada adeegga oo la kordhiyey
  const [serviceType, setServiceType] = useState<'resepti' | 'vastaanotto' | 'video' | 'chat' | null>(null);
  const [bookedTimes, setBookedTimes] = useState<string[]>([]); 
  const [formData, setFormData] = useState({ 
    etunimi: '', sukunimi: '', puh: '', viesti: '', paiva: '', aika: '' 
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.replace('/login');
      } else {
        setUser(currentUser);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [router]);

  // Jadwalka ballamaha (Vastaanotto iyo Video waxay isticmaalayaan jadwalka)
  useEffect(() => {
    if (formData.paiva && (serviceType === 'vastaanotto' || serviceType === 'video')) {
      const q = query(
        collection(db, "tilaukset"),
        where("paiva", "==", formData.paiva),
        where("paymentStatus", "==", "paid")
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const times = snapshot.docs.map(doc => doc.data().aika);
        setBookedTimes(times);
      });
      return () => unsubscribe();
    }
  }, [formData.paiva, serviceType]);

  const handleLogout = async () => {
    await signOut(auth);
    window.location.href = '/login';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Hubinta jadwalka
    if ((serviceType === 'vastaanotto' || serviceType === 'video') && (!formData.paiva || !formData.aika)) {
      return alert("Ole hyvä ja valitse päivä ja aika.");
    }
    
    setOrderLoading(true);
    try {
      const orderId = `PRC-${Math.floor(100000 + Math.random() * 900000)}`;
      
      // Xisaabta rasmiga ah ee Kela
      let clientPrice = 10;
      let kelaShare = 0;
      let totalAmount = 10;

      if (serviceType === 'vastaanotto') {
        clientPrice = 20; kelaShare = 23; totalAmount = 43;
      } else if (serviceType === 'video') {
        clientPrice = 15; kelaShare = 25; totalAmount = 40;
      } else if (serviceType === 'chat') {
        clientPrice = 12; kelaShare = 8; totalAmount = 20;
      }

      const res = await fetch('/api/paytrail/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          amount: clientPrice,
          totalAmount: totalAmount,
          kelaShare: kelaShare,
          email: user?.email,
          etunimi: formData.etunimi,
          sukunimi: formData.sukunimi,
          puh: formData.puh,
          viesti: formData.viesti,
          palvelu: serviceType,
          paiva: formData.paiva,
          aika: formData.aika,
          hinta: clientPrice
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
      alert("Virhe maksun aloittamisessa.");
      setOrderLoading(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-white font-black text-[#006d67] animate-pulse italic text-xl">PRIMECARE...</div>;

  return (
    <div className="bg-white min-h-screen font-[Poppins] overflow-x-hidden text-slate-900">
      
      {user && (
        <div className="bg-[#004d40] py-2 px-4 flex justify-between items-center text-white sticky top-0 z-50 shadow-md">
          <span className="text-[10px] font-bold truncate max-w-[180px]">{user.email}</span>
          <button onClick={handleLogout} className="text-[9px] font-black uppercase border border-white/20 px-2 py-1 hover:bg-red-600 transition-all">LOGOUT</button>
        </div>
      )}

      <div className="max-w-4xl mx-auto py-10 px-4">
        <h1 className="text-3xl md:text-5xl font-black text-[#1a1a1a] text-center mb-10 uppercase italic tracking-tighter leading-none">
          Valitse <span className="text-[#006d67]">Palvelu</span>
        </h1>
        
        {/* Grid-ka 4-ta Adeeg */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          {/* Resepti */}
          <div onClick={() => setServiceType('resepti')} className={`p-6 cursor-pointer flex justify-between items-center transition-all border-4 ${serviceType === 'resepti' ? 'bg-black border-black scale-[1.02]' : 'bg-[#006d67] border-[#006d67] shadow-lg'}`}>
            <div className="flex items-center gap-4 text-white">
              <Pill size={28} />
              <div>
                <h3 className="text-lg font-black uppercase italic leading-none">Resepti</h3>
                <p className="text-[10px] font-bold mt-1 uppercase opacity-80">10€ • Uusinta</p>
              </div>
            </div>
            <ArrowRight size={20} className="text-white" />
          </div>

          {/* Vastaanotto */}
          <div onClick={() => setServiceType('vastaanotto')} className={`p-6 cursor-pointer flex justify-between items-center transition-all border-4 ${serviceType === 'vastaanotto' ? 'bg-black border-black scale-[1.02]' : 'bg-[#0055aa] border-[#0055aa] shadow-lg'}`}>
            <div className="flex items-center gap-4 text-white">
              <Stethoscope size={28} />
              <div>
                <h3 className="text-lg font-black uppercase italic leading-none">Vastaanotto</h3>
                <p className="text-[10px] font-bold mt-1 uppercase opacity-80">20€ <span className="opacity-50">(43€)</span></p>
              </div>
            </div>
            <ArrowRight size={20} className="text-white" />
          </div>

          {/* Video */}
          <div onClick={() => setServiceType('video')} className={`p-6 cursor-pointer flex justify-between items-center transition-all border-4 ${serviceType === 'video' ? 'bg-black border-black scale-[1.02]' : 'bg-[#e67e22] border-[#e67e22] shadow-lg'}`}>
            <div className="flex items-center gap-4 text-white">
              <Video size={28} />
              <div>
                <h3 className="text-lg font-black uppercase italic leading-none">Video</h3>
                <p className="text-[10px] font-bold mt-1 uppercase opacity-80">15€ <span className="opacity-50">(40€)</span></p>
              </div>
            </div>
            <ArrowRight size={20} className="text-white" />
          </div>

          {/* Chat/Puhelin */}
          <div onClick={() => setServiceType('chat')} className={`p-6 cursor-pointer flex justify-between items-center transition-all border-4 ${serviceType === 'chat' ? 'bg-black border-black scale-[1.02]' : 'bg-[#2980b9] border-[#2980b9] shadow-lg'}`}>
            <div className="flex items-center gap-4 text-white">
              <Phone size={28} />
              <div>
                <h3 className="text-lg font-black uppercase italic leading-none">Chat/Puh</h3>
                <p className="text-[10px] font-bold mt-1 uppercase opacity-80">12€ <span className="opacity-50">(20€)</span></p>
              </div>
            </div>
            <ArrowRight size={20} className="text-white" />
          </div>
        </div>

        {serviceType && (
          <form onSubmit={handleSubmit} className="mt-8 bg-gray-50 p-6 space-y-6 shadow-sm border border-gray-100">
            <div className="bg-red-50 border-l-4 border-red-600 p-4 flex gap-3 italic text-[11px] font-bold text-red-900 leading-tight">
              <AlertTriangle className="text-red-600 shrink-0" size={20} />
              Huom! Väärin valitusta palvelusta maksua ei palauteta.
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input required placeholder="ETUNIMI" className="p-4 border border-gray-200 outline-none font-bold text-sm uppercase focus:border-[#006d67]" onChange={e => setFormData({...formData, etunimi: e.target.value})} />
              <input required placeholder="SUKUNIMI" className="p-4 border border-gray-200 outline-none font-bold text-sm uppercase focus:border-[#006d67]" onChange={e => setFormData({...formData, sukunimi: e.target.value})} />
            </div>

            <input required type="tel" placeholder="PUHELINNUMERO" className="w-full p-4 border border-gray-200 outline-none font-bold text-sm focus:border-[#006d67]" onChange={e => setFormData({...formData, puh: e.target.value})} />
            <textarea placeholder="ASIA TAI LÄÄKITYS..." className="w-full p-4 border border-gray-200 outline-none font-bold text-sm h-24 resize-none focus:border-[#006d67]" onChange={e => setFormData({...formData, viesti: e.target.value})}></textarea>

            {(serviceType === 'vastaanotto' || serviceType === 'video') && (
              <div className="p-4 bg-white border border-gray-200 space-y-4">
                <label className="text-[10px] font-black uppercase text-[#0055aa] tracking-widest">Valitse päivä ja aika</label>
                <input required type="date" className="w-full p-3 border border-gray-100 font-bold text-sm outline-none" onChange={e => setFormData({...formData, paiva: e.target.value})} />
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {['17:00','17:20','17:40','18:00','18:20','18:40','19:00','19:20','19:40','20:00'].map(t => {
                    const isBooked = bookedTimes.includes(t);
                    return (
                      <button key={t} type="button" disabled={isBooked} onClick={() => setFormData({...formData, aika: t})} className={`py-2 text-[11px] font-black border-2 transition-all ${isBooked ? 'bg-red-50 text-red-200 border-red-100 cursor-not-allowed' : formData.aika === t ? 'bg-black text-white border-black' : 'bg-white text-gray-400 border-green-500 hover:bg-green-50'}`}>
                        {isBooked ? 'VARATTU' : t}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <button type="submit" disabled={orderLoading} className="w-full bg-[#006d67] text-white py-5 font-black text-lg transition-all uppercase italic tracking-[0.2em] shadow-lg hover:bg-black">
              {orderLoading ? <Loader2 className="animate-spin mx-auto" size={24} /> : `MAKSA NYT →`}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}