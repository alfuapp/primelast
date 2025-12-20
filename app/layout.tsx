import "./globals.css";
import { Inter } from "next/font/google";
import Header from "./components/Header"; 

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "PrimeCare",
  description: "Nopea ja luotettava online-terveydenhuolto",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fi">
      <body className={`${inter.className} bg-[#f4f6fb] min-h-screen flex flex-col`}>
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <footer className="bg-[#006d67] text-white py-12">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h3 className="text-xl font-black tracking-widest mb-4">PRIMECARE</h3>
            <p className="text-sm text-gray-300 opacity-70 uppercase tracking-widest">
              © {new Date().getFullYear()} Kaikki oikeudet pidätetään.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}