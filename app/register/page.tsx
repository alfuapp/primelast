'use client';
import { useState, useEffect } from 'react';
import { auth } from '../lib/firebase';
import { createUserWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { Mail, Lock, UserPlus, ArrowLeft, Loader2, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true); 
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.replace('/services');
      } else {
        setCheckingAuth(false);
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.replace('/services'); 
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        setError("Tämä sähköposti on jo käytössä.");
      } else if (err.code === 'auth/weak-password') {
        setError("Salasanan on oltava vähintään 6 merkkiä.");
      } else {
        setError("Rekisteröinti epäonnistui.");
      }
      setLoading(false);
    }
  };

  if (checkingAuth) return <div className="min-h-screen flex items-center justify-center bg-[#f4f6fb]"><Loader2 className="animate-spin text-[#006d67]" size={48} /></div>;

  return (
    <div className="min-h-screen bg-[#f4f6fb] flex flex-col items-center justify-center p-6 font-[Poppins]">
      <Link href="/" className="mb-8 flex items-center gap-2 text-[#006d67] font-bold text-sm hover:underline italic"><ArrowLeft size={18} /> Takaisin etusivulle</Link>
      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100">
        <div className="bg-[#006d67] p-8 text-center text-white">
          <div className="bg-white/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"><UserPlus size={32} /></div>
          <h1 className="text-2xl font-black uppercase tracking-tighter italic">Luo uusi tili</h1>
        </div>
        <div className="p-10 space-y-6">
          {error && <div className="bg-red-50 text-[#E63946] p-4 rounded-xl text-xs font-bold border border-red-100 text-center uppercase italic">{error}</div>}
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase ml-2 italic">Sähköposti</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input required type="email" placeholder="esimerkki@mail.com" className="w-full p-4 pl-12 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-[#006d67] font-bold text-gray-700" onChange={(e) => setEmail(e.target.value)} />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase ml-2 italic">Salasana</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input required type="password" placeholder="••••••••" className="w-full p-4 pl-12 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-[#006d67] font-bold text-gray-700" onChange={(e) => setPassword(e.target.value)} />
              </div>
            </div>
            <button disabled={loading} type="submit" className="w-full bg-[#E63946] text-white py-5 rounded-2xl font-black text-lg shadow-xl hover:bg-[#c82f3b] transition-all transform active:scale-95 uppercase italic mt-4 flex justify-center items-center">
              {loading ? <Loader2 className="animate-spin" /> : "REKISTERÖIDY NYT →"}
            </button>
          </form>
          <div className="text-center">
            <p className="text-xs font-bold text-gray-400 uppercase italic mb-4">Onko sinulla jo tili?</p>
            <Link href="/login" className="block w-full border-2 border-[#006d67] text-[#006d67] py-4 rounded-2xl font-black text-sm hover:bg-[#006d67] hover:text-white transition-all uppercase italic">Kirjaudu sisään</Link>
          </div>
        </div>
      </div>
    </div>
  );
}