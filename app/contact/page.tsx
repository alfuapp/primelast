"use client";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#f4f6fb] pt-28 px-6">
      <div className="max-w-4xl mx-auto">

        <h1 className="text-4xl font-bold text-[#006d67] mb-6">
          Yhteystiedot
        </h1>

        <p className="text-gray-700 text-lg mb-10">
          Ota meihin yhteyttä, jos sinulla on kysyttävää palveluistamme.
        </p>

        <div className="bg-white p-8 rounded-xl shadow-lg border space-y-4 text-gray-700">
          
          <p><strong>Sähköposti:</strong> support@primecare.fi</p>
          <p><strong>Sijainti:</strong> Helsinki, Suomi</p>

          <form className="space-y-4 mt-6">
            <div>
              <label className="font-semibold">Nimi</label>
              <input className="w-full p-3 mt-1 border rounded-lg" placeholder="Nimesi" />
            </div>

            <div>
              <label className="font-semibold">Sähköposti</label>
              <input className="w-full p-3 mt-1 border rounded-lg" placeholder="sinä@example.com" />
            </div>

            <div>
              <label className="font-semibold">Viesti</label>
              <textarea className="w-full p-3 mt-1 border rounded-lg h-32" placeholder="Kirjoita viestisi..."></textarea>
            </div>

            <button
              className="w-full bg-[#006d67] text-white py-3 rounded-lg font-semibold hover:bg-[#00534f] transition"
            >
              Lähetä viesti
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
