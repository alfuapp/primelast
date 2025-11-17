'use client';

import React from 'react';
import { CreditCard, Heart, Calendar, Info, Check } from 'lucide-react';

// Midabka Paytrail Green oo cusub
const PAYTRAIL_GREEN = 'bg-[#006d67]';
const BUTTON_RED = 'bg-[#e5395a]';

// Interface for service card data
interface Service {
    id: string;
    icon: React.ElementType;
    title: string;
    price: string;
    details: string[];
    isImportant: boolean; // For the third card (Tärkeää tietoa)
    headerColorClass: string;
}

// Data for the three service cards
const services: Service[] = [
    {
        id: 'new_prescription',
        icon: CreditCard,
        title: 'Uusi resepti nyt',
        price: '10 €',
        details: [
            'Arkipäivän loppuun asti',
            'Julkisen tai yksityisen lääkärin resepti',
        ],
        isImportant: false,
        headerColorClass: PAYTRAIL_GREEN,
    },
    {
        id: 'remote_appointment',
        icon: Calendar,
        title: 'Lääkärin etävastaanotto',
        price: '43 €',
        details: [
            '(68 euroa ilman Kela-korvausta)',
            'Sairauslomattodistus',
            'Uusi lääkemääräyspyyntö',
            'Hoidon määrittäminen',
        ],
        isImportant: false,
        headerColorClass: PAYTRAIL_GREEN,
    },
    {
        id: 'important_info',
        icon: Info,
        title: 'Tärkeää tietoa',
        price: '', // No price for info card
        details: [
            'PrimeCare ei uusi antibioottien, huumaaineiden, unilääkkeiden, rauhoittavien tai vahvojen kipulääkkeiden reseptejä.',
            'Näiden pyyntöjä ma la shaqayn karaan marka koodhka kale ee xaqiijinta la dhammeeyo, fadlan hubi.',
        ],
        isImportant: true,
        headerColorClass: 'bg-red-600', // Red header for caution
    },
];

// Service Card Component
const ServiceCard: React.FC<{ service: Service }> = ({ service }) => {
    const IconComponent = service.icon;

    // Use a regular <div> instead of a button for the "Valitse" button in the non-important cards
    const SelectButton = (
        <a 
            href={`/test-payment?service=${service.id}`}
            className={`${BUTTON_RED} text-white font-extrabold text-lg py-2.5 rounded-lg shadow-lg hover:bg-red-700 transition w-full text-center block mt-4`}
        >
            Valitse
        </a>
    );

    return (
        <div className="bg-white p-0 rounded-xl shadow-lg border border-gray-100 flex flex-col h-full font-[Poppins]">
            
            {/* Header: Fixed Height, Colored Background */}
            <div className={`p-4 rounded-t-xl text-white ${service.headerColorClass} h-20 flex items-center justify-center`}>
                <div className="flex items-center space-x-3 text-lg font-bold">
                    <IconComponent className="w-6 h-6" />
                    <span>{service.title}</span>
                </div>
            </div>

            {/* Content Body */}
            <div className="p-6 flex flex-col justify-between flex-grow">
                
                <div className="space-y-4">
                    {/* Price / Kela Info (Only for main service cards) */}
                    {!service.isImportant && (
                        <div className="text-center">
                            <p className="text-4xl font-extrabold text-red-600 mb-1">{service.price}</p>
                            {service.details.length > 0 && service.details[0].includes('euroa') && (
                                <p className="text-sm text-gray-500">{service.details[0]}</p>
                            )}
                        </div>
                    )}

                    {/* Features / Details */}
                    <ul className="space-y-2 pt-4">
                        {service.details.map((detail, index) => {
                            // Skip the Kela info detail if already shown in price section
                            if (!service.isImportant && index === 0 && detail.includes('euroa')) return null;

                            return (
                                <li key={index} className="flex items-start text-gray-700 text-base">
                                    {service.isImportant ? (
                                        <Info className="w-5 h-5 mr-2 text-red-500 flex-shrink-0 mt-1" />
                                    ) : (
                                        <Check className="w-5 h-5 mr-2 text-teal-600 flex-shrink-0 mt-1" />
                                    )}
                                    <p className={service.isImportant ? "text-sm text-left text-gray-600" : ""}>
                                        {detail}
                                    </p>
                                </li>
                            );
                        })}
                    </ul>
                </div>
                
                {/* Select Button (Only for main service cards) */}
                {!service.isImportant && (
                    <div className="mt-8">
                        {SelectButton}
                    </div>
                )}
            </div>
        </div>
    );
};


export default function ServicesPage() {
    return (
        <div className="min-h-screen bg-[#f4f6fb] pt-28 px-4 font-[Poppins]">
             {/* Font Import for Poppins (Best Practice for Tailwind projects) */}
            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800&display=swap');
                body {
                    font-family: 'Poppins', sans-serif;
                }
            `}</style>
            
            <div className="max-w-7xl mx-auto pb-16">

                <h1 className="text-4xl font-extrabold text-[#006d67] mb-2 text-center">
                    Palvelumme
                </h1>

                <p className="text-gray-700 text-lg mb-10 text-center max-w-2xl mx-auto">
                    Valitse sopiva palvelu ja varaa aika.
                </p>

                {/* Service Cards Grid */}
                <div className="grid md:grid-cols-3 gap-8">
                    {services.map((service) => (
                        <ServiceCard key={service.id} service={service} />
                    ))}
                </div>
            </div>
        </div>
    );
}