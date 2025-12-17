import Link from 'next/link';

export default function PaymentSuccess() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#f4f6fb] px-4">
      <div className="max-w-md w-full text-center p-10 rounded-[2.5rem] bg-white shadow-2xl border border-green-50">
        <div className="text-7xl mb-6 animate-bounce">✅</div>
        
        <h1 className="text-3xl font-extrabold text-[#006d67] mb-4">
          Maksu onnistui!
        </h1>
        
        <p className="text-gray-600 mb-8 text-lg leading-relaxed">
          Kiitos tilauksestasi! Maksusi on vastaanotettu ja tilauksesi käsitellään välittömästi. Saat vahvistuksen sähköpostiisi hetken kuluttua.
        </p>

        <div className="space-y-4">
          <Link 
            href="/" 
            className="inline-block w-full bg-[#006d67] text-white font-bold py-4 rounded-2xl hover:bg-[#00534f] transition shadow-lg active:scale-95"
          >
            Palaa etusivulle
          </Link>
          
          <p className="text-sm text-gray-400">
            Tarvittaessa ota yhteyttä asiakaspalveluumme.
          </p>
        </div>
      </div>
    </div>
  );
}