"use client";
import { useState } from "react";

export default function AppointmentPage() {
  const [selectedDate, setSelectedDate] = useState("");
  const times = ["16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00"];

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-black text-[#006d67] mb-8 text-center uppercase tracking-tighter">Varaa aika</h1>
      <div className="bg-white p-10 rounded-[3rem] shadow-2xl grid md:grid-cols-2 gap-10">
        <div>
          <label className="block font-bold mb-4">1. Valitse päivä</label>
          <input type="date" className="w-full p-4 border rounded-2xl" onChange={(e) => setSelectedDate(e.target.value)} min={new Date().toISOString().split("T")[0]} />
        </div>
        <div>
          <label className="block font-bold mb-4">2. Valitse kellonaika</label>
          <div className="grid grid-cols-2 gap-3">
            {times.map(t => (
              <button key={t} disabled={!selectedDate} className="p-3 border-2 border-[#006d67] text-[#006d67] rounded-xl font-bold hover:bg-[#006d67] hover:text-white disabled:opacity-20">
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}