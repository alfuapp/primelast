"use client";

// Waxaan ka saarnay 'next/navigation' iyo 'next/link' sababtoo ah khalad ayaa ka yimid.
// Waxaan u adeegsan doonaa useState iyo useEffect si aan ugu shaqayno searchParams si aan ugu ekayno 'useSearchParams'.
// Waxaan u adeegsan doonaa <a> tags halkii 'Link' si looga fogaado dhibaatooyinka soo-dejinta.
import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, ArrowLeft, Loader2 } from 'lucide-react';
// import Link from 'next/link'; // La saaray
// import { useSearchParams } from 'next/navigation'; // La saaray

// Qiimaha Adeegyada loo yaqaanay si loo muujiyo.
const SERVICE_DETAILS: Record<string, string> = {
  consultation_basic: "Videovastaanotto (39€)",
  prescription_renewal: "Reseptin uusinta (9,90€)",
  follow_up: "Seurantakäynti (25€)",
};

/**
 * Shaqo lagu helo URL search parameters si loogu ekeeyo 'useSearchParams' deegaanka Canvas.
 */
function getSearchParams() {
    if (typeof window === 'undefined') {
        return new URLSearchParams();
    }
    return new URLSearchParams(window.location.search);
}

/**
 * Bogga Dib u Celinta ee Paytrail.
 * Tani waa bogga Paytrail uu dib ugu soo celinayo isticmaalaha.
 * Wuxuu u baahan yahay inuu u yeedho API route si uu u xaqiijiyo Checksum.
 */
