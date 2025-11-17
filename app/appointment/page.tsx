"use client";

export default function AppointmentPage() {
  return (
    <div className="min-h-screen bg-[#f4f6fb] pt-28 px-6">
      <div className="max-w-4xl mx-auto">

        <h1 className="text-4xl font-bold text-[#006d67] mb-6">
          Ajanvaraus
        </h1>

        <p className="text-gray-700 text-lg mb-10">
          Varaa aika nopeasti ja helposti. Täytä alla olevat tiedot ja valitse sopiva palvelu.
        </p>

        <div className="bg-white p-8 rounded-xl shadow-lg border">
          <form className="space-y-4 text-gray-700">
            <div>
              <label className="font-semibold">Nimi</label>
              <input className="w-full mt-1 p-3 border rounded-lg" type="text" placeholder="Etunimi ja sukunimi" />
            </div>

            <div>
              <label className="font-semibold">Sähköposti</label>
              <input className="w-full mt-1 p-3 border rounded-lg" type="email" placeholder="sinä@example.com" />
            </div>

            <div>
              <label className="font-semibold">Palvelu</label>
              <select className="w-full mt-1 p-3 border rounded-lg">
                <option>Videovastaanotto – 39€</option>
                <option>Reseptin uusinta – 9,90€</option>
                <option>Jatkoseuranta – 25€</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-[#006d67] text-white py-3 rounded-lg font-semibold hover:bg-[#00534f] transition"
            >
              Vahvista ajanvaraus
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
