import { useState } from 'react';
import { ShoppingBag, User, Mail, Phone, Lock, ShieldCheck, X, FileText, ArrowRight, Check, Eye, EyeOff, Sparkles, Users, TrendingUp, GraduationCap, BookOpen } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface RegisterProps {
  onSwitchToLogin: () => void;
}

const ALLOWED_DOMAIN = '@unipacifico.edu.co';

const CAREERS = [
  'Administración de Negocios Internacionales',
  'Agronomía',
  'Sociología',
  'Arquitectura',
  'Ingeniería Civil',
  'Ingeniería de Sistemas',
  'Turismo',
  'Tecnología en Construcciones Civiles',
  'Tecnología en Producción Piscícola',
];

const SEMESTERS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '10+'];

export default function Register({ onSwitchToLogin }: RegisterProps) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [career, setCareer] = useState('');
  const [semester, setSemester] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showConsent, setShowConsent] = useState(false);
  const [acceptedConsent, setAcceptedConsent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { signUp } = useAuth();

  function isAllowedEmail(value: string) {
    return value.trim().toLowerCase().endsWith(ALLOWED_DOMAIN);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!isAllowedEmail(email)) {
      setError('El correo ingresado no es válido para el registro.');
      return;
    }
    if (!career) {
      setError('Selecciona tu carrera.');
      return;
    }
    if (!semester) {
      setError('Selecciona tu semestre.');
      return;
    }
    setLoading(true);
    try {
      await signUp(email, password, fullName, phone, career, semester);
    } catch (err) {
      setError('Error al crear la cuenta. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl grid lg:grid-cols-2 rounded-3xl overflow-hidden shadow-2xl bg-white my-4">
        {/* Left visual panel */}
        <div className="hidden lg:block relative bg-gradient-to-br from-green-700 via-green-600 to-emerald-800 p-12 overflow-hidden">
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-emerald-400/30 rounded-full blur-3xl" />
          <div className="absolute -bottom-32 -left-16 w-80 h-80 bg-green-400/20 rounded-full blur-3xl" />
          <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: 'radial-gradient(circle at 20% 80%, white 1.5px, transparent 1.5px)', backgroundSize: '28px 28px' }} />

          <div className="relative flex flex-col h-full justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-white rounded-2xl flex items-center justify-center shadow-lg">
                <ShoppingBag className="w-5 h-5 text-green-600" />
              </div>
              <span className="text-white text-xl font-bold tracking-tight">CampusMarket</span>
            </div>

            <div className="my-8">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/15 backdrop-blur rounded-full text-white text-xs font-medium mb-6 border border-white/20">
                <Sparkles className="w-3.5 h-3.5" />
                Universidad del Pacífico
              </div>
              <h2 className="text-white text-4xl font-bold leading-[1.1] mb-4 tracking-tight">
                Únete a la comunidad estudiantil.
              </h2>
              <p className="text-green-50/90 text-base leading-relaxed max-w-sm">
                Publica productos, ofrece servicios, vende alimentos y conecta con otros estudiantes.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-8">
              {[
                { icon: Users, t: 'Comunidad', d: 'Solo estudiantes' },
                { icon: TrendingUp, t: 'Sin comisiones', d: 'Vende sin extras' },
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
          <div className="w-full max-w-[420px]">
            <div className="lg:hidden flex items-center gap-2.5 mb-8 justify-center">
              <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 tracking-tight">CampusMarket</span>
            </div>

            <div className="mb-7">
              <h1 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">Crea tu cuenta</h1>
              <p className="text-gray-500 text-sm">Regístrate para empezar a comprar y vender</p>
            </div>

            {error && (
              <div className="mb-5 px-4 py-3 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">Nombre completo</label>
                <div className="relative group">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-green-600 transition-colors" />
                  <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="" className="w-full pl-10 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-4 focus:ring-green-500/10 focus:border-green-500 focus:bg-white outline-none transition-all" required />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">Correo institucional</label>
                <div className="relative group">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-green-600 transition-colors" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder=""
                    className={`w-full pl-10 pr-4 py-3.5 bg-gray-50 border rounded-xl text-sm focus:ring-4 focus:ring-green-500/10 focus:bg-white outline-none transition-all ${
                      email && !isAllowedEmail(email) ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-green-500'
                    }`}
                    required
                  />
                </div>
                {email && !isAllowedEmail(email) && (
                  <p className="mt-1.5 text-xs text-red-500">El correo ingresado no es válido para el registro.</p>
                )}
                {email && isAllowedEmail(email) && (
                  <p className="mt-1.5 text-xs text-green-600 flex items-center gap-1">
                    <Check className="w-3 h-3" /> Correo válido
                  </p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">Carrera</label>
                  <div className="relative group">
                    <GraduationCap className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-green-600 transition-colors pointer-events-none" />
                    <select value={career} onChange={(e) => setCareer(e.target.value)} className="w-full pl-10 pr-3 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-4 focus:ring-green-500/10 focus:border-green-500 focus:bg-white outline-none transition-all appearance-none" required>
                      <option value="" disabled>Selecciona</option>
                      {CAREERS.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">Semestre</label>
                  <div className="relative group">
                    <BookOpen className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-green-600 transition-colors pointer-events-none" />
                    <select value={semester} onChange={(e) => setSemester(e.target.value)} className="w-full pl-10 pr-3 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-4 focus:ring-green-500/10 focus:border-green-500 focus:bg-white outline-none transition-all appearance-none" required>
                      <option value="" disabled>Selecciona</option>
                      {SEMESTERS.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">Número de contacto</label>
                <div className="relative group">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-green-600 transition-colors" />
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="" className="w-full pl-10 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-4 focus:ring-green-500/10 focus:border-green-500 focus:bg-white outline-none transition-all" required />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">Contraseña</label>
                <div className="relative group">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-green-600 transition-colors" />
                  <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="" className="w-full pl-10 pr-11 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-4 focus:ring-green-500/10 focus:border-green-500 focus:bg-white outline-none transition-all" required minLength={6} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-start gap-3 px-4 py-3.5 bg-green-50/60 border border-green-100 rounded-xl">
                <button type="button" onClick={() => setAcceptedConsent(!acceptedConsent)} className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${acceptedConsent ? 'bg-green-600 border-green-600' : 'border-gray-300 hover:border-green-500 bg-white'}`}>
                  {acceptedConsent && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                </button>
                <p className="text-sm text-gray-600 leading-relaxed">
                  He leído y acepto el{' '}
                  <button type="button" onClick={() => setShowConsent(true)} className="text-green-600 hover:text-green-700 font-semibold underline underline-offset-2">
                    aviso de tratamiento de datos personales
                  </button>
                  .
                </p>
              </div>

              <button type="submit" disabled={loading || !acceptedConsent} className="w-full bg-green-600 text-white py-3.5 rounded-xl font-semibold text-sm hover:bg-green-700 hover:shadow-lg hover:shadow-green-600/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2">
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Registrando...
                  </span>
                ) : (
                  <>
                    Registrarse
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-100">
              <p className="text-center text-sm text-gray-500">
                ¿Ya tienes cuenta?{' '}
                <button onClick={onSwitchToLogin} className="text-green-600 font-semibold hover:text-green-700 transition-colors">
                  Inicia sesión
                </button>
              </p>
            </div>
          </div>
        </div>

        {/* Consent modal */}
        {showConsent && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-white rounded-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto animate-scale-in shadow-2xl">
              <div className="sticky top-0 bg-white/95 backdrop-blur border-b border-gray-100 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
                    <ShieldCheck className="w-4.5 h-4.5 text-green-600" />
                  </div>
                  <h2 className="text-base font-semibold text-gray-900">Tratamiento de Datos Personales</h2>
                </div>
                <button onClick={() => setShowConsent(false)} className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-5 text-sm text-gray-600 leading-relaxed">
                {[
                  { t: 'Responsable del Tratamiento', d: 'CampusMarket de la Universidad del Pacífico, con sede en Buenaventura, Colombia, es responsable del tratamiento de sus datos personales en cumplimiento de la Ley 1581 de 2012 y el Decreto 1377 de 2013.' },
                  { t: 'Datos Recopilados', d: 'Nombre completo, correo institucional y número de contacto, proporcionados voluntariamente por el usuario al momento del registro.' },
                  { t: 'Finalidad', d: 'Facilitar la compra y venta entre estudiantes, permitir contacto vía WhatsApp, mostrar calificaciones y gestionar el perfil de usuario.' },
                  { t: 'Autorización', d: 'Al aceptar, el usuario autoriza de manera expresa, voluntaria e informada el tratamiento de sus datos personales para los fines descritos.' },
                  { t: 'Derechos del Titular', d: 'Acceder, conocer, actualizar y rectificar sus datos; solicitar eliminación; revocar la autorización del tratamiento.' },
                  { t: 'Protección y Vigencia', d: 'Se implementan medidas técnicas y administrativas para proteger sus datos. Se conservan mientras la cuenta esté activa.' },
                ].map((s, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-green-50 rounded-md flex items-center justify-center mt-0.5">
                      <FileText className="w-3.5 h-3.5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-0.5">{s.t}</h3>
                      <p>{s.d}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex gap-3">
                <button onClick={() => setShowConsent(false)} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl font-medium text-gray-700 text-sm hover:bg-gray-50 transition-colors">
                  Cancelar
                </button>
                <button onClick={() => { setAcceptedConsent(true); setShowConsent(false); }} className="flex-1 bg-green-600 text-white px-4 py-2.5 rounded-xl font-semibold text-sm hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
                  <ShieldCheck className="w-4 h-4" />
                  Aceptar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
