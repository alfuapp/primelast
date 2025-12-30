'use client';

import React, { useEffect, useState } from 'react';
import { db, auth } from '../lib/firebase';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { LogOut, ShieldCheck, Printer, CheckCircle, Trash2, Loader2, FileSpreadsheet } from 'lucide-react';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

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

  // 2. Ka soo saar xogta Firestore (Live Sync)
  useEffect(() => {
    const q = query(collection(db, "tilaukset"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setOrders(ordersData);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // ⭐ Function-ka Excel Export
  const exportToExcel = async () => {
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Tilaukset');

      worksheet.columns = [
        { header: 'ID', key: 'orderId', width: 15 },
        { header: 'Päivä', key: 'paiva', width: 15 },
        { header: 'Aika', key: 'aika', width: 10 },
        { header: 'Asiakas', key: 'asiakas', width: 25 },
        { header: 'Palvelu', key: 'palvelu', width: 20 },
        { header: 'Maksettu (€)', key: 'hinta', width: 15 },
        { header: 'Kela-osuus (€)', key: 'kela', width: 15 },
        { header: 'Yhteensä (€)', key: 'yhteensa', width: 15 },
        { header: 'Status', key: 'status', width: 15 }
      ];

      orders.forEach((order) => {
        worksheet.addRow({
          orderId: order.orderId,
          paiva: order.paiva || "-",
          aika: order.aika || "-",
          asiakas: `${order.etunimi} ${order.sukunimi}`,
          palvelu: order.palvelu,
          hinta: order.hinta,
          kela: order.kelaShare ?? 0,
          yhteensa: order.totalAmount,
          status: order.status === 'done' ? 'VALMIS' : 'KESKEN'
        });
      });

      worksheet.getRow(1).font = { bold: true };
      worksheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF006D67' }
      };
      worksheet.getRow(1).eachCell((cell) => {
        cell.font = { color: { argb: 'FFFFFFFF' }, bold: true };
      });

      const buffer = await workbook.xlsx.writeBuffer();
      const data = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(data, `PrimeCare_Raportti_${new Date().toLocaleDateString('fi-FI')}.xlsx`);
    } catch (error) {
      console.error("Excel Error:", error);
      alert("Virhe Excel-tiedoston luonnissa.");
    }
  };

  // Function-ka lagu calaamadeynayo "Done"
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

  // Function-ka lagu tirtirayo xogta
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
      
      {/* Header - Qarsan marka la daabacayo */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 print:hidden gap-4">
        <div className="flex items-center gap-3">
          <ShieldCheck className="text-[#006d67]" size={32} />
          <h1 className="text-2xl font-black uppercase italic tracking-tighter">PrimeCare Admin</h1>
        </div>
        
        <div className="flex flex-wrap justify-center gap-2">
          {/* Excel Button */}
          <button 
            onClick={exportToExcel}
            className="flex items-center gap-2 px-5 py-2 bg-green-700 text-white font-bold text-xs uppercase rounded-lg hover:bg-black transition-all shadow-md"
          >
            <FileSpreadsheet size={16} /> Lataa Excel
          </button>

          {/* Print Button */}
          <button 
            onClick={() => window.print()} 
            className="flex items-center gap-2 px-5 py-2 bg-[#006d67] text-white font-bold text-xs uppercase rounded-lg hover:bg-black transition-all shadow-md"
          >
            <Printer size={16} /> Tulosta PDF
          </button>

          {/* Logout */}
          <button onClick={() => signOut(auth)} className="ml-2 p-2 text-gray-400 hover:text-red-600 transition-colors">
            <LogOut size={24} />
          </button>
        </div>
      </div>

      {/* Container-ka Jadwalka */}
      <div className="bg-white overflow-x-auto border border-gray-200 rounded-lg shadow-sm">
        <table className="w-full border-collapse text-[11px] min-w-[950px]"> 
          <thead>
            <tr className="bg-gray-100 uppercase font-black text-center border-b border-gray-300 italic">
              <th className="border border-gray-200 p-3 w-10">no</th>
              <th className="border border-gray-200 p-3">Tilausnumero</th>
              <th className="border border-gray-200 p-3">Päivämäärä</th>
              <th className="border border-gray-200 p-3 text-left">Asiakas / Sähköposti</th>
              <th className="border border-gray-200 p-3">Palvelu</th>
              <th className="border border-gray-300 p-3 bg-yellow-50/20 w-24">ICD-10</th>
              <th className="border border-gray-200 p-3">Kokonais (€)</th>
              <th className="border border-gray-200 p-3">Maksettu (€)</th>
              <th className="border border-gray-200 p-3 text-red-600 font-black">Kela-osuus (€)</th>
              <th className="border border-gray-100 p-3 print:hidden">Toiminto</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr 
                key={order.id} 
                className={`text-center font-bold border-b border-gray-100 transition-colors ${
                  order.status === 'done' 
                    ? 'bg-green-50/50 opacity-80' 
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
                <td className="border border-gray-300 p-3 bg-white"></td>
                <td className="border border-gray-100 p-3">
                  {order.totalAmount || (order.palvelu === 'vastaanotto' ? 43 : 10)}€
                </td>
                <td className="border border-gray-100 p-3 text-green-700">
                  {order.hinta}€
                </td>
                <td className="border border-gray-100 p-3 text-red-600 font-black italic">
                  {order.kelaShare ?? (order.palvelu === 'video' ? 25 : order.palvelu === 'vastaanotto' ? 23 : order.palvelu === 'chat' ? 8 : 0)}€
                </td>
                <td className="border border-gray-100 p-3 print:hidden">
                  <div className="flex items-center justify-center gap-2">
                    <button 
                      onClick={() => handleMarkAsDone(order.id, order.status)}
                      className={`p-2 rounded-lg transition-all ${
                        order.status === 'done' ? 'text-green-600 bg-green-100' : 'text-gray-400 bg-gray-100 hover:text-[#006d67]'
                      }`}
                    >
                      <CheckCircle size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(order.id)}
                      className="p-2 rounded-lg text-gray-400 bg-gray-100 hover:text-red-600 hover:bg-red-50"
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
        © {new Date().getFullYear()} PrimeCare Finland - Kela-korvausraportti
      </p>
    </div>
  );
}