import { useState, useEffect } from 'react';
import { X, Phone, MessageCircle, Star, Calendar } from 'lucide-react';
import { Food, Rating } from '../lib/supabase';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface FoodDetailProps {
  food: Food;
  onClose: () => void;
}

const categoryLabels: Record<string, string> = {
  snacks: 'Snacks', comidas: 'Comidas', bebidas: 'Bebidas', postres: 'Postres', otro: 'Otro',
};

export default function FoodDetail({ food, onClose }: FoodDetailProps) {
  const [showContactForm, setShowContactForm] = useState(false);
  const [showRatingForm, setShowRatingForm] = useState(false);
  const [sellerRatings, setSellerRatings] = useState<Rating[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingRating, setSubmittingRating] = useState(false);
  const { user } = useAuth();

  useEffect(() => { loadSellerRatings(); }, [food]);

  async function loadSellerRatings() {
    try {
      const { data, error } = await supabase.from('ratings').select('*').eq('seller_id', food.user_id).order('created_at', { ascending: false });
      if (error) throw error;
      setSellerRatings(data || []);
      if (data && data.length > 0) setAverageRating(parseFloat((data.reduce((s, r) => s + r.stars, 0) / data.length).toFixed(1)));
    } catch (e) { console.error(e); }
  }

  async function handleSubmitRating() {
    if (!user) return;
    setSubmittingRating(true);
    try {
      const { error } = await supabase.from('ratings').insert([{ seller_id: food.user_id, buyer_id: user.id, product_id: food.id, stars: rating, comment }]);
      if (error) throw error;
      setShowRatingForm(false); setComment(''); setRating(5);
      await loadSellerRatings();
    } catch (e) { console.error(e); alert('Error al enviar la calificación'); }
    finally { setSubmittingRating(false); }
  }

  function handleContact() {
    const msg = `Hola, estoy interesado en tu alimento "${food.title}". ¿Está disponible?`;
    const phone = food.profiles?.phone.replace(/\D/g, '');
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-in shadow-2xl">
        <div className="sticky top-0 bg-white/95 backdrop-blur border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-base font-semibold text-gray-900">Detalle del alimento</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">
          <div className="aspect-video bg-gray-50 rounded-2xl mb-6 overflow-hidden">
            {food.image_url ? (
              <img src={food.image_url} alt={food.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center">
                <span className="text-6xl font-bold text-amber-200">{food.title.charAt(0)}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 mb-3">
            <span className="px-2.5 py-1 bg-amber-50 text-amber-700 text-xs font-medium rounded-full">{categoryLabels[food.category] || food.category}</span>
            <div className="flex items-center text-xs text-gray-400">
              <Calendar className="w-3.5 h-3.5 mr-1" />
              {new Date(food.created_at).toLocaleDateString('es-CO')}
            </div>
          </div>

          <h3 className="text-2xl font-bold text-gray-900 mb-2">{food.title}</h3>
          <p className="text-3xl font-bold text-gray-900 mb-4">${food.price.toLocaleString('es-CO')}</p>

          {food.description && (
            <div className="mb-6">
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Descripción</h4>
              <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">{food.description}</p>
            </div>
          )}

          <div className="border-t border-gray-100 pt-4 mb-6">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Vendedor</h4>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={food.profiles?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(food.profiles?.full_name || 'U')}&background=16a34a&color=fff&size=128`} alt={food.profiles?.full_name} className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{food.profiles?.full_name}</p>
                  <p className="text-xs text-gray-400">{food.profiles?.email}</p>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {food.profiles?.career && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-50 text-green-700 text-[10px] font-medium rounded-full">{food.profiles.career}</span>
                    )}
                    {food.profiles?.semester && (
                      <span className="inline-flex items-center px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-medium rounded-full">Semestre {food.profiles.semester}</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-0.5 justify-end mb-0.5">
                  {[...Array(5)].map((_, i) => <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(averageRating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />)}
                </div>
                <p className="text-xs text-gray-400">{averageRating > 0 ? `${averageRating} (${sellerRatings.length})` : 'Sin calificaciones'}</p>
              </div>
            </div>
          </div>

          <div className="flex gap-3 mb-4">
            <button onClick={() => setShowContactForm(!showContactForm)} className="flex-1 bg-green-600 text-white py-3 rounded-xl font-semibold text-sm hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
              <MessageCircle className="w-4.5 h-4.5" /> Contactar
            </button>
            <button onClick={() => setShowRatingForm(!showRatingForm)} className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold text-sm hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
              <Star className="w-4.5 h-4.5" /> Calificar
            </button>
          </div>

          {showContactForm && (
            <div className="bg-gray-50 p-4 rounded-xl mb-4 animate-slide-down">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Información de contacto</h4>
              <div className="flex items-center gap-2 mb-4">
                <Phone className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">{food.profiles?.phone}</span>
              </div>
              <button onClick={handleContact} className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold text-sm hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
                <MessageCircle className="w-4.5 h-4.5" /> Enviar por WhatsApp
              </button>
            </div>
          )}

          {showRatingForm && (
            <div className="bg-gray-50 p-4 rounded-xl mb-4 animate-slide-down">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Calificar vendedor</h4>
              <div className="flex gap-2 mb-4">
                {[1,2,3,4,5].map((s) => <button key={s} onClick={() => setRating(s)} className="transition-transform hover:scale-110"><Star className={`w-7 h-7 ${s <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} /></button>)}
              </div>
              <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Comparte tu experiencia..." rows={3} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none resize-none mb-3" />
              <button onClick={handleSubmitRating} disabled={submittingRating} className="w-full bg-gray-900 text-white py-2.5 rounded-xl font-semibold text-sm hover:bg-gray-800 transition-colors disabled:opacity-50">
                {submittingRating ? 'Enviando...' : 'Enviar calificación'}
              </button>
            </div>
          )}

          {sellerRatings.length > 0 && (
            <div className="bg-gray-50 p-4 rounded-xl">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Calificaciones ({sellerRatings.length})</h4>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {sellerRatings.map((r) => (
                  <div key={r.id} className="bg-white p-3 rounded-xl">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex gap-0.5">{[...Array(5)].map((_, i) => <Star key={i} className={`w-3 h-3 ${i < r.stars ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />)}</div>
                      <span className="text-xs text-gray-400">{new Date(r.created_at).toLocaleDateString('es-CO')}</span>
                    </div>
                    {r.comment && <p className="text-sm text-gray-600">{r.comment}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
