"use client";

import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f4f6fb]">

      {/* ⭐ HEADER / NAVBAR */}
      <header className="w-full bg-white shadow-sm border-b border-gray-200 fixed top-0 left-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-[#006d67]">
            PrimeCare
          </Link>

          {/* Menu */}
          <nav className="hidden md:flex gap-8 text-gray-700 font-medium">
            <Link href="/" className="hover:text-[#006d67] transition">Etusivu</Link>
            <Link href="/services" className="hover:text-[#006d67] transition">Palvelut</Link>
            <Link href="/appointment" className="hover:text-[#006d67] transition">Ajanvaraus</Link>
            <Link href="/about" className="hover:text-[#006d67] transition">Tietoa meistä</Link>
            <Link href="/contact" className="hover:text-[#006d67] transition">Yhteystiedot</Link>
          </nav>

          {/* CTA Button */}
          <Link
            href="/appointment"
            className="hidden md:block bg-[#00916E] text-white px-4 py-2 rounded-lg hover:bg-[#007a5d] transition"
          >
            Varaa aika
          </Link>
        </div>
      </header>

      {/* ⭐ MAIN CONTENT STARTS */}
      <main className="flex-grow">
 
        {/* HERO SECTION */}
        <section className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 px-6 pt-10 pb-10 items-center">
          
          {/* LEFT TEXT */}
          <div>
            <h1 className="text-5xl font-extrabold text-[#006d67] leading-tight">
              Reseptin uusiminen helposti ja turvallisesti verkossa
            </h1>

            <p className="mt-4 text-gray-600 text-lg">
              Videovastaanotto, reseptin uusinta ja terveysneuvonta — helposti ja turvallisesti kotoa.
            </p>

            <a
              href="/test-payment"
              className="inline-block mt-8 bg-[#006d67] text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:bg-[#00534f] transition duration-300 transform hover:scale-[1.02]"
            >
              Varaa aika & Testaa maksua
            </a>
          </div>

          {/* RIGHT IMAGE */}
          <div className="flex justify-center">
            <Image
  src="/images/doctor.png"
  alt="Lääkäri"
  width={500}
  height={200}
  className="rounded-xl shadow-2xl object-contain"
 />
          </div>
        </section>

        {/* SERVICES SECTION */}
<section className="max-w-6xl mx-auto px-6 py-10 grid md:grid-cols-3 gap-8">

  {/* CARD 1 – Uusi resepti nyt */}
  <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition">
    
    {/* Green Header */}
    <div className="bg-[#006d67] text-white text-lg font-bold px-6 py-4 flex items-center gap-2">
      <span className="text-xl">💊</span>
      Uusi resepti nyt
    </div>

    {/* Body */}
    <div className="px-6 py-6">
      <p className="text-4xl font-extrabold text-center text-[#E63946] mb-4">10 €</p>

      <ul className="text-gray-700 space-y-2">
        <li>✓ Arkipäivän loppuun asti</li>
        <li>✓ Julkisen tai yksityisen lääkärin resepti</li>
      </ul>
    </div>

    {/* Red Button */}
    <div className="px-6 pb-6">
      <button className="w-full bg-[#E63946] text-white py-3 rounded-lg font-bold hover:bg-[#c82f3b] transition">
        Valitse
      </button>
    </div>
  </div>

  {/* CARD 2 – Lääkärin etävastaanotto */}
  <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition">

    {/* Green Header */}
    <div className="bg-[#006d67] text-white text-lg font-bold px-6 py-4 flex items-center gap-2">
      <span className="text-xl">📅</span>
      Lääkärin etävastaanotto
    </div>

    {/* Body */}
    <div className="px-6 py-6">
      <p className="text-4xl font-extrabold text-center text-[#E63946] mb-1">43 €</p>
      <p className="text-center text-gray-600 mb-4">(68 euroa ilman Kela-korvausta)</p>

      <ul className="text-gray-700 space-y-2">
        <li>✓ Sairauslomatodistus</li>
        <li>✓ Uusi lääkemääräyspyyntö</li>
        <li>✓ Hoidon määrittäminen</li>
      </ul>
    </div>

    {/* Red Button */}
    <div className="px-6 pb-6">
      <button className="w-full bg-[#E63946] text-white py-3 rounded-lg font-bold hover:bg-[#c82f3b] transition">
        Valitse
      </button>
    </div>
  </div>

  {/* CARD 3 – Info */}
  <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition">

    {/* Red Header */}
    <div className="bg-[#E63946] text-white text-lg font-bold px-6 py-4 flex items-center gap-2">
      <span className="text-xl">ℹ️</span>
      Tärkeää tietoa
    </div>

    {/* Body */}
    <div className="px-6 py-6 text-gray-700 space-y-4 leading-relaxed">
      <p>
        PrimeCare ei uusi antibioottien, huumausaineiden, unilääkkeiden, 
        rauhoittavien tai vahvojen kipulääkkeiden reseptejä.
      </p>

      <p>
        Näiden pyyntöjä ei käsitellä eikä maksua palauteta.
      </p>
    </div>
  </div>

</section>

      </main>

    

    </div>
  );
}
