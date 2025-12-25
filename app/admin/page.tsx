'use client';

import React, { useEffect, useState } from 'react';
import { db, auth } from '../lib/firebase';
import { collection, query, orderBy, onSnapshot, updateDoc, doc, where } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { CheckCircle, Phone, MessageSquare } from 'lucide-react';

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

    // ⭐ Dashboard-ku wuxuu raadinayaa kaliya kuwa 'paid' ah
    const q = query(
      collection(db, "tilaukset"), 
      where("paymentStatus", "==", "paid"), 
      orderBy("createdAt", "desc")
    );

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
      await updateDoc(doc(db, "tilaukset", id), { status: 'completed' });
    } catch (e) { console.error(e); }
  };

  if (!isAdmin) return <div className="min-h-screen flex items-center justify-center font-black italic">PRIMECARE...</div>;

  return (
    <div className="min-h-screen bg-[#f4f6fb] p-12 font-[Poppins]">
      <header className="mb-12 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black text-gray-900 uppercase italic leading-none">Vahvistetut Maksut</h1>
          <p className="text-gray-400 font-bold text-sm italic mt-2 uppercase">Kaikki onnistuneet tilaukset</p>
        </div>
      </header>

      <div className="bg-white rounded-[3.5rem] shadow-2xl overflow-hidden border border-gray-100">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100 uppercase text-[10px] font-black tracking-widest text-gray-400 italic">
              <th className="p-8">Asiakas & Puh</th>
              <th className="p-8">Palvelu & Viesti</th>
              <th className="p-8">Tila</th>
              <th className="p-8 text-right">Toiminto</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50/50 transition-all">
                <td className="p-8">
                  <p className="font-black text-gray-900 uppercase italic leading-none">{order.etunimi} {order.sukunimi}</p>
                  <p className="text-[11px] font-bold text-gray-400 lowercase mb-2">{order.email}</p>
                  <div className="flex items-center text-[#006d67] font-black italic text-[11px]"><Phone size={12} className="mr-1" /> {order.puh}</div>
                </td>
                <td className="p-8">
                  <p className="font-black text-[#006d67] italic text-sm mb-2 uppercase">{order.palvelu}</p>
                  <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 max-w-xs">
                    <p className="text-[10px] font-bold text-gray-500 italic uppercase leading-relaxed">{order.viesti || 'Ei viestiä'}</p>
                  </div>
                </td>
                <td className="p-8">
                  <span className="bg-green-100 text-green-700 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase italic border border-green-200">MAKSETTU</span>
                </td>
                <td className="p-8 text-right">
                  {order.status === 'completed' ? (
                    <span className="text-green-500 font-black italic uppercase text-[10px]">Valmis ✅</span>
                  ) : (
                    <button onClick={() => markAsDone(order.id)} className="bg-[#006d67] text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase italic shadow-lg">Valmis</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && <div className="p-20 text-center font-black text-gray-300 italic uppercase">Ei vielä maksuja...</div>}
      </div>
    </div>
  );
}