"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Facebook, Instagram, Youtube, Linkedin, Phone, Mail, MapPin } from 'lucide-react';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="w-full z-[100] shadow-md bg-white">
      {/* 1. TOP BAR */}
      <div className="hidden lg:block bg-[#006d67] text-white py-2 text-sm">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex gap-4 items-center">
            <span>Follow Us:</span>
            <div className="flex gap-3">
              <Facebook size={16} className="cursor-pointer hover:text-red-400" />
              <Instagram size={16} className="cursor-pointer hover:text-red-400" />
              <Youtube size={16} className="cursor-pointer hover:text-red-400" />
            </div>
          </div>
          <div className="flex gap-6 items-center">
            <div className="flex items-center gap-2 font-medium"><MapPin size={14} /> Ojahaanrinne 4 01600 Vantaa</div>
            <div className="flex items-center gap-2 font-medium"><Mail size={14} /> info@primecare.fi</div>
            <div className="flex items-center gap-2 font-medium"><Phone size={14} /> +358 465839172</div>
          </div>
        </div>
      </div>

      {/* 2. NAVIGATION */}
      <nav className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-black text-[#006d67]">
            PrimeCare
          </Link>

          <div className="hidden lg:flex space-x-8 font-bold text-gray-700">
            <Link href="/" className="hover:text-[#006d67] transition">Etusivu</Link>
            <Link href="/services" className="hover:text-[#006d67] transition">Palvelut</Link>
            <Link href="/appointment" className="hover:text-[#006d67] transition">Ajanvaraus</Link>
          </div>

          <div className="flex items-center gap-4">
            <Link 
              href="/services" 
              className="bg-[#E63946] text-white px-5 py-2 rounded-full font-bold hover:bg-[#c82f3b] transition text-sm"
            >
              Varaa aika
            </Link>

            <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden p-2 text-gray-700">
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        <div className={`lg:hidden overflow-hidden transition-all duration-300 ${isOpen ? "max-h-64 border-t" : "max-h-0"}`}>
          <div className="flex flex-col p-6 space-y-4 font-bold">
            <Link href="/" onClick={() => setIsOpen(false)}>Etusivu</Link>
            <Link href="/services" onClick={() => setIsOpen(false)}>Palvelut</Link>
            <Link href="/appointment" onClick={() => setIsOpen(false)}>Ajanvaraus</Link>
          </div>
        </div>
      </nav>
    </header>
  );
}