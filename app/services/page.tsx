'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { db, auth } from '../lib/firebase';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import { collection, query, where, onSnapshot } from 'firebase/firestore'; 
import { 
  LogOut, 
  Loader2, 
  Pill, 
  Stethoscope, 
  Video, 
  Phone, 
  AlertTriangle, 
  ArrowRight,
  ChevronLeft 
} from 'lucide-react';

export default function ServicesPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [orderLoading, setOrderLoading] = useState(false);
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
    if ((serviceType === 'vastaanotto' || serviceType === 'video') && (!formData.paiva || !formData.aika)) {
      return alert("Ole hyvä ja valitse päivä ja aika.");
    }
    
    setOrderLoading(true);
    try {
      const orderId = `PRC-${Math.floor(100000 + Math.random() * 900000)}`;
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
          orderId, amount: clientPrice, totalAmount, kelaShare,
          email: user?.email, etunimi: formData.etunimi, sukunimi: formData.sukunimi,
          puh: formData.puh, viesti: formData.viesti, palvelu: serviceType,
          paiva: formData.paiva, aika: formData.aika, hinta: clientPrice
        })
      });

      const data = await res.json();
      if (data.href) {
        window.location.href = data.href;
      } else {
        throw new Error("Maksulinkkiä ei saatu.");
      }
    } catch (e) {
      alert("Virhe maksun aloittamisessa.");
      setOrderLoading(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-white font-black text-[#006d67] animate-pulse italic text-xl uppercase tracking-tighter">PrimeCare...</div>;

  return (
    <div className="bg-white min-h-screen font-[Poppins] overflow-x-hidden text-slate-900">
      
      {user && (
        <div className="bg-[#004d40] py-2 px-4 flex justify-between items-center text-white sticky top-0 z-50 shadow-md">
          <span className="text-[10px] font-bold truncate max-w-[180px]">{user.email}</span>
          <button onClick={handleLogout} className="text-[9px] font-black uppercase border border-white/20 px-2 py-1 hover:bg-red-600 transition-all">LOGOUT</button>
        </div>
      )}

      <div className="max-w-4xl mx-auto py-10 px-4">
        
        {/* ⭐ QAYBTA 1: Tus kaliya haddii aan adeeg la dooran */}
        {!serviceType && (
          <div className="animate-in fade-in duration-500">
            <h1 className="text-3xl md:text-5xl font-black text-[#1a1a1a] text-center mb-10 uppercase italic tracking-tighter leading-none">
              Valitse <span className="text-[#006d67]">Palvelu</span>
            </h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
              <div onClick={() => setServiceType('resepti')} className="p-6 cursor-pointer flex justify-between items-center bg-[#006d67] border-4 border-[#006d67] shadow-lg hover:scale-[1.02] transition-all text-white">
                <div className="flex items-center gap-4">
                  <Pill size={28} />
                  <div>
                    <h3 className="text-lg font-black uppercase italic leading-none text-white">Resepti</h3>
                    <p className="text-[10px] font-bold mt-1 uppercase opacity-80">10€ • Uusinta</p>
                  </div>
                </div>
                <ArrowRight size={20} />
              </div>

              

              <div onClick={() => setServiceType('video')} className="p-6 cursor-pointer flex justify-between items-center bg-[#0055aa] border-4 border-[#0055aa] shadow-lg hover:scale-[1.02] transition-all text-white">
                <div className="flex items-center gap-4">
                  <Video size={28} />
                  <div>
                    <h3 className="text-lg font-black uppercase italic leading-none text-white">Video Vastaanotto</h3>
                    <p className="text-[10px] font-bold mt-1 uppercase opacity-900">
  15€ <span className="opacity-80">(norm. 40€ - Kela-korvaus 25€)</span>
</p>
                  </div>
                </div>
                <ArrowRight size={20} />
              </div>

              <div onClick={() => setServiceType('chat')} className="p-6 cursor-pointer flex justify-between items-center bg-[#800080] border-4 border-[#800080] shadow-lg hover:scale-[1.02] transition-all text-white">
                <div className="flex items-center gap-4">
                  <Phone size={28} />
                  <div>
                    <h3 className="text-lg font-black uppercase italic leading-none text-white">Chat/Puh</h3>
                    <p className="text-[10px] font-bold mt-1 uppercase opacity-900">12€ <span className="opacity-80">(norm. 20€ - Kela-korvaus 8€)</span></p>
                  </div>
                </div>
                <ArrowRight size={20} />
              </div>
            </div>
          </div>
        )}

        {/* ⭐ QAYBTA 2: Foomka oo kor u soo baxaya (Qarinaya adeegyada kale) */}
        {serviceType && (
          <div className="animate-in fade-in slide-in-from-bottom-6 duration-500">
            {/* Badhanka Takaisin (Back) */}
            <button 
              onClick={() => setServiceType(null)} 
              className="flex items-center gap-2 mb-6 text-[#006d67] font-black uppercase text-xs hover:bg-green-50 px-4 py-2 rounded-full border border-green-200 transition-all"
            >
              <ChevronLeft size={16} /> Takaisin palveluihin
            </button>

            <form onSubmit={handleSubmit} className="bg-gray-50 p-6 md:p-10 space-y-6 shadow-2xl rounded-[2rem] border border-gray-100">
              <div className="text-center mb-6">
                 <h2 className="text-2xl font-black text-[#006d67] uppercase italic tracking-tighter">
                   {serviceType === 'resepti' ? 'Reseptin uusinta' : 
                    serviceType === 'vastaanotto' ? 'Lääkärin neuvonta' : 
                    serviceType === 'video' ? 'Videovastaanotto' : 'Chat & Puhelin'}
                 </h2>
                 <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-2 italic">Täytä tiedot jatkaaksesi maksuun</p>
              </div>

              <div className="bg-red-50 border-l-4 border-red-600 p-4 flex gap-4 italic text-[11px] font-bold text-red-900 leading-tight">
                <AlertTriangle className="text-red-600 shrink-0" size={20} />
                Huom! Väärin valitusta palvelusta maksua ei palauteta.
                Varmista puhelinnumero: Jos emme tavoita sinua tai numero on väärä, maksua ei palauteta.
                  <p>Ole paikalla ajoissa: Peruuttamattomista tai myöhästyneistä ajoista maksua ei palauteta
                    <p>Emme uusi PKV-lääkkeitä (unilääkkeet, vahvat kipulääkkeet tai huumausaineet)
                  
                  
                  
                  </p>
                  </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input required placeholder="ETUNIMI" className="p-4 border border-gray-200 outline-none font-bold text-sm uppercase focus:border-[#006d67] bg-white rounded-xl" onChange={e => setFormData({...formData, etunimi: e.target.value})} />
                <input required placeholder="SUKUNIMI" className="p-4 border border-gray-200 outline-none font-bold text-sm uppercase focus:border-[#006d67] bg-white rounded-xl" onChange={e => setFormData({...formData, sukunimi: e.target.value})} />
              </div>

              <input required type="tel" placeholder="PUHELINNUMERO" className="w-full p-4 border border-gray-200 outline-none font-bold text-sm focus:border-[#006d67] bg-white rounded-xl" onChange={e => setFormData({...formData, puh: e.target.value})} />
              <textarea placeholder="ASIA TAI LÄÄKITYS..." className="w-full p-4 border border-gray-200 outline-none font-bold text-sm h-24 resize-none focus:border-[#006d67] bg-white rounded-xl" onChange={e => setFormData({...formData, viesti: e.target.value})}></textarea>

              {(serviceType === 'vastaanotto' || serviceType === 'video') && (
                <div className="p-6 bg-white border border-gray-200 space-y-4 rounded-xl shadow-sm">
                  <label className="text-[10px] font-black uppercase text-[#0055aa] tracking-widest block mb-2">Valitse päivä ja aika</label>
                  <input required type="date" className="w-full p-3 border border-gray-100 font-bold text-sm outline-none mb-4" onChange={e => setFormData({...formData, paiva: e.target.value})} />
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                    {['17:00','17:20','17:40','18:00','18:20','18:40','19:00','19:20','19:40','20:00'].map(t => {
                      const isBooked = bookedTimes.includes(t);
                      return (
                        <button key={t} type="button" disabled={isBooked} onClick={() => setFormData({...formData, aika: t})} className={`py-3 text-[11px] font-black border-2 rounded-lg transition-all ${isBooked ? 'bg-red-50 text-red-200 border-red-100 cursor-not-allowed' : formData.aika === t ? 'bg-black text-white border-black' : 'bg-white text-gray-400 border-green-500 hover:bg-green-50'}`}>
                          {isBooked ? 'VARATTU' : t}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <button type="submit" disabled={orderLoading} className="w-full bg-[#006d67] text-white py-6 rounded-xl font-black text-xl transition-all uppercase italic tracking-[0.2em] shadow-xl hover:bg-black active:scale-95">
                {orderLoading ? <Loader2 className="animate-spin mx-auto" size={28} /> : `MAKSA NYT →`}
              </button>
            </form>
          </div>
        )}
      </div>

      <footer className="py-10 text-center opacity-30 text-[9px] font-black uppercase italic tracking-[0.4em]">
        PrimeCare Finland - Online Health Services
      </footer>
    </div>
  );
}