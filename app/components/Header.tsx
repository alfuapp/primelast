// /components/Header.tsx

'use client'; // Waa inuu noqdaa Client Component si uu u isticmaalo usePathname

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from 'lucide-react'; // Loo baahan yahay Mobile Menu (haddii la rabo)
import { useState } from "react";

// ----------------------------------------------------------------------
// Link-yada Header-ka
// ----------------------------------------------------------------------
const navLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/appointment", label: "Appointment" },
  { href: "/about", label: "Nagu Saabsan" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Mobile Menu state

  // Shaqada lagu go'aaminayo style-ka haddii uu yahay bogga hadda socda
  const linkStyle = (path: string) =>
    pathname === path
      ? "text-green-600 font-bold border-b-2 border-green-600 pb-1" // Style-ka bogga hadda socda
      : "text-gray-700 hover:text-green-600 transition duration-200";

  return (
    <header className="w-full bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        
        {/* Magaca Website-ka / Logo */}
        <Link href="/" className="text-3xl font-extrabold text-blue-700 hover:text-blue-800 transition duration-200">
          PrimeCare
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-8 text-lg items-center">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className={linkStyle(link.href)}>
              {link.label}
            </Link>
          ))}
          {/* CTA Button */}
          <Link href="/appointment" className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 shadow-md">
            Ballan Qabso
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-gray-700"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle Menu"
        >
          {isMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
        </button>
      </div>

      {/* Mobile Menu Content (oo soo muuqda marka la furo) */}
      {isMenuOpen && (
        <div className="md:hidden bg-gray-50 border-t border-gray-200 py-4 px-4 shadow-inner">
          <nav className="flex flex-col gap-4 text-base">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href} 
                className={`py-2 px-3 rounded-lg ${linkStyle(link.href)} ${pathname === link.href ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {/* CTA Button Mobile */}
            <Link href="/appointment" className="mt-2 text-center bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded-lg transition duration-300">
                Ballan Qabso Degdeg
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}