'use client';

import React, { useEffect, useState } from 'react';
import { db, auth } from '../lib/firebase';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { LogOut, ShieldCheck, Printer, CheckCircle, Trash2, Loader2 } from 'lucide-react';

export default function AdminDashboard() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // 1. Hubi awoodda (Authorization)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!(user && user.email === "primecare1974@gmail.com")) {
        router.replace('/login');
      }
    });
    return () => unsubscribe();
  }, [router]);

  // 2. Ka soo saar xogta Firestore
  useEffect(() => {
    const q = query(collection(db, "tilaukset"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setOrders(ordersData);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // ⭐ Function-ka lagu calaamadeynayo "Done"
  const handleMarkAsDone = async (orderId: string, currentStatus: string) => {
    try {
      const orderRef = doc(db, "tilaukset", orderId);
      await updateDoc(orderRef, {
        status: currentStatus === 'done' ? 'pending' : 'done'
      });
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  // ⭐ Function-ka lagu tirtirayo xogta (Delete)
  const handleDelete = async (orderId: string) => {
    if (window.confirm("Ma hubtaa inaad tirtirto xogtan?")) {
      try {
        await deleteDoc(doc(db, "tilaukset", orderId));
      } catch (error) {
        console.error("Error deleting order:", error);
      }
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <Loader2 className="animate-spin text-[#006d67] mr-2" />
      <span className="font-black italic uppercase text-[#006d67]">Ladataan tietoja...</span>
    </div>
  );

  return (
    <div className="min-h-screen p-4 bg-white font-[Poppins] text-black">
      
      {/* Header - Qaybta sare */}
      <div className="flex items-center justify-between mb-8 print:hidden">
        <div className="flex items-center gap-3">
          <ShieldCheck className="text-[#006d67]" size={32} />
          <h1 className="text-2xl font-black uppercase italic tracking-tighter">PrimeCare Admin</h1>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => window.print()} 
            className="flex items-center gap-2 px-6 py-2 bg-[#006d67] text-white font-bold text-xs uppercase rounded-lg hover:bg-black transition-all shadow-md"
          >
            <Printer size={16} /> Tulosta Kela-lista
          </button>
          <button onClick={() => signOut(auth)} className="p-2 text-gray-400 hover:text-red-600 transition-colors">
            <LogOut size={24} />
          </button>
        </div>
      </div>

      {/* Ku dar 'overflow-x-auto' galka jadwalka ku dhex jiro */}
<div className="bg-white overflow-x-auto border border-gray-200 rounded-lg shadow-sm">
  <table className="w-full border-collapse text-[11px] min-w-[800px]"> 
    {/* 'min-w-[800px]' waxay xaqiijinaysaa in jadwalku uusan isku soo xoortin moobaylka */}
    <thead>
      <tr className="bg-gray-100 uppercase font-black text-center border-b border-gray-300 italic">
        <th className="border border-gray-100 p-3 w-10">no</th>
        <th className="border border-gray-100 p-3">Tilausnumero</th>
        <th className="border border-gray-100 p-3">Päivämäärä</th>
        <th className="border border-gray-100 p-3 text-left">Asiakas / Sähköposti</th>
        <th className="border border-gray-100 p-3">Palvelu</th>
        <th className="border border-gray-100 p-3">Kokonais (€)</th>
        <th className="border border-gray-100 p-3">Maksettu (€)</th>
        <th className="border border-gray-100 p-3 text-red-600">Kela-osuus (€)</th>
        <th className="border border-gray-100 p-3 print:hidden">Toiminto</th>
      </tr>
    </thead>
    <tbody>
            {orders.map((order, index) => (
              <tr 
                key={order.id} 
                className={`text-center font-bold border-b border-gray-100 transition-colors ${
                  order.status === 'done' 
                    ? 'bg-green-50/50' 
                    : (index % 2 === 0 ? 'bg-white' : 'bg-gray-50')
                }`}
              >
                <td className="border border-gray-100 p-3 text-gray-400">
                  {String(index + 1).padStart(2, '0')}
                </td>
                <td className={`border border-gray-100 p-3 uppercase tracking-tighter ${order.status === 'done' ? 'text-gray-400' : 'text-[#006d67]'}`}>
                  {order.orderId}
                </td>
                <td className="border border-gray-100 p-3">
                  {order.paiva || '---'}
                </td>
                <td className="border border-gray-100 p-3 text-left">
                  <div className={`font-black uppercase ${order.status === 'done' ? 'text-gray-400 line-through' : ''}`}>
                    {order.etunimi} {order.sukunimi}
                  </div>
                  <div className="text-[9px] text-gray-400 lowercase font-medium">{order.email || 'ei sähköpostia'}</div>
                </td>
                <td className="border border-gray-100 p-3 italic text-gray-600 uppercase">
                  {order.palvelu}
                </td>
                <td className="border border-gray-100 p-3">
                  {order.totalAmount || (order.palvelu === 'vastaanotto' ? 43 : 10)}€
                </td>
                <td className="border border-gray-100 p-3 text-green-700">
                  {order.hinta}€
                </td>
                <td className="border border-gray-100 p-3 text-red-600 font-black italic">
                  {order.kelaShare ?? (order.palvelu === 'video' ? 25 : order.palvelu === 'vastaanotto' ? 23 : order.palvelu === 'chat' ? 8 : 0)}€
                </td>
                
                {/* Badhamada Toiminto (Done & Delete) - Kaliya shaashadda */}
                <td className="border border-gray-100 p-3 print:hidden">
                  <div className="flex items-center justify-center gap-2">
                    <button 
                      onClick={() => handleMarkAsDone(order.id, order.status)}
                      className={`p-2 rounded-lg transition-all ${
                        order.status === 'done' ? 'text-green-600 bg-green-100' : 'text-gray-400 bg-gray-100 hover:text-[#006d67]'
                      }`}
                      title="Mark as Done"
                    >
                      <CheckCircle size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(order.id)}
                      className="p-2 rounded-lg text-gray-400 bg-gray-100 hover:text-red-600 hover:bg-red-50 transition-all"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-6 text-[9px] font-bold text-gray-300 italic text-center uppercase tracking-widest print:mt-10">
        PrimeCare Finland - Kela-korvausraportti
      </p>
    </div>
  );
}