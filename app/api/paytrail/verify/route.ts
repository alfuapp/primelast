// Kani waa route Next.js (Server-side API) ah si loo xaqiijiyo xogta dib-u-dirista Paytrail
import { NextResponse } from 'next/server';
import { createHmac } from 'crypto';

// MUHIIM: Waxaan ku darsanay dynamic = 'force-dynamic' si looga hortago ciladda build-ka
// Ciladda: 'Route /api/paytrail/verify couldn't be rendered statically because it used request.url'
export const dynamic = 'force-dynamic';

// --- XOGTA SHAQADA PAYTRAIL ---
// FIIRO GAAR AH: Kani waa Secret Key ee Tijaabada
const SECRET_KEY = 'SAIPPUAKAUPPIAS'; 

/**
 * Hubinta in Signature-ka Paytrail uu saxsan yahay.
 * Waxaa la hubiyaa dhammaan xogta query params-ka laga soo reebay Signature-ka.
 */
function isPaytrailSignatureValid(params: Record<string, string>, secret: string): boolean {
    const signature = params['signature'];
    if (!signature) {
        console.warn('Paytrail Verification: Lama helin Signature.');
        return false;
    }

    // Shaqaada Paytrail: Xaqiijinta saxiixa
    // 1. Kala shaandhee xogta: Ka saar 'signature' iyo xogta aan 'checkout-' ahayn
    const dataToSign: Record<string, string> = {};
    Object.keys(params)
        .filter(key => key.startsWith('checkout-') && key !== 'signature')
        .forEach(key => {
            // Paytrail waxay u baahan tahay in qiimaha uu noqdo mid aan waxba laga beddelin
            dataToSign[key] = params[key]; 
        });

    // 2. Ku kala sooc furayaasha xaraf ahaan (alfabeetical)
    const sortedKeys = Object.keys(dataToSign).sort();

    // 3. Dhis xarigga (string) lagu saxiixayo (value+value+...)
    // Paytrail waxay u baahan tahay in qiimayaashu lagu kala sooco +
    const payload = sortedKeys
        .map(key => dataToSign[key])
        .join('+');
    
    // 4. Ku dar Secret Key-ga xagga dambe
    const stringToSign = `${payload}+${secret}`;

    // 5. Abuur Signature-ka HMAC-SHA256
    const calculatedSignature = createHmac('sha256', secret).update(stringToSign).digest('hex');
    
    // 6. Is barbar dhig (hubi in ay yihiin lower case)
    if (calculatedSignature.toLowerCase() !== signature.toLowerCase()) {
         console.error(`Xaqiijinta Signature-ka ma saxsana:`);
         console.error(`- Xarigga la saxiixay: ${stringToSign}`);
         console.error(`- Saxiixa Server-ka: ${calculatedSignature}`);
         console.error(`- Saxiixa Paytrail: ${signature}`);
         return false;
    }

    return true;
}

/**
 * Maareeyaha POST wuxuu xaqiijinayaa lacag bixinta ka dib dib u dirista Paytrail.
 */
export async function POST(request: Request) {
    try {
        // Xogta waxaa laga helay Query Params-ka bogga guusha (la soo diray sida JSON)
        const queryParams: Record<string, string> = await request.json();

        // 1. Xaqiijinta Saxiixa (Signature)
        if (!isPaytrailSignatureValid(queryParams, SECRET_KEY)) {
            return NextResponse.json({ 
                status: 'error',
                message: 'Signature-ka xaqiijinta Paytrail ma saxsana. Xogta waa la beddelay ama lama saxiixin.' 
            }, { status: 403 }); 
        }

        // 2. Hubinta Xaaladda
        const status = queryParams['checkout-status'];
        if (status !== 'ok') {
             return NextResponse.json({ 
                status: 'error',
                message: `Lacag bixinta ma guuleysan. Xaaladda Paytrail: ${status}.` 
            }, { status: 400 });
        }
        
        // 3. Halkan waa meesha aad ku kaydiso (database) dalabkaaga sidii mid la bixiyay.
        // Tusaale: 
        // const orderId = queryParams['checkout-reference'];
        // await saveOrderAsPaid(orderId);
        
        // GUUSHA DHABTA AH
        return NextResponse.json({ 
            status: 'success', 
            message: 'Lacag bixinta si guul ah ayaa loo xaqiijiyay oo loo saxiixay Paytrail.' 
        });

    } catch (error) {
        console.error('Khalad server-ka xaqiijinta ah:', error);
        return NextResponse.json({ 
            status: 'error', 
            message: 'Khalad guud oo server-ka ah inta lagu jiray xaqiijinta.' 
        }, { status: 500 });
    }
}