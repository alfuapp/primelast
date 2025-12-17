'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';

const PaymentCancelPage = () => {
    const searchParams = useSearchParams();
    const stamp = searchParams.get('stamp');
    const status = searchParams.get('checkout-status');

    let message = 'Amarkaaga lacag bixinta waa la joojiyay ama lama dhammaystirin.';
    
    if (status === 'cancel') {
        message = 'Waxaad joojisay amarka lacag bixinta Paytrail.';
    } else if (status === 'fail') {
        message = 'Lacag bixintaada ma guulaysan. Fadlan isku day mar kale.';
    }

    return (
        <div style={{ padding: '20px', textAlign: 'center', color: '#dc3545' }}>
            <h2>❌ Bixintaada Ma Dhicin</h2>
            <p>{message}</p>
            
            {stamp && (
                <p><strong>Aqoonsiga Amarka (Stamp):</strong> {stamp}</p>
            )}

            <div style={{ marginTop: '30px' }}>
                <a href="/" style={{ textDecoration: 'none', padding: '10px 20px', backgroundColor: '#6c757d', color: 'white', borderRadius: '5px' }}>
                    Ku Laabo Bogga Hore
                </a>
                <a href="/test-payment" style={{ textDecoration: 'none', padding: '10px 20px', backgroundColor: '#28a745', color: 'white', borderRadius: '5px', marginLeft: '10px' }}>
                    Isku day Mar Kale
                </a>
            </div>
        </div>
    );
};

export default PaymentCancelPage;