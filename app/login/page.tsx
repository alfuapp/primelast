'use client';
import { useState, useEffect } from 'react';
import { auth } from '../lib/firebase';
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { Mail, Lock, LogIn, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace('/services'); 
    } catch (err: any) {
      setError("Väärä sähköpostiosoite tai salasana.");
      setLoading(false);
    }
  };

  if (checkingAuth) return <div className="min-h-screen flex items-center justify-center bg-[#f4f6fb]"><Loader2 className="animate-spin text-[#006d67]" size={48} /></div>;

  return (
    <div className="min-h-screen bg-[#f4f6fb] flex flex-col items-center justify-center p-6 font-[Poppins]">
      <Link href="/" className="mb-8 flex items-center gap-2 text-[#006d67] font-bold text-sm hover:underline italic"><ArrowLeft size={18} /> Takaisin etusivulle</Link>
      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100">
        <div className="bg-[#006d67] p-8 text-center text-white">
          <div className="bg-white/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"><LogIn size={32} /></div>
          <h1 className="text-2xl font-black uppercase tracking-tighter italic">Kirjaudu sisään</h1>
        </div>
        <div className="p-10 space-y-6">
          {error && <div className="bg-red-50 text-[#E63946] p-4 rounded-xl text-xs font-bold border border-red-100 text-center uppercase italic">{error}</div>}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase ml-2 italic">Sähköposti</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input required type="email" placeholder="esimerkki@mail.fi" className="w-full p-4 pl-12 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-[#006d67] font-bold text-gray-700" onChange={(e) => setEmail(e.target.value)} />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase ml-2 italic">Salasana</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input required type="password" placeholder="••••••••" className="w-full p-4 pl-12 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-[#006d67] font-bold text-gray-700" onChange={(e) => setPassword(e.target.value)} />
              </div>
            </div>
            <button disabled={loading} type="submit" className="w-full bg-[#006d67] text-white py-5 rounded-2xl font-black text-lg shadow-xl hover:bg-[#005a54] transition-all transform active:scale-95 uppercase italic mt-4 flex justify-center items-center">
              {loading ? <Loader2 className="animate-spin" /> : "KIRJAUDU SISÄÄN →"}
            </button>
          </form>
          <div className="text-center">
            <p className="text-xs font-bold text-gray-400 uppercase italic mb-4">Eikö sinulla ole tiliä?</p>
            <Link href="/register" className="block w-full border-2 border-[#E63946] text-[#E63946] py-4 rounded-2xl font-black text-sm hover:bg-[#E63946] hover:text-white transition-all uppercase italic">Rekisteröidy tästä</Link>
          </div>
        </div>
      </div>
    </div>
  );
}