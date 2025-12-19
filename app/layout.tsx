import "./globals.css";
import { Inter } from "next/font/google";
import Header from "./components/Header"; // 👈 Waxaan soo kabanay Header-kii cusbaa

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "PrimeCare",
  description: "Nopea ja luotettava online-terveydenhuolto",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fi">
      <body className={`${inter.className} bg-[#f4f6fb] flex flex-col min-h-screen`}>

        {/* ⭐ GLOBAL HEADER (Hadda wuxuu ka imaanayaa components/Header.tsx) */}
        <Header />

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
                <li><a href="/" className="hover:text-white">Etusivu</a></li>
                <li><a href="/services" className="hover:text-white">Palvelut</a></li>
                <li><a href="/appointment" className="hover:text-white">Ajanvaraus</a></li>
                <li><a href="/contact" className="hover:text-white">Yhteystiedot</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-3">Yhteystiedot</h3>
              <p className="text-gray-200 text-sm">support@primecare.fi</p>
              <p className="text-gray-200 text-sm">Helsinki, Suomi</p>
            </div>
          </div>
          <div className="text-center text-gray-300 text-sm mt-8 border-t border-white/10 pt-6">
            © {new Date().getFullYear()} PrimeCare — Kaikki oikeudet pidätetään.
          </div>
        </footer>
      </body>
    </html>
  );
}