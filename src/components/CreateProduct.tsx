import { useState, useEffect, useRef } from 'react';
import { X, Upload, Camera, Tag, DollarSign, FileText, Package } from 'lucide-react';
import { supabase, Product } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface CreateProductProps {
  product?: Product | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateProduct({ product, onClose, onSuccess }: CreateProductProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('libros');
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const categories = [
    { id: 'libros', label: 'Libros' },
    { id: 'electronica', label: 'Electrónica' },
    { id: 'materiales', label: 'Materiales' },
    { id: 'ropa', label: 'Ropa y Accesorios' },
    { id: 'deportes', label: 'Deportes' },
    { id: 'muebles', label: 'Muebles' },
    { id: 'instrumentos', label: 'Instrumentos' },
    { id: 'juegos', label: 'Juegos y Hobbies' },
    { id: 'transporte', label: 'Transporte' },
    { id: 'otros', label: 'Otros' },
  ];

  useEffect(() => {
    if (product) {
      setTitle(product.title); setDescription(product.description); setPrice(product.price.toString());
      setCategory(product.category); setImageUrl(product.image_url); setImagePreview(product.image_url);
    }
  }, [product]);

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  }

  async function uploadImage(file: File): Promise<string> {
    try {
      const ext = file.name.split('.').pop();
      const fileName = `${user?.id}-${Date.now()}.${ext}`;
      const filePath = `products/${fileName}`;
      const { error: uploadError } = await supabase.storage.from('products').upload(filePath, file);
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from('products').getPublicUrl(filePath);
      return data.publicUrl;
    } catch (err: any) { throw new Error(err.message || 'Error al subir la imagen'); }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      let finalImageUrl = imageUrl;
      if (imageFile) { setUploading(true); finalImageUrl = await uploadImage(imageFile); setUploading(false); }
      const productData = { title, description, price: parseFloat(price), category, image_url: finalImageUrl, user_id: user?.id, updated_at: new Date().toISOString() };
      if (product) {
        const { error: updateError } = await supabase.from('products').update(productData).eq('id', product.id);
        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase.from('products').insert([productData]);
        if (insertError) throw insertError;
      }
      onSuccess();
    } catch (err: any) { setError(err.message || 'Error al guardar el producto.'); console.error('Error:', err); }
    finally { setLoading(false); }
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-in shadow-2xl">
        <div className="sticky top-0 bg-white/95 backdrop-blur border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-base font-semibold text-gray-900">{product ? 'Editar producto' : 'Publicar producto'}</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && <div className="px-4 py-3 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm">{error}</div>}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5"><Package className="w-3.5 h-3.5 inline mr-1" />Título</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ej: Libro de Programación en Java" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-green-500/20 focus:border-green-500 focus:bg-white outline-none transition-all" required />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5"><FileText className="w-3.5 h-3.5 inline mr-1" />Descripción</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe tu producto..." rows={4} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-green-500/20 focus:border-green-500 focus:bg-white outline-none transition-all resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5"><DollarSign className="w-3.5 h-3.5 inline mr-1" />Precio (COP)</label>
              <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="50000" min="0" step="1000" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-green-500/20 focus:border-green-500 focus:bg-white outline-none transition-all" required />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5"><Tag className="w-3.5 h-3.5 inline mr-1" />Categoría</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-green-500/20 focus:border-green-500 focus:bg-white outline-none transition-all" required>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Imagen</label>
            {imagePreview && (
              <div className="mb-3 relative">
                <img src={imagePreview} alt="Preview" className="w-full h-40 object-cover rounded-xl" />
                <button type="button" onClick={() => { setImageFile(null); setImagePreview(''); setImageUrl(''); }} className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
            <div className="grid grid-cols-2 gap-2 mb-3">
              <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading} className="flex items-center justify-center gap-2 px-4 py-2.5 border-2 border-dashed border-gray-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition-colors text-sm text-gray-600 disabled:opacity-50">
                <Upload className="w-4 h-4" /> Galería
              </button>
              <button type="button" onClick={() => cameraInputRef.current?.click()} disabled={uploading} className="flex items-center justify-center gap-2 px-4 py-2.5 border-2 border-dashed border-gray-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition-colors text-sm text-gray-600 disabled:opacity-50">
                <Camera className="w-4 h-4" /> Cámara
              </button>
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
            <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" onChange={handleFileSelect} className="hidden" />
            <input type="url" value={imageUrl} onChange={(e) => { setImageUrl(e.target.value); if (!imageFile) setImagePreview(e.target.value); }} placeholder="O pega una URL de imagen" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-green-500/20 focus:border-green-500 focus:bg-white outline-none transition-all" />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-6 py-3 border border-gray-200 rounded-xl font-medium text-gray-700 text-sm hover:bg-gray-50 transition-colors">Cancelar</button>
            <button type="submit" disabled={loading || uploading} className="flex-1 bg-green-600 text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              {uploading ? 'Subiendo...' : loading ? 'Guardando...' : product ? 'Actualizar' : 'Publicar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
