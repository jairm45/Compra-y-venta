import { useState } from 'react';
import { ShoppingBag, Mail, Lock, ArrowRight, Eye, EyeOff, Sparkles, ShieldCheck, TrendingUp } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface LoginProps {
  onSwitchToRegister: () => void;
}

export default function Login({ onSwitchToRegister }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { signIn } = useAuth();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signIn(email, password);
    } catch (err: any) {
      setError('Correo o contraseña incorrectos.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl grid lg:grid-cols-2 rounded-3xl overflow-hidden shadow-2xl bg-white my-4">
        {/* Left visual panel */}
        <div className="hidden lg:block relative bg-gradient-to-br from-green-700 via-green-600 to-emerald-800 p-12 overflow-hidden">
          {/* Decorative blobs */}
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-emerald-400/30 rounded-full blur-3xl" />
          <div className="absolute -bottom-32 -left-16 w-80 h-80 bg-green-400/20 rounded-full blur-3xl" />
          <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: 'radial-gradient(circle at 20% 80%, white 1.5px, transparent 1.5px)', backgroundSize: '28px 28px' }} />

          <div className="relative flex flex-col h-full justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-white rounded-2xl flex items-center justify-center shadow-lg">
                <ShoppingBag className="w-5 h-5 text-green-600" />
              </div>
              <span className="text-white text-xl font-bold tracking-tight">CampusMarket</span>
            </div>

            {/* Hero */}
            <div className="my-8">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/15 backdrop-blur rounded-full text-white text-xs font-medium mb-6 border border-white/20">
                <Sparkles className="w-3.5 h-3.5" />
                Universidad del Pacífico
              </div>
              <h2 className="text-white text-4xl font-bold leading-[1.1] mb-4 tracking-tight">
                Compra y venta entre estudiantes.
              </h2>
              <p className="text-green-50/90 text-base leading-relaxed max-w-sm">
                Productos de segunda mano, materiales académicos, tecnología, alimentos y mucho más.
              </p>
            </div>

            {/* Feature cards */}
            <div className="grid grid-cols-2 gap-3 mb-8">
              {[
                { icon: TrendingUp, t: 'Sin comisiones', d: 'Vende sin pagar extras' },
                { icon: ShieldCheck, t: 'Seguro', d: 'Solo estudiantes' },
              ].map((f, i) => (
                <div key={i} className="bg-white/10 backdrop-blur border border-white/15 rounded-2xl p-4">
                  <div className="w-9 h-9 bg-white/15 rounded-xl flex items-center justify-center mb-3">
                    <f.icon className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-white font-semibold text-sm mb-0.5">{f.t}</p>
                  <p className="text-green-50/70 text-xs">{f.d}</p>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6 text-green-50 text-sm pt-6 border-t border-white/15">
              <div>
                <p className="text-2xl font-bold text-white">500+</p>
                <p className="text-green-50/70">Productos</p>
              </div>
              <div className="w-px h-10 bg-white/20" />
              <div>
                <p className="text-2xl font-bold text-white">100%</p>
                <p className="text-green-50/70">Estudiantes</p>
              </div>
              <div className="w-px h-10 bg-white/20" />
              <div>
                <p className="text-2xl font-bold text-white">0%</p>
                <p className="text-green-50/70">Comisión</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right form panel */}
        <div className="flex items-center justify-center p-8 sm:p-12">
          <div className="w-full max-w-[400px]">
            {/* Mobile logo */}
            <div className="lg:hidden flex items-center gap-2.5 mb-10 justify-center">
              <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 tracking-tight">CampusMarket</span>
            </div>

            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">Bienvenido de nuevo</h1>
              <p className="text-gray-500 text-sm">Ingresa a tu cuenta para continuar</p>
            </div>

            {error && (
              <div className="mb-5 px-4 py-3 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                  Correo
                </label>
                <div className="relative group">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-green-600 transition-colors" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder=""
                    className="w-full pl-10 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-4 focus:ring-green-500/10 focus:border-green-500 focus:bg-white outline-none transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                  Contraseña
                </label>
                <div className="relative group">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-green-600 transition-colors" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-11 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-4 focus:ring-green-500/10 focus:border-green-500 focus:bg-white outline-none transition-all"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 text-white py-3.5 rounded-xl font-semibold text-sm hover:bg-green-700 hover:shadow-lg hover:shadow-green-600/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Iniciando sesión...
                  </span>
                ) : (
                  <>
                    Iniciar sesión
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-100">
              <p className="text-center text-sm text-gray-500">
                ¿No tienes cuenta?{' '}
                <button onClick={onSwitchToRegister} className="text-green-600 font-semibold hover:text-green-700 transition-colors">
                  Regístrate
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
