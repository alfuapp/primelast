'use client';

import { useState } from 'react';
import { auth } from '../lib/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import { Mail, ArrowLeft, Loader2, KeyRound, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Salasanan palautuslinkki on lähetetty sähköpostiisi. Tarkista myös roskaposti.");
      setLoading(false);
    } catch (err: any) {
      if (err.code === 'auth/user-not-found') {
        setError("Tällä sähköpostilla ei löytynyt tiliä.");
      } else {
        setError("Virhe sähköpostin lähetyksessä. Yritä uudelleen.");
      }
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f6fb] flex flex-col items-center justify-center p-6 font-[Poppins]">
      <Link href="/login" className="mb-8 flex items-center gap-2 text-[#006d67] font-bold text-sm hover:underline italic">
        <ArrowLeft size={18} /> Takaisin kirjautumiseen
      </Link>

      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100">
        <div className="bg-[#006d67] p-8 text-center text-white">
          <div className="bg-white/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <KeyRound size={32} />
          </div>
          <h1 className="text-2xl font-black uppercase tracking-tighter italic">Palauta salasana</h1>
        </div>

        <div className="p-10 space-y-6">
          {error && <div className="bg-red-50 text-[#E63946] p-4 rounded-xl text-[10px] font-black border border-red-100 text-center uppercase italic">{error}</div>}
          
          {message ? (
            <div className="text-center space-y-6 animate-in fade-in zoom-in duration-500">
              <div className="bg-green-50 text-green-700 p-6 rounded-2xl border border-green-100">
                <CheckCircle2 size={40} className="mx-auto mb-4" />
                <p className="font-bold text-sm uppercase italic leading-relaxed">{message}</p>
              </div>
              <Link href="/login" className="block w-full bg-[#006d67] text-white py-5 rounded-2xl font-black text-sm uppercase italic shadow-lg">
                Palaa kirjautumiseen
              </Link>
            </div>
          ) : (
            <form onSubmit={handleReset} className="space-y-6">
              <p className="text-xs font-bold text-gray-500 text-center leading-relaxed uppercase italic">
                Kirjoita sähköpostiosoitteesi, niin lähetämme sinulle linkin salasanan vaihtamiseen.
              </p>
              
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase ml-2 italic">Sähköposti</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    required 
                    type="email" 
                    placeholder="esimerkki@mail.com" 
                    className="w-full p-4 pl-12 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-[#006d67] font-bold text-gray-700" 
                    onChange={(e) => setEmail(e.target.value)} 
                  />
                </div>
              </div>

              <button disabled={loading} type="submit" className="w-full bg-[#E63946] text-white py-5 rounded-2xl font-black text-lg shadow-xl hover:brightness-110 transition-all transform active:scale-95 uppercase italic flex justify-center items-center">
                {loading ? <Loader2 className="animate-spin" /> : "LÄHETÄ LINKKI →"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}