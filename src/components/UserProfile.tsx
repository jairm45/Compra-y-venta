import { useState, useEffect } from 'react';
import { ShoppingBag, Plus, ArrowLeft, Upload, Star, Wrench, UtensilsCrossed, LogOut, CreditCard as Edit2, Trash2, GraduationCap, BookOpen } from 'lucide-react';
import { supabase, Product, Rating, Service, Food } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import ProductCard from './ProductCard';
import CreateProduct from './CreateProduct';
import ProductDetail from './ProductDetail';
import ServiceCard from './ServiceCard';
import ServiceDetail from './ServiceDetail';
import CreateService from './CreateService';
import FoodCard from './FoodCard';
import FoodDetail from './FoodDetail';
import CreateFood from './CreateFood';

type Tab = 'products' | 'services' | 'foods';

interface UserProfileProps {
  onNavigateToSearch: () => void;
}

export default function UserProfile({ onNavigateToSearch }: UserProfileProps) {
  const [tab, setTab] = useState<Tab>('products');
  const [myProducts, setMyProducts] = useState<Product[]>([]);
  const [myServices, setMyServices] = useState<Service[]>([]);
  const [myFoods, setMyFoods] = useState<Food[]>([]);
  const [showCreateProduct, setShowCreateProduct] = useState(false);
  const [showCreateService, setShowCreateService] = useState(false);
  const [showCreateFood, setShowCreateFood] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [editingFood, setEditingFood] = useState<Food | null>(null);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, profile, signOut } = useAuth();

  useEffect(() => { loadAllData(); }, [user]);

  async function loadAllData() {
    setLoading(true);
    try {
      const [productsRes, servicesRes, foodsRes, ratingsRes] = await Promise.all([
        supabase.from('products').select('*, profiles(*)').eq('user_id', user?.id).order('created_at', { ascending: false }),
        supabase.from('services').select('*, profiles(*)').eq('user_id', user?.id).order('created_at', { ascending: false }),
        supabase.from('foods').select('*, profiles(*)').eq('user_id', user?.id).order('created_at', { ascending: false }),
        supabase.from('ratings').select('*').eq('seller_id', user?.id).order('created_at', { ascending: false }),
      ]);
      if (productsRes.error) throw productsRes.error;
      if (servicesRes.error) throw servicesRes.error;
      if (foodsRes.error) throw foodsRes.error;
      if (ratingsRes.error) throw ratingsRes.error;
      setMyProducts(productsRes.data || []);
      setMyServices(servicesRes.data || []);
      setMyFoods(foodsRes.data || []);
      setRatings(ratingsRes.data || []);
    } catch (error) { console.error('Error loading data:', error); }
    finally { setLoading(false); }
  }

  async function handleDeleteProduct(id: string) {
    if (!confirm('¿Eliminar este producto?')) return;
    try { const { error } = await supabase.from('products').delete().eq('id', id); if (error) throw error; await loadAllData(); }
    catch (e) { console.error(e); alert('Error al eliminar'); }
  }
  async function handleDeleteService(id: string) {
    if (!confirm('¿Eliminar este servicio?')) return;
    try { const { error } = await supabase.from('services').delete().eq('id', id); if (error) throw error; await loadAllData(); }
    catch (e) { console.error(e); alert('Error al eliminar'); }
  }
  async function handleDeleteFood(id: string) {
    if (!confirm('¿Eliminar este alimento?')) return;
    try { const { error } = await supabase.from('foods').delete().eq('id', id); if (error) throw error; await loadAllData(); }
    catch (e) { console.error(e); alert('Error al eliminar'); }
  }

  function handleProductCreated() { setShowCreateProduct(false); setEditingProduct(null); loadAllData(); }
  function handleServiceCreated() { setShowCreateService(false); setEditingService(null); loadAllData(); }
  function handleFoodCreated() { setShowCreateFood(false); setEditingFood(null); loadAllData(); }

  const avgRating = ratings.length > 0 ? parseFloat((ratings.reduce((s, r) => s + r.stars, 0) / ratings.length).toFixed(1)) : 0;
  const isProducts = tab === 'products';
  const isServices = tab === 'services';
  const items = isProducts ? myProducts : isServices ? myServices : myFoods;
  const emptyMsg = isProducts ? 'No tienes productos publicados' : isServices ? 'No tienes servicios publicados' : 'No tienes alimentos publicados';
  const emptyBtn = isProducts ? 'Publicar producto' : isServices ? 'Ofrecer servicio' : 'Publicar alimento';
  const createBtn = isProducts ? 'Publicar producto' : isServices ? 'Ofrecer servicio' : 'Publicar alimento';

  const tabConfig = [
    { id: 'products' as Tab, label: 'Productos', icon: ShoppingBag, count: myProducts.length },
    { id: 'services' as Tab, label: 'Servicios', icon: Wrench, count: myServices.length },
    { id: 'foods' as Tab, label: 'Alimentos', icon: UtensilsCrossed, count: myFoods.length },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button onClick={onNavigateToSearch} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
              <ArrowLeft className="w-4.5 h-4.5" />
              <span className="text-sm font-medium">Volver</span>
            </button>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-green-600 rounded-xl flex items-center justify-center">
                <ShoppingBag className="w-4.5 h-4.5 text-white" />
              </div>
              <span className="text-lg font-bold text-gray-900 tracking-tight hidden sm:block">CampusMarket</span>
            </div>
            <button onClick={signOut} className="w-9 h-9 flex items-center justify-center rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-colors">
              <LogOut className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Profile header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <img src={profile?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.full_name || 'U')}&background=16a34a&color=fff&size=256`} alt={profile?.full_name} className="w-20 h-20 rounded-2xl object-cover" />
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-1">{profile?.full_name}</h1>
              <p className="text-sm text-gray-400 mb-3">{profile?.email}</p>
              <div className="flex flex-wrap items-center gap-3 mb-3">
                {profile?.career && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full">
                    <GraduationCap className="w-3.5 h-3.5" />
                    {profile.career}
                  </span>
                )}
                {profile?.semester && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">
                    <BookOpen className="w-3.5 h-3.5" />
                    Semestre {profile.semester}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="font-semibold text-gray-900">{avgRating > 0 ? avgRating : '—'}</span>
                  <span className="text-gray-400">({ratings.length})</span>
                </div>
                <div className="text-gray-400">{myProducts.length + myServices.length + myFoods.length} publicaciones</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs + content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-1">
            {tabConfig.map(({ id, label, icon: Icon, count }) => (
              <button key={id} onClick={() => setTab(id)} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === id ? 'bg-green-50 text-green-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}>
                <Icon className="w-4 h-4" />
                {label}
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${tab === id ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{count}</span>
              </button>
            ))}
          </div>
          <button onClick={() => isProducts ? setShowCreateProduct(true) : isServices ? setShowCreateService(true) : setShowCreateFood(true)} className="flex items-center gap-2 bg-green-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-green-700 transition-colors">
            <Plus className="w-4 h-4" />
            {createBtn}
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {[...Array(6)].map((_, i) => <div key={i} className="bg-white rounded-2xl overflow-hidden border border-gray-100 animate-pulse"><div className="aspect-square bg-gray-100" /><div className="p-4 space-y-2"><div className="h-3 bg-gray-100 rounded w-3/4" /><div className="h-5 bg-gray-100 rounded w-1/2" /></div></div>)}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              {isProducts ? <ShoppingBag className="w-7 h-7 text-gray-300" /> : isServices ? <Wrench className="w-7 h-7 text-gray-300" /> : <UtensilsCrossed className="w-7 h-7 text-gray-300" />}
            </div>
            <p className="text-gray-400 text-base font-medium mb-4">{emptyMsg}</p>
            <button onClick={() => isProducts ? setShowCreateProduct(true) : isServices ? setShowCreateService(true) : setShowCreateFood(true)} className="inline-flex items-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-green-700 transition-colors">
              <Plus className="w-4 h-4" />
              {emptyBtn}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {isProducts
              ? myProducts.map((p) => <ProductCard key={p.id} product={p} onView={() => setSelectedProduct(p)} onEdit={() => setEditingProduct(p)} onDelete={() => handleDeleteProduct(p.id)} />)
              : isServices
              ? myServices.map((s) => <ServiceCard key={s.id} service={s} onView={() => setSelectedService(s)} onEdit={() => setEditingService(s)} onDelete={() => handleDeleteService(s.id)} />)
              : myFoods.map((f) => <FoodCard key={f.id} food={f} onView={() => setSelectedFood(f)} onEdit={() => setEditingFood(f)} onDelete={() => handleDeleteFood(f.id)} />)}
          </div>
        )}
      </main>

      {/* Modals */}
      {(showCreateProduct || editingProduct) && <CreateProduct product={editingProduct} onClose={() => { setShowCreateProduct(false); setEditingProduct(null); }} onSuccess={handleProductCreated} />}
      {(showCreateService || editingService) && <CreateService service={editingService} onClose={() => { setShowCreateService(false); setEditingService(null); }} onSuccess={handleServiceCreated} />}
      {(showCreateFood || editingFood) && <CreateFood food={editingFood} onClose={() => { setShowCreateFood(false); setEditingFood(null); }} onSuccess={handleFoodCreated} />}
      {selectedProduct && <ProductDetail product={selectedProduct} onClose={() => setSelectedProduct(null)} />}
      {selectedService && <ServiceDetail service={selectedService} onClose={() => setSelectedService(null)} />}
      {selectedFood && <FoodDetail food={selectedFood} onClose={() => setSelectedFood(null)} />}
    </div>
  );
}
