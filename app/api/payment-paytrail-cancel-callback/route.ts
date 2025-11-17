import { NextRequest, NextResponse } from 'next/server';
import { createHmac } from 'crypto';

// Fadhiyada wax lagu qoro iyo sirta (keys) waa in loo qeexaa deegaanka.
const PAYTRAIL_SECRET_KEY = process.env.PAYTRAIL_SECRET_KEY || 'SAK-MNA6N'; // Sirta Tijaabada
const VALID_ALGORITHMS = ['sha256', 'sha512'];

/**
 * Xisaabi Checksum Paytrail ee Dib u Celinta URL-ka (Return URL)
 */
const calculateReturnChecksum = (params: Record<string, string>, algorithm: string) => {
    if (!PAYTRAIL_SECRET_KEY) {
        throw new Error("PAYTRAIL_SECRET_KEY waa in la qeexaa");
    }

    if (!VALID_ALGORITHMS.includes(algorithm)) {
        throw new Error("Algorithm-ka la soo celiyay waa mid aan la aqoonsan: " + algorithm);
    }

    // 1. Shaandhee dhammaan xuduudaha Paytrail ee aan ahayn 'signature'
    const filteredParams: Record<string, string> = Object.keys(params)
        .filter(key => key.startsWith('checkout-') && key !== 'signature')
        .reduce((acc, key) => {
            acc[key] = params[key];
            return acc;
        }, {} as Record<string, string>);

    // 2. U kala saar furayaasha (keys) si alifbeetada ah
    const keys = Object.keys(filteredParams).sort((a, b) => a.localeCompare(b));

    // 3. Ku dar dhammaan qiimaha isku xigxiga Paytrail Secret Key
    // Qaabka: SecretKey|value1|value2|...
    const values = [PAYTRAIL_SECRET_KEY, ...keys.map(key => filteredParams[key])];
    const hmacString = values.join('|');
    
    // 4. Xisaabinta HMAC
    const hmac = createHmac(algorithm, PAYTRAIL_SECRET_KEY).update(hmacString).digest('hex');

    return hmac;
};

/**
 * Paytrail waxa uu isticmaalaa GET request si uu ugu wargeliyo server-ka.
 */
export async function GET(req: NextRequest) {
    try {
        const searchParams = req.nextUrl.searchParams;
        
        // U beddel dhammaan xuduudaha URL-ka object
        const paytrailParams: Record<string, string> = {};
        searchParams.forEach((value, key) => {
            paytrailParams[key] = value;
        });
        
        const signatureFromPaytrail = paytrailParams.signature;
        const algorithm = paytrailParams['checkout-algorithm'];

        if (!signatureFromPaytrail || !algorithm) {
            console.error("Khalad: Lama helin saxiixa (signature) ama algorithm ee xaqiijinta joojinta.");
            return new NextResponse('Lama xaqiijin karo', { status: 400 });
        }
        
        // 1. Xisaabi Checksum-ka server-ka
        const calculatedSignature = calculateReturnChecksum(paytrailParams, algorithm);

        // 2. Isbarbardhig
        const isVerified = calculatedSignature.toLowerCase() === signatureFromPaytrail.toLowerCase();

        if (isVerified) {
            // Paytrail wuxuu xaqiijiyay joojinta
            const reference = paytrailParams['checkout-reference'];
            console.log(`Paytrail Checksum-ka waa la xaqiijiyay. Dalabka ${reference} waa la joojiyay.`);
            
            // TALLAABADA MUHIIMKA AH: Halkan waxaad ku calaamadayn lahayd dalabka database-ka sidii 'Canceled' ama 'Failed'.
            
            // Xaqiiji Paytrail in farriinta la helay.
            return new NextResponse('OK', { status: 200 });

        } else {
            console.error("Khalad Checksum: Saxiixa Paytrail ma iswaafaqo joojinta.");
            // Hubi in aad 403 ku celiso si Paytrail uu dib u tijaabiyo (retry).
            return new NextResponse('Xaqiijinta way fashilantay', { status: 403 });
        }

    } catch (error: any) {
        console.error("Khalad guud ee joojinta Paytrail:", error);
        // Hubi in aad 500 ku celiso si Paytrail uu dib u tijaabiyo (retry).
        return new NextResponse('Khalad Server', { status: 500 });
    }
}