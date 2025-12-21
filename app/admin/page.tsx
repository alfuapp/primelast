'use client';

import React, { useEffect, useState } from 'react';
import { db, auth } from '../lib/firebase';
import { collection, query, orderBy, onSnapshot, updateDoc, doc } from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { LayoutDashboard, CheckCircle, Clock, Search, Loader2, LogOut, XCircle } from 'lucide-react';

export default function AdminDashboard() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.email === "primecare1974@gmail.com") {
        setIsAdmin(true);
      } else {
        router.push('/login');
      }
    });
    return () => unsubscribe();
  }, [router]);

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

  if (!isAdmin) return <div className="min-h-screen flex items-center justify-center font-black text-[#006d67] animate-pulse italic text-2xl">YLLÄPITÄJÄÄ VARMISTETAAN...</div>;

  return (
    <div className="min-h-screen bg-[#f4f6fb] flex font-[Poppins]">
      <div className="w-72 bg-[#006d67] p-8 text-white hidden lg:flex flex-col">
        <h2 className="text-3xl font-black italic tracking-tighter mb-12 uppercase leading-none">PRIMECARE<br/><span className="text-[10px] tracking-widest opacity-50 not-italic">Admin panel</span></h2>
        <nav className="flex-1 space-y-4">
           <div className="flex items-center gap-3 bg-white/10 p-4 rounded-2xl font-black uppercase italic text-xs tracking-widest shadow-inner"><LayoutDashboard size={18}/> Dashboard</div>
        </nav>
        <button onClick={() => signOut(auth)} className="flex items-center gap-3 p-4 bg-red-500/10 text-red-400 rounded-2xl font-black uppercase italic text-xs tracking-widest"><LogOut size={18}/> Kirjaudu ulos</button>
      </div>

      <div className="flex-1 p-6 lg:p-12 overflow-x-auto">
        <header className="flex flex-col md:flex-row justify-between gap-6 mb-12">
          <h1 className="text-4xl font-black text-gray-900 uppercase italic tracking-tighter leading-none">Tilaukset</h1>
          <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-3 w-full md:w-80">
            <Search size={20} className="text-gray-300"/><input placeholder="Etsi..." className="outline-none text-sm font-bold w-full bg-transparent"/>
          </div>
        </header>

        <div className="bg-white rounded-[3rem] shadow-2xl border border-gray-100 overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="p-8 text-[10px] font-black uppercase tracking-widest text-gray-400 italic">Asiakas</th>
                <th className="p-8 text-[10px] font-black uppercase tracking-widest text-gray-400 italic">Palvelu</th>
                <th className="p-8 text-[10px] font-black uppercase tracking-widest text-gray-400 italic">Maksu</th>
                <th className="p-8 text-[10px] font-black uppercase tracking-widest text-gray-400 italic">Viesti</th>
                <th className="p-8 text-[10px] font-black uppercase tracking-widest text-gray-400 italic">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50/50 transition-all">
                  <td className="p-8">
                    <p className="font-black text-gray-900 uppercase italic text-lg leading-none mb-1">{order.etunimi} {order.sukunimi}</p>
                    <p className="text-[11px] font-bold text-gray-400 tracking-tight">{order.email}</p>
                  </td>
                  <td className="p-8">
                    <span className="bg-[#f4f6fb] text-[#006d67] px-4 py-2 rounded-xl text-[10px] font-black uppercase italic">{order.palvelu} ({order.hinta}€)</span>
                  </td>
                  <td className="p-8">
                    {order.paymentStatus === 'paid' ? (
                      <span className="bg-green-100 text-green-700 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase italic flex items-center gap-1 w-fit"><CheckCircle size={12}/> MAKSETTU</span>
                    ) : (
                      <span className="bg-red-50 text-red-400 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase italic flex items-center gap-1 w-fit"><XCircle size={12}/> EI MAKSETTU</span>
                    )}
                  </td>
                  <td className="p-8">
                    <p className="text-[11px] font-bold text-gray-500 italic max-w-[200px] break-words bg-gray-50 p-3 rounded-xl">{order.viesti || "Ei viestiä"}</p>
                  </td>
                  <td className="p-8">
                    {order.status === 'completed' ? (
                      <span className="text-green-500 flex items-center gap-1 text-[10px] font-black uppercase italic"><CheckCircle size={14}/> Valmis</span>
                    ) : (
                      <button onClick={() => markAsDone(order.id)} className="bg-[#006d67] text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase italic shadow-lg hover:scale-105 transition-all">Merkitse valmiiksi</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}