'use client';

import React, { useEffect, useState } from 'react';
import { db, auth } from '../lib/firebase';
// ⭐ MUHIIM: Waxaan halkan ku darnay 'where' si ciladda image_396b87 u baxdo
import { collection, query, orderBy, onSnapshot, updateDoc, doc, where } from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { LayoutDashboard, CheckCircle, Search, Loader2, LogOut, XCircle, Menu, X } from 'lucide-react';

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

    // ⭐ FILTER-KA: Kaliya soo qaad kuwa leh paymentStatus == 'paid'
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
    <div className="min-h-screen bg-[#f4f6fb] flex font-[Poppins]">
      {/* Sidebar Content (Sidii hore u dhig) */}
      <div className="flex-1 p-12">
        <header className="mb-12">
          <h1 className="text-4xl font-black text-gray-900 uppercase italic">Vahvistetut Maksut</h1>
          <p className="text-gray-400 font-bold text-sm italic">Vain onnistuneet maksutapahtumat näytetään tässä</p>
        </header>

        <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-gray-100">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 uppercase text-[10px] font-black tracking-widest text-gray-400 italic">
                <th className="p-8">Asiakas</th>
                <th className="p-8">Palvelu</th>
                <th className="p-8">Maksu</th>
                <th className="p-8">Toiminto</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50/50 transition-all">
                  <td className="p-8">
                    <p className="font-black text-gray-900 uppercase italic leading-none">{order.etunimi} {order.sukunimi}</p>
                    <p className="text-[11px] font-bold text-gray-400 lowercase">{order.email}</p>
                  </td>
                  <td className="p-8 font-black text-[#006d67] italic text-sm">{order.palvelu} ({order.hinta}€)</td>
                  <td className="p-8">
                    <span className="bg-green-100 text-green-700 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase italic border border-green-200 shadow-sm">
                      <CheckCircle size={12} className="inline mr-1"/> MAKSETTU
                    </span>
                  </td>
                  <td className="p-8 text-right">
                    {order.status === 'completed' ? (
                      <span className="text-green-500 font-black italic uppercase text-[10px]">Valmis</span>
                    ) : (
                      <button onClick={() => markAsDone(order.id)} className="bg-[#006d67] text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase italic shadow-lg">Merkitse valmiiksi</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {orders.length === 0 && <div className="p-20 text-center font-black text-gray-300 italic uppercase">Ei onnistuneita maksuja...</div>}
        </div>
      </div>
    </div>
  );
}