'use client';

import { useState } from 'react';
import { auth } from '../lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { Mail, Lock, LogIn, ArrowLeft, Loader2, KeyRound, Eye, EyeOff } from 'lucide-react'; // ⭐ Waxaan ku darnay Eye iyo EyeOff
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // ⭐ State-ka isha
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/services');
    } catch (err: any) {
      setError("Kirjautuminen epäonnistui. Tarkista sähköposti ja salasana.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f6fb] flex flex-col items-center justify-center p-6 font-[Poppins]">
      <Link href="/" className="mb-8 flex items-center gap-2 text-[#006d67] font-bold text-sm hover:underline italic">
        <ArrowLeft size={18} /> Takaisin etusivulle
      </Link>

      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100">
        <div className="bg-[#006d67] p-8 text-center text-white">
          <div className="bg-white/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <LogIn size={32} />
          </div>
          <h1 className="text-2xl font-black uppercase tracking-tighter italic">Kirjaudu sisään</h1>
        </div>

        <div className="p-10 space-y-6">
          {error && <div className="bg-red-50 text-[#E63946] p-4 rounded-xl text-xs font-bold border border-red-100 text-center uppercase italic">{error}</div>}

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase ml-2 italic">Sähköposti</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input required type="email" placeholder="esimerkki@mail.com" className="w-full p-4 pl-12 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-[#006d67] font-bold text-gray-700" onChange={(e) => setEmail(e.target.value)} />
              </div>
            </div>

            {/* Password Field oo leh ISHA */}
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase ml-2 italic">Salasana</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                
                {/* ⭐ Halkan waa isbeddelka: type-ka wuxuu isu beddelayaa 'text' ama 'password' */}
                <input 
                  required 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••" 
                  className="w-full p-4 pl-12 pr-12 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-[#006d67] font-bold text-gray-700" 
                  onChange={(e) => setPassword(e.target.value)} 
                />

                {/* ⭐ Badhanka Isha */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#006d67] transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button disabled={loading} type="submit" className="w-full bg-[#006d67] text-white py-5 rounded-2xl font-black text-lg shadow-xl hover:bg-black transition-all transform active:scale-95 uppercase italic mt-4 flex justify-center items-center">
              {loading ? <Loader2 className="animate-spin" /> : "KIRJAUDU SISÄÄN →"}
            </button>
          </form>

          <div className="space-y-4 pt-4 border-t border-gray-100">
            <Link href="/forgot-password" title="Palauta salasana" className="w-full text-center text-[10px] font-black text-gray-400 uppercase hover:text-[#E63946] transition-colors italic flex items-center justify-center gap-2">
              <KeyRound size={14} /> Unohtuiko salasana? Palauta se tästä
            </Link>

            <div className="text-center">
              <p className="text-xs font-bold text-gray-400 uppercase italic mb-3">Eikö sinulla ole tiliä?</p>
              <Link href="/register" className="block w-full border-2 border-[#006d67] text-[#006d67] py-4 rounded-2xl font-black text-sm hover:bg-[#006d67] hover:text-white transition-all uppercase italic text-center">
                Luo uusi tili
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}