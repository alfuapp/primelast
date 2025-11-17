import "./globals.css";
import { Inter } from "next/font/google";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "PrimeCare",
  description: "Nopea ja luotettava online-terveydenhuolto",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fi">
      <body className={`${inter.className} bg-[#f4f6fb] flex flex-col min-h-screen`}>

        {/* ⭐ GLOBAL HEADER */}
        <header className="w-full bg-white shadow-sm border-b border-gray-200 fixed top-0 left-0 z-50">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-[#006d67]">
              PrimeCare
            </Link>

            <nav className="hidden md:flex gap-8 text-gray-700 font-medium">
              <Link href="/" className="hover:text-[#006d67] transition">Etusivu</Link>
              <Link href="/services" className="hover:text-[#006d67] transition">Palvelut</Link>
              <Link href="/appointment" className="hover:text-[#006d67] transition">Ajanvaraus</Link>
              <Link href="/about" className="hover:text-[#006d67] transition">Tietoa meistä</Link>
              <Link href="/contact" className="hover:text-[#006d67] transition">Yhteystiedot</Link>
            </nav>

            <Link
              href="/appointment"
              className="hidden md:block bg-[#00916E] text-white px-4 py-2 rounded-lg hover:bg-[#007a5d] transition"
            >
              Varaa aika
            </Link>
          </div>
        </header>

        {/* ⭐ PAGE CONTENT */}
        <main className="flex-grow pt-24">
          {children}
        </main>

        {/* ⭐ GLOBAL FOOTER */}
        <footer className="bg-[#006d67] text-white py-10 mt-12">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">

            <div>
              <h3 className="text-xl font-bold mb-3">PrimeCare</h3>
              <p className="text-sm text-gray-200">
                Nopea ja luotettava online-terveydenhuolto Suomessa.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-3">Pikalinkit</h3>
              <ul className="space-y-2 text-gray-200">
                <li><Link href="/" className="hover:text-white">Etusivu</Link></li>
                <li><Link href="/services" className="hover:text-white">Palvelut</Link></li>
                <li><Link href="/appointment" className="hover:text-white">Ajanvaraus</Link></li>
                <li><Link href="/contact" className="hover:text-white">Yhteystiedot</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-3">Yhteystiedot</h3>
              <p className="text-gray-200 text-sm">support@primecare.fi</p>
              <p className="text-gray-200 text-sm">Helsinki, Suomi</p>
            </div>
          </div>

          <div className="text-center text-gray-300 text-sm mt-8">
            © {new Date().getFullYear()} PrimeCare — Kaikki oikeudet pidätetään.
          </div>
        </footer>

      </body>
    </html>
  );
}
