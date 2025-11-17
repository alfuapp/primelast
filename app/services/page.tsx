"use client";

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-[#f4f6fb] pt-28 px-6">
      <div className="max-w-5xl mx-auto">

        <h1 className="text-4xl font-bold text-[#006d67] mb-6">
          Palvelumme
        </h1>

        <p className="text-gray-700 text-lg mb-10">
          Tarjoamme nopeat ja luotettavat terveyspalvelut verkossa — 
          videovastaanotto, reseptin uusinta ja jatkoseuranta.
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          {/* 1 */}
          <div className="bg-white p-6 rounded-xl shadow-md border">
            <h2 className="font-bold text-xl text-[#006d67]">Videovastaanotto</h2>
            <p className="text-gray-600 mt-2">Etävastaanotto lääkärin kanssa.</p>
            <p className="text-red-500 font-bold text-xl mt-3">39€</p>
          </div>

          {/* 2 */}
          <div className="bg-white p-6 rounded-xl shadow-md border">
            <h2 className="font-bold text-xl text-[#006d67]">Reseptin uusinta</h2>
            <p className="text-gray-600 mt-2">Uusi resepti nopeasti ja turvallisesti.</p>
            <p className="text-red-500 font-bold text-xl mt-3">9,90€</p>
          </div>

          {/* 3 */}
          <div className="bg-white p-6 rounded-xl shadow-md border">
            <h2 className="font-bold text-xl text-[#006d67]">Jatkoseuranta</h2>
            <p className="text-gray-600 mt-2">Seuranta aiemman käynnin jälkeen.</p>
            <p className="text-red-500 font-bold text-xl mt-3">25€</p>
          </div>
        </div>
      </div>
    </div>
  );
}
