import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

// Noocyada adeegyada
interface Service {
  id: string;
  name: string;
  price: number;
}

// Adeegyada la heli karo
const services: Service[] = [
  { id: 'follow-up-PC-1763', name: 'Seurantakäynti - 25€', price: 25.00 },
  { id: 'video-consultation-PC-2893', name: 'Videovastaanotto - 39€', price: 39.00 },
];

// Nooca macluumaadka macaamiisha
interface CustomerInfo {
  email: string;
}

const CheckoutForm: React.FC = () => {
  const [selectedService, setSelectedService] = useState<Service>(services[0]);
  const [customer, setCustomer] = useState<CustomerInfo>({ email: 'test@example.com' });
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const router = useRouter();

  const handleServiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const serviceId = e.target.value;
    const service = services.find(s => s.id === serviceId);
    if (service) {
      setSelectedService(service);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomer({ ...customer, email: e.target.value });
  };

  /**
   * Waxay abuurtaa dalabka lacag bixinta Paytrail iyadoo la wacayo API Route.
   */
  const handlePaytrailPayment = async () => {
    if (isProcessing) return;
    
    if (!customer.email || !selectedService.id) {
        setStatusMessage('Fadlan xaqiiji emailka iyo adeegga la doortay.');
        return;
    }

    setIsProcessing(true);
    setStatusMessage('Dalabka Paytrail ayaa la abuurayaa...');

    try {
      // !!! MUHIIM: Jidka API-ga waa inuu u dhigmaa qaab dhismeedka faylashaada: /api/paytrail/create
      const response = await fetch('/api/paytrail/create', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customer: customer,
          priceId: selectedService.id, 
        }),
      });

      if (response.ok) {
        const data = await response.json();
        
        if (data.redirectUrl) {
          setStatusMessage('Guul! Dib u habeyn ayaa loo samaynayaa bogga lacag bixinta...');
          window.location.href = data.redirectUrl; 
        } else {
          setStatusMessage('Khalad: Jidka dib u habaynta ee Paytrail lama helin ka dib guusha.');
          setIsProcessing(false);
        }
      } else {
        // Khalad ka yimid server-ka API Route (400 ama 500)
        let errorData = { error: 'Jawaab aan ahayn JSON ka timid Server-ka. Hubi Console-ka!' };
        
        try {
            errorData = await response.json();
        } catch (e) {
            // Tani waxay dhacdaa haddii jawaabtu tahay HTML (sida bogga 404/500), kaas oo aan JSON ahayn
            console.error('Non-JSON response received from server:', await response.text());
        }
        
        setStatusMessage(`Fariinta Xaaladda: ${errorData.error || `Khalad aan la garanayn. Status: ${response.status}. Hubi server-ka!`}`);
        setIsProcessing(false);
      }
    } catch (error) {
      console.error('Fetch Error:', error);
      setStatusMessage('Fariinta Xaaladda: Khalad xiriirka ah. Hubi server-kaaga.');
      setIsProcessing(false);
    }
  };

  // Shaqada tijaabada ee Stripe (sidii hore)
  const handleStripePayment = () => {
    setStatusMessage('Lacagta tijaabada ee Stripe waa la rabaa.');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="bg-white p-6 md:p-8 rounded-xl shadow-2xl w-full max-w-md">
        <div className="flex items-center space-x-2 mb-6">
          <span className="text-3xl text-green-700 font-bold">$</span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-green-800">
            Tijaabada Lacag Bixinta (Test Payment)
          </h1>
        </div>

        <p className="text-gray-600 mb-6">
          Fadlan dooro adeegga oo sii wad lacag bixinta Paytrail.
        </p>

        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Sähköposti (valinnainen)
            </label>
            <input
              id="email"
              type="email"
              value={customer.email}
              onChange={handleEmailChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 transition duration-150"
              placeholder="test@example.com"
            />
          </div>

          <div>
            <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-1">
              Palvelu
            </label>
            <select
              id="service"
              value={selectedService.id}
              onChange={handleServiceChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 bg-white transition duration-150"
            >
              {services.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xl font-bold text-red-600">
            Qiimaha la Tijaabinayo: {selectedService.price.toFixed(2)} €
          </p>
        </div>

        {/* Badhanka Stripe (Tijaabada kaliya) */}
        <button
          onClick={handleStripePayment}
          className="w-full mt-6 px-4 py-3 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
          disabled={isProcessing}
        >
          Maksa Stripe (tijaabada API)
        </button>

        {/* Badhanka Paytrail */}
        <button
          onClick={handlePaytrailPayment}
          className={`w-full mt-4 px-4 py-3 font-semibold rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-opacity-50
            ${isProcessing ? 'bg-green-300 cursor-not-allowed' : 'bg-green-700 hover:bg-green-800 text-white focus:ring-green-500'}`}
          disabled={isProcessing}
        >
          {isProcessing ? 'Hadal Wadaag Paytrail...' : 'Maksa Paytrail (dib u diris)'}
        </button>

        {/* Farriinta Xaaladda */}
        <div className={`mt-6 p-4 rounded-lg text-sm transition-all duration-300 ${statusMessage ? 'bg-yellow-100 border border-yellow-300 text-yellow-800' : 'hidden'}`}>
          <h3 className="font-bold mb-1">Fariinta Xaaladda:</h3>
          <p>{statusMessage}</p>
        </div>
      </div>
    </div>
  );
};

export default CheckoutForm;