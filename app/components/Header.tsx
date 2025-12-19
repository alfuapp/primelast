"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Facebook, Instagram, Youtube, Linkedin, Phone, Mail, MapPin } from 'lucide-react';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="w-full sticky top-0 z-[100] shadow-md bg-white">
      {/* 1. HEADER TOP - Social Media & Contact */}
      <div className="hidden lg:block bg-[#006d67] text-white py-2 text-sm">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex gap-4 items-center">
            <span>Follow Us:</span>
            <div className="flex gap-3">
              <Facebook size={16} className="cursor-pointer hover:text-red-400" />
              <Instagram size={16} className="cursor-pointer hover:text-red-400" />
              <Youtube size={16} className="cursor-pointer hover:text-red-400" />
              <Linkedin size={16} className="cursor-pointer hover:text-red-400" />
            </div>
          </div>
          <div className="flex gap-6 items-center">
            <div className="flex items-center gap-2"><MapPin size={14} /> Vaskivuorentie 25, Vantaa</div>
            <div className="flex items-center gap-2"><Mail size={14} /> info@primecare.fi</div>
            <div className="flex items-center gap-2"><Phone size={14} /> +358 465839172</div>
          </div>
        </div>
      </div>

      {/* 2. MAIN NAVIGATION bar */}
      <nav className="bg-white border-b border-gray-100 relative">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          
          {/* Logo */}
          <Link href="/" className="text-2xl font-black text-[#006d67] z-[120]">
            PrimeCare
          </Link>

          {/* Desktop Menu (PC kaliya) */}
          <div className="hidden lg:flex space-x-8 font-bold text-gray-700">
            <Link href="/" className="hover:text-[#006d67] transition">Etusivu</Link>
            <Link href="/services" className="hover:text-[#006d67] transition">Palvelut</Link>
            <Link href="/appointment" className="hover:text-[#006d67] transition">Ajanvaraus</Link>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4 z-[120]">
            <Link 
              href="/appointment" 
              className="bg-[#E63946] text-white px-5 py-2 rounded-full font-bold hover:bg-[#c82f3b] transition text-sm md:text-base"
            >
              Varaa aika
            </Link>

            {/* Mobile Menu Button (Hamburger) */}
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
            >
              {isOpen ? <X size={30} /> : <Menu size={30} />}
            </button>
          </div>
        </div>

        {/* 3. MOBILE MENU DROPDOWN (Kani waa kan mobilka ka muuqan doona) */}
        <div className={`
          lg:hidden absolute top-full left-0 w-full bg-white shadow-2xl transition-all duration-300 ease-in-out z-[110]
          ${isOpen ? "max-h-[500px] border-t border-gray-100 opacity-100 visible" : "max-h-0 opacity-0 invisible overflow-hidden"}
        `}>
          <div className="flex flex-col p-6 space-y-4 font-bold text-gray-800">
            <Link href="/" onClick={() => setIsOpen(false)} className="hover:text-[#006d67] py-3 border-b border-gray-50">Etusivu</Link>
            <Link href="/services" onClick={() => setIsOpen(false)} className="hover:text-[#006d67] py-3 border-b border-gray-50">Palvelut</Link>
            <Link href="/appointment" onClick={() => setIsOpen(false)} className="hover:text-[#006d67] py-3 border-b border-gray-50">Ajanvaraus</Link>
            <div className="pt-4 flex flex-col gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-2"><Phone size={16} /> +358 465839172</div>
              <div className="flex items-center gap-2"><Mail size={16} /> info@primecare.fi</div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}