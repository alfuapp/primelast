'use client';

import React, { useEffect, useState } from 'react';
import { db, auth } from '../lib/firebase';
import { collection, query, orderBy, onSnapshot, updateDoc, doc } from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  CheckCircle, 
  Clock, 
  Search, 
  Loader2, 
  LogOut, 
  XCircle,
  Menu,
  X
} from 'lucide-react';

export default function AdminDashboard() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  // 1. Hubinta Admin-ka
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // 🛑 HUBI EMAIL-KAAGA INUU SAX YAHAY
      if (user && user.email === "primecare1974@gmail.com") {
        setIsAdmin(true);
      } else {
        router.push('/login');
      }
    });
    return () => unsubscribe();
  }, [router]);

  // 2. Soo qaadashada Xogta
  useEffect(() => {
    if (!isAdmin) return;
    const q = query(collection(db, "tilaukset"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const ordersData: any[] = [];
      querySnapshot.forEach((doc) => {
        ordersData.push({ id: doc.id, ...doc.data() });
      });
      setOrders(ordersData);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [isAdmin]);

  const markAsDone = async (id: string) => {
    try {
      const orderRef = doc(db, "tilaukset", id);
      await updateDoc(orderRef, { status: 'completed' });
    } catch (e) { console.error(e); }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f4f6fb]">
        <Loader2 className="animate-spin text-[#006d67] mb-4" size={48} />
        <p className="font-black text-[#006d67] uppercase italic animate-pulse">Varmistetaan ylläpitäjää...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f6fb] flex font-[Poppins] relative">
      
      {/* MOBILE MENU BUTTON */}
      <button 
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed bottom-6 right-6 z-50 bg-[#006d67] text-white p-4 rounded-full shadow-2xl"
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* SIDEBAR */}
      <div className={`
        fixed inset-y-0 left-0 z-40 w-72 bg-[#006d67] p-8 text-white transition-transform duration-300 lg:relative lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <h2 className="text-3xl font-black italic tracking-tighter mb-12 uppercase leading-none">
          PRIMECARE<br/><span className="text-[10px] tracking-widest opacity-50 not-italic">Admin panel</span>
        </h2>
        <nav className="flex-1 space-y-4">
           <div className="flex items-center gap-3 bg-white/10 p-4 rounded-2xl font-black uppercase italic text-xs tracking-widest shadow-inner cursor-default">
             <LayoutDashboard size={18}/> Dashboard
           </div>
           <div 
             onClick={() => router.push('/services')}
             className="flex items-center gap-3 p-4 opacity-60 hover:opacity-100 cursor-pointer font-black uppercase italic text-xs tracking-widest transition-all"
           >
             <CheckCircle size={18}/> Palvelut sivu
           </div>
        </nav>
        <button 
          onClick={() => signOut(auth)} 
          className="flex items-center gap-3 p-4 mt-auto bg-red-500/10 text-red-400 rounded-2xl font-black uppercase italic text-xs tracking-widest hover:bg-red-500 hover:text-white transition-all"
        >
          <LogOut size={18}/> Kirjaudu ulos
        </button>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 p-4 md:p-12 overflow-hidden">
        <header className="flex flex-col md:flex-row justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black text-gray-900 uppercase italic tracking-tighter leading-none">Tilaukset</h1>
            <p className="text-gray-400 font-bold text-sm italic">Hallinnoi saapuneita palvelupyyntöjä</p>
          </div>
          <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-3 w-full md:w-80">
            <Search size={20} className="text-gray-300"/>
            <input placeholder="Etsi..." className="outline-none text-sm font-bold w-full bg-transparent"/>
          </div>
        </header>

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
            <p className="text-[10px] font-black uppercase text-gray-400 mb-1 tracking-widest leading-none">Yhteensä</p>
            <p className="text-3xl font-black text-[#006d67] italic leading-none">{orders.length}</p>
          </div>
          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
            <p className="text-[10px] font-black uppercase text-gray-400 mb-1 tracking-widest leading-none">Odottaa</p>
            <p className="text-3xl font-black text-orange-500 italic leading-none">{orders.filter(o => o.status !== 'completed').length}</p>
          </div>
          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
            <p className="text-[10px] font-black uppercase text-gray-400 mb-1 tracking-widest leading-none">Valmiit</p>
            <p className="text-3xl font-black text-green-500 italic leading-none">{orders.filter(o => o.status === 'completed').length}</p>
          </div>
        </div>

        {/* TABLE CARD - Tani waa xalkii mobaylka */}
        <div className="bg-white rounded-[3rem] shadow-2xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[1000px]">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="p-8 text-[10px] font-black uppercase tracking-widest text-gray-400 italic">Asiakas</th>
                  <th className="p-8 text-[10px] font-black uppercase tracking-widest text-gray-400 italic">Palvelu</th>
                  <th className="p-8 text-[10px] font-black uppercase tracking-widest text-gray-400 italic">Maksu</th>
                  <th className="p-8 text-[10px] font-black uppercase tracking-widest text-gray-400 italic">Viesti</th>
                  <th className="p-8 text-[10px] font-black uppercase tracking-widest text-gray-400 italic text-right">Toiminto</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/50 transition-all">
                    <td className="p-8">
                      <p className="font-black text-gray-900 uppercase italic text-lg leading-none mb-1 whitespace-nowrap">
                        {order.etunimi} {order.sukunimi}
                      </p>
                      <p className="text-[11px] font-bold text-gray-400 tracking-tight">{order.email}</p>
                    </td>
                    <td className="p-8">
                      <span className="bg-[#f4f6fb] text-[#006d67] px-4 py-2 rounded-xl text-[10px] font-black uppercase italic whitespace-nowrap">
                        {order.palvelu} ({order.hinta}€)
                      </span>
                    </td>
                    <td className="p-8">
                      {order.paymentStatus === 'paid' ? (
                        <span className="bg-green-100 text-green-700 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase italic flex items-center gap-1 w-fit whitespace-nowrap border border-green-200 shadow-sm">
                          <CheckCircle size={12}/> MAKSETTU
                        </span>
                      ) : (
                        <span className="bg-red-50 text-red-400 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase italic flex items-center gap-1 w-fit whitespace-nowrap border border-red-100">
                          <XCircle size={12}/> EI MAKSETTU
                        </span>
                      )}
                    </td>
                    <td className="p-8">
                      <p className="text-[11px] font-bold text-gray-500 italic max-w-[250px] break-words bg-gray-50 p-4 rounded-2xl border border-gray-100">
                        {order.viesti || "Ei viestiä"}
                      </p>
                    </td>
                    <td className="p-8 text-right">
                      {order.status === 'completed' ? (
                        <span className="text-green-500 flex items-center justify-end gap-1 text-[10px] font-black uppercase italic whitespace-nowrap leading-none">
                          <CheckCircle size={14}/> Valmis
                        </span>
                      ) : (
                        <button 
                          onClick={() => markAsDone(order.id)} 
                          className="bg-[#006d67] text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase italic shadow-lg hover:scale-105 active:scale-95 transition-all whitespace-nowrap"
                        >
                          Merkitse valmiiksi
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {orders.length === 0 && !loading && (
            <div className="p-24 text-center">
              <p className="text-gray-300 font-black uppercase italic tracking-[0.2em]">Ei saapuneita tilauksia...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}