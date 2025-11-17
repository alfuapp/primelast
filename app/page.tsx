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
      <main className="flex-grow pt-24"> 
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
              height={300}
              className="rounded-xl shadow-2xl"
            />
          </div>
        </section>

        {/* SERVICES SECTION */}
        <section className="max-w-6xl mx-auto px-6 py-10 grid md:grid-cols-3 gap-6">
          
          {/* Card 1 */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition duration-300">
            <h2 className="text-xl font-bold text-[#006d67] mb-2">Videovastaanotto</h2>
            <p className="text-gray-600 mb-3">
              Etävastaanotto lääkärin kanssa — nopea ja helppo tapa saada hoitoa.
            </p>
            <p className="text-xl font-extrabold text-[#E63946]">39€</p>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition duration-300">
            <h2 className="text-xl font-bold text-[#006d67] mb-2">Reseptin uusinta</h2>
            <p className="text-gray-600 mb-3">
              Saat uuden reseptin turvallisesti ja nopeasti ilman ajanvarausta.
            </p>
            <p className="text-xl font-extrabold text-[#E63946]">9,90€</p>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition duration-300">
            <h2 className="text-xl font-bold text-[#006d67] mb-2">ℹ️ Tärkeää tietoa</h2>
            <p className="text-gray-600 mb-3">
              PrimeCare ei uusi antibioottien, huumausaineiden, unilääkkeiden, rauhoittavien tai vahvojen kipulääkkeiden reseptejä. Näiden pyyntöjä ei käsitellä eikä maksua palauteta.
            </p>
            <p className="text-xl font-extrabold text-[#E63946]"></p>
          </div>

        </section>
      </main>

    

    </div>
  );
}
