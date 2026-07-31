import { Star, Heart, Wrench, Pencil, Trash2 } from 'lucide-react';
import { Service } from '../lib/supabase';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface ServiceCardProps {
  service: Service;
  onView: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function ServiceCard({ service, onView, onEdit, onDelete }: ServiceCardProps) {
  const [rating, setRating] = useState(0);
  const [fav, setFav] = useState(false);

  useEffect(() => {
    loadRating();
  }, [service]);

  async function loadRating() {
    try {
      const { data, error } = await supabase.from('ratings').select('stars').eq('seller_id', service.user_id);
      if (error) throw error;
      if (data && data.length > 0) {
        const avg = data.reduce((sum, r) => sum + r.stars, 0) / data.length;
        setRating(parseFloat(avg.toFixed(1)));
      }
    } catch (error) {
      console.error('Error loading rating:', error);
    }
  }

  return (
    <div className="bg-white rounded-2xl overflow-hidden group cursor-pointer border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300">
      <div className="aspect-square bg-gray-50 relative overflow-hidden">
        {service.image_url ? (
          <img src={service.image_url} alt={service.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
            <Wrench className="w-12 h-12 text-blue-300" />
          </div>
        )}
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 bg-white/90 backdrop-blur text-gray-700 text-xs font-medium rounded-full shadow-sm">
            {service.category}
          </span>
        </div>
        <button onClick={(e) => { e.stopPropagation(); setFav(!fav); }} className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-sm hover:bg-white transition-colors">
          <Heart className={`w-4 h-4 transition-colors ${fav ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
        </button>
        {rating > 0 && (
          <div className="absolute bottom-3 left-3 px-2 py-1 bg-black/70 backdrop-blur text-white rounded-full flex items-center gap-1 text-xs">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <span>{rating}</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-sm text-gray-900 mb-1 line-clamp-1">{service.title}</h3>
        <p className="text-xl font-bold text-gray-900 mb-2">${service.price.toLocaleString('es-CO')}</p>
        <p className="text-xs text-gray-400 line-clamp-1 mb-3">{service.description}</p>
        <button onClick={onView} className="w-full py-2 bg-gray-50 text-gray-700 text-xs font-semibold rounded-lg hover:bg-blue-600 hover:text-white transition-all">
          Ver detalles
        </button>
        {(onEdit || onDelete) && (
          <div className="flex gap-2 mt-2">
            {onEdit && (
              <button onClick={(e) => { e.stopPropagation(); onEdit(); }} className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-gray-50 text-gray-600 text-xs font-semibold rounded-lg hover:bg-gray-100 transition-colors">
                <Pencil className="w-3.5 h-3.5" /> Editar
              </button>
            )}
            {onDelete && (
              <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-red-50 text-red-600 text-xs font-semibold rounded-lg hover:bg-red-100 transition-colors">
                <Trash2 className="w-3.5 h-3.5" /> Eliminar
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
