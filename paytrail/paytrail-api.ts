// Somalia: Koodhka guud ee Paytrail API, kaas oo laga dhoofsan karo (import) meel kasta.

// ------------------------------------
// QAABKA XOGTA (INTERFACES)
// ------------------------------------
export interface Customer {
    email: string;
    // Ku dar xogta kale ee macaamiisha haddii loo baahdo
    firstName?: string;
    lastName?: string;
}

export interface PaytrailRequest {
    amount: number; // Tani waa inaysan ahayn mid laga soo qaado macmiilka, laakiin mid server-ka laga xaqiijiyay
    reference: string;
    customer: Customer;
    priceId: string;
    // Ku dar xogta kale ee Paytrail u baahan yahay sida: items, callbackUrls, etc.
}

export interface VerifiedPrice {
    price: number; // Qiimaha lacagta (tusaale: 39.00)
    description: string;
}

// ------------------------------------
// XOGTA ADEEGYADA EE SERVER-KA (HUBI IN PRICE ID WAA SAX)
// ------------------------------------
// Kani waa Price ID-ga saxda ah ee aad u baahan tahay inaad u dirto form-kaaga.
const SERVICE_OPTIONS: { [key: string]: VerifiedPrice } = {
    // Hubi in Price ID-yadan ay la mid yihiin kuwa aad ka soo dirayso form-ka Tijaabada
    'SURANTA_25': { price: 25.00, description: "Seurantakäynti (25€)" },
    'VIDEO_39': { price: 39.00, description: "Videovastaanotto (39€)" },
    'RESEPTI_9_90': { price: 9.90, description: "Reseptin uusinta (9.90€)" },
};

/**
 * Xaqiijinta Price ID-ga oo soo celi qiimaha saxda ah.
 * @param priceId - ID-ga adeegga ee ka yimid macmiilka.
 * @returns VerifiedPrice ama undefined haddii aan la helin.
 */
export const verifyPriceId = (priceId: string): VerifiedPrice | undefined => {
    // Si taxadar leh u hubi Price ID-ga.
    const verified = SERVICE_OPTIONS[priceId];
    if (!verified) {
        console.error(`Server Error: Price ID aan la xaqiijin: ${priceId}`);
    }
    return verified;
};

/**
 * Abuurista dalabka lacag bixinta ee Paytrail.
 * Halkan waxaa la gashaa Koodhka Paytrail API oo dhab ah.
 */
export const createPaytrailPayment = async (payload: PaytrailRequest): Promise<{ redirectUrl: string } | null> => {
    // ----------------------------------------------------
    // HALKAN WAA INAY KU JIRTAA PAYTRAIL API CALL-KA DHABTA AH
    // ----------------------------------------------------
    
    // Tani waa tusaale URL oo dib u diris ah.
    const redirectUrl = `https://checkout-staging.paytrail.com/payment-simulation?amount=${payload.amount}&ref=${payload.reference}`;

    console.log(`Paytrail API: Payment created. Redirecting to: ${redirectUrl}`);

    return { redirectUrl };
};