export default function PaymentPaytrailSuccessPage() {
  // Waxaan isticmaalaynaa getSearchParams() si aan u helno parameters-ka si aan ugu ekayno useSearchParams
  const searchParams = getSearchParams();
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'failure' | 'initial'>('initial');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Xogta laga helay Paytrail URL-ka
  const paytrailParams = Array.from(searchParams.entries()).reduce<Record<string, string>>((acc, [key, value]) => {
    acc[key] = value;
    return acc;
  }, {});

  // Xaqiijinta xogta gaarka ah ee ku-dayashada
  const isSimulation = paytrailParams['debug'] === 'paytrail-simulated';
  // Xaqiijinta tusaale ID adeeg si loo muujiyo (waxaan isticmaalaynaa 'order' ama 'service')
  const orderId = paytrailParams['order'] || paytrailParams['checkout-reference'] || 'N/A';
  const serviceIdFromQuery = paytrailParams['service'] || (orderId !== 'N/A' ? orderId.split('-')[0] : '');

  // Xaaladda dhabta ah, waxaad u baahan lahayd inaad ku kaydiso serviceId database-kaaga adoo isticmaalaya checkout-reference.
  const serviceName = SERVICE_DETAILS[serviceIdFromQuery as keyof typeof SERVICE_DETAILS] || 'Tuntematon palvelu';

  // 1. XAQIIJINTA CHKSUM Marka bogga la soo shubo
  useEffect(() => {
    if (Object.keys(paytrailParams).length === 0) {
      setVerificationStatus('failure');
      setErrorMessage("URL-ka lama xaqiijin karo (majiraan parameters).");
      return;
    }
    
    // --- BEDDELKA 1: Qabsashada Ku-dayashada ---
    if (isSimulation) {
      console.log("Paytrail simulation detected. Skipping Checksum verification.");
      setVerificationStatus('success');
      return; // Jooji shaqada oo ka gudub hubinta Paytrail
    }
    // --------------------------------------------

    // Hubi in xogta ay ku jirto URL-ka (Tani waxay shaqaynaysaa kaliya Paytrail dhab ah)
    const requiredKeys = ['checkout-account', 'checkout-algorithm', 'checkout-stamp', 'signature'];
    const missingKey = requiredKeys.find(key => !paytrailParams[key]);
    if (missingKey) {
      setVerificationStatus('failure');
      setErrorMessage(`Ma jiro xog muhiim ah: ${missingKey}. Paytrail dib uma soo celin xogta.`);
      return;
    }

    const verifyPaytrailPayment = async () => {
      setVerificationStatus('loading');
      setErrorMessage(null);

      try {
        // Waxaanu u diraynaa dhammaan params API-ga si uu u xaqiijiyo Checksum
        const res = await fetch('/api/verify-paytrail-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(paytrailParams),
        });

        const data = await res.json();

        if (!res.ok || data.error) {
          throw new Error(data.error || 'Khalad ayaa dhacay Paytrail.');
        }

        // Xaqiijinta Checksum-ka waa la sameeyay
        if (data.verified) {
          setVerificationStatus('success');
        } else {
            // Tani waxay dhacdaa haddii Checksum-ka uu ku fashilmo Server-ka (xogta la farageliyay)
          setVerificationStatus('failure');
          setErrorMessage("Khalad xaqiijin: Cheksum-ka Paytrail ma iswaafaqayo.");
        }

      } catch (err: any) {
        console.error("Khalad ku jira xaqiijinta:", err);
        setVerificationStatus('failure');
        setErrorMessage(err.message || 'Lama xiriiri karo server-ka xaqiijinta Paytrail.');
      }
    };

    verifyPaytrailPayment();
  }, [isSimulation, paytrailParams]); // Ku dar isSimulation iyo paytrailParams si loo hubiyo inuu shaqaynayo mar labaad

  // Nashqadda (Styling-ka)ada oo ku dhex jirta Tailwind/Standard React Style
  const SuccessCard = () => (
    <div
      className="max-w-md w-full bg-white rounded-2xl p-8 shadow-2xl text-center border border-green-200 animate-fadeIn"
      style={{ boxShadow: "0 10px 30px rgba(22, 163, 74, 0.25)" }}
    >
      <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-6" />
      <h1 className="text-3xl font-bold mb-3 text-green-700">Maksu onnistui ✅</h1>
      <p className="text-lg text-gray-700 mb-2">
        Kiitos, PrimeCare on vastaanottanut maksusi.
      </p>
      <div className="text-sm text-gray-500 mb-6">
        {/* BEDDELKA 2: Muuji inuu yahay Ku-dayasho */}
        {isSimulation && (
          <p className="font-bold text-green-500 mb-2">Tani waa lacag bixin ku-dayasho ah (SIMULATION)</p>
        )}
        <p>Tilausnumero: **{orderId}**</p>
        <p>Palvelu: {serviceName}</p>
      </div>
      <a 
        href="/test-payment" 
        className="inline-flex items-center bg-[#E63946] text-white font-semibold px-6 py-3 rounded-lg hover:bg-[#d43343] transition duration-300"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Ku Noqo Tijaabada Lacag Bixinta
      </a>
    </div>
  );

  const FailureCard = () => (
    <div
      className="max-w-md w-full bg-white rounded-2xl p-8 shadow-2xl text-center border border-red-200 animate-fadeIn"
      style={{ boxShadow: "0 10px 30px rgba(239, 68, 68, 0.25)" }}
    >
      <XCircle className="w-16 h-16 text-red-600 mx-auto mb-6" />
      <h1 className="text-3xl font-bold mb-3 text-red-700">Maksu epäonnistui ❌</h1>
      <p className="text-lg text-gray-700 mb-6">
        Valitettavasti maksua ei voitu vahvistaa.
      </p>
      <div className="p-3 bg-red-50 rounded-lg text-sm text-red-600 mb-8">
        <p className="font-semibold mb-1">Syynä oleva virhe:</p>
        <p className="break-all">{errorMessage}</p>
      </div>
      <a 
        href="/test-payment" 
        className="inline-flex items-center bg-[#006d67] text-white font-semibold px-6 py-3 rounded-lg hover:bg-[#00534f] transition duration-300"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Isku Day Mar Kale
      </a>
    </div>
  );
  
  const LoadingCard = () => (
    <div
      className="max-w-md w-full bg-white rounded-2xl p-8 shadow-2xl text-center border border-blue-200 animate-fadeIn"
      style={{ boxShadow: "0 10px 30px rgba(59, 130, 246, 0.25)" }}
    >
      <Loader2 className="w-16 h-16 text-blue-600 mx-auto mb-6 animate-spin" />
      <h1 className="text-3xl font-bold mb-3 text-blue-700">Vahvistetaan maksua...</h1>
      <p className="text-lg text-gray-600 mb-6">
        Odotathan hetken, Paytrail-maksuasi varmistetaan.
      </p>
    </div>
  );


  return (
    <div 
      className="min-h-screen flex items-center justify-center p-6"
      style={{ background: "#f4f6fb" }}
    >
      {verificationStatus === 'loading' && <LoadingCard />}
      {verificationStatus === 'success' && <SuccessCard />}
      {(verificationStatus === 'failure' || verificationStatus === 'initial') && <FailureCard />}
    </div>
  );
}