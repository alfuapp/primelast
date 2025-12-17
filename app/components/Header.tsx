import Link from 'next/link';

export default function Header() {
  return (
    <header className="w-full bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-3xl font-extrabold text-[#006d67] hover:opacity-80 transition duration-200">
          PrimeCare
        </Link>
        
        <nav className="hidden md:flex space-x-8 font-semibold text-gray-700">
          <Link href="/" className="hover:text-[#006d67]">Etusivu</Link>
          <Link href="/services" className="hover:text-[#006d67]">Palvelut</Link>
          <Link href="/appointment" className="hover:text-[#006d67]">Ajanvaraus</Link>
        </nav>

        <Link 
          href="/appointment" 
          className="bg-[#E63946] text-white px-6 py-2 rounded-full font-bold hover:bg-[#c82f3b] transition"
        >
          Varaa aika
        </Link>
      </div>
    </header>
  );
}