'use client';

import React, { useEffect, useState } from 'react';
import { db, auth } from '../lib/firebase';
import { collection, query, orderBy, onSnapshot, updateDoc, doc } from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { Phone, MessageSquare, LogOut, ShieldCheck, User, CheckCircle } from 'lucide-react';

export default function AdminDashboard() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.email === "primecare1974@gmail.com") {
        setIsAuthorized(true);
      } else {
        router.replace('/login');
      }
    });
    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    if (!isAuthorized) return;

    // Waxaan akhrinaynaa dhallaan dalabaadka si ay xogtu u soo baxdo
    const q = query(
      collection(db, "tilaukset"), 
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setOrders(ordersData);
      setLoading(false);
    }, (error) => {
      console.error("Firebase Error:", error.message);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isAuthorized]);

  const markAsDone = async (id: string) => {
    try {
      await updateDoc(doc(db, "tilaukset", id), { status: 'completed' });
    } catch (e) { console.error(e); }
  };

  if (loading) return <div className="h-screen flex items-center justify-center bg-[#111827] text-white font-black italic uppercase animate-pulse">PRIMECARE ADMIN...</div>;

  return (
    <div className="min-h-screen bg-[#111827] text-white font-[Poppins] p-4 md:p-12">
      <div className="max-w-7xl mx-auto flex justify-between items-center bg-[#1f2937] p-8 rounded-[2.5rem] mb-12 border border-white/10 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="bg-[#E63946] p-4 rounded-3xl shadow-lg shadow-[#E63946]/20">
            <ShieldCheck size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-black uppercase italic tracking-tighter leading-none">Hallintapaneeli</h1>
            <p className="text-[10px] font-bold text-gray-500 mt-1 uppercase tracking-widest italic">PrimeCare Management</p>
          </div>
        </div>
        <button onClick={() => signOut(auth)} className="bg-white/5 hover:bg-[#E63946] p-5 rounded-3xl transition-all border border-white/10">
          <LogOut size={24} />
        </button>
      </div>

      <div className="max-w-7xl mx-auto space-y-6">
        {orders.length > 0 ? orders.map((order) => (
          <div key={order.id} className={`bg-[#1f2937] p-8 rounded-[3rem] border-2 transition-all flex flex-col md:flex-row justify-between gap-8 ${order.status === 'completed' ? 'border-green-500/20 opacity-60' : 'border-white/5 hover:border-[#006d67]/50'}`}>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-[#006d67] p-2 rounded-lg text-white"><User size={16}/></div>
                {/* ⭐ Halkan ayaan ku saxnay si magaca dhabta ah u soo baxo */}
                <h2 className="text-xl font-black uppercase italic tracking-tighter">
                  {order.etunimi || "Asiakas"} {order.sukunimi || ""}
                </h2>
              </div>
              {/* ⭐ Halkan iimaylka dhabta ah ayaa soo bixi doona */}
              <p className="text-xs font-bold text-gray-400 lowercase mb-4 pl-11">
                {order.email || "ei sähköpostia"}
              </p>
              <div className="flex items-center text-[#006d67] font-black italic text-sm bg-[#006d67]/10 w-fit px-4 py-2 rounded-xl ml-11">
                <Phone size={14} className="mr-2" /> {order.puh || 'Ei numeroa'}
              </div>
            </div>

            <div className="flex-1 bg-black/20 p-6 rounded-[2rem] border border-white/5">
              <div className="flex items-center gap-2 mb-3">
                <MessageSquare size={16} className="text-[#006d67]" />
                <span className="text-[10px] font-black uppercase italic text-[#006d67]">Viesti</span>
              </div>
              <p className="text-xs font-bold text-gray-300 uppercase italic leading-relaxed line-clamp-4">{order.viesti || 'Ei viestiä'}</p>
            </div>

            <div className="flex flex-col items-end justify-center gap-4">
              <span className="bg-green-500/10 text-green-500 border border-green-500/20 px-8 py-3 rounded-2xl font-black italic uppercase text-xs">
                Maksettu {order.hinta}€
              </span>
              {order.status === 'completed' ? (
                <span className="flex items-center gap-2 text-green-500 font-black italic uppercase text-[10px] bg-green-500/5 px-4 py-2 rounded-full border border-green-500/10">
                  <CheckCircle size={14} /> Valmis
                </span>
              ) : (
                <button 
                  onClick={() => markAsDone(order.id)}
                  className="bg-[#006d67] hover:bg-white hover:text-[#006d67] text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase italic transition-all shadow-lg"
                >
                  Merkitse valmiiksi
                </button>
              )}
            </div>
          </div>
        )) : (
          <div className="text-center p-24 bg-[#1f2937] rounded-[4rem] border-4 border-dashed border-white/5">
            <p className="text-2xl font-black text-white/10 uppercase italic tracking-widest">Ei vahvistettuja maksuja</p>
          </div>
        )}
      </div>
    </div>
  );
}