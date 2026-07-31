import { useState, useEffect } from 'react';
import { ShoppingBag, Search, User as UserIcon, LogOut, Wrench, UtensilsCrossed, Book, Cpu, Package, Sparkles, Plus } from 'lucide-react';
import { supabase, Product, Service, Food } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import ProductCard from './ProductCard';
import ProductDetail from './ProductDetail';
import ServiceCard from './ServiceCard';
import ServiceDetail from './ServiceDetail';
import FoodCard from './FoodCard';
import FoodDetail from './FoodDetail';

type Tab = 'products' | 'services' | 'foods';

interface ProductSearchProps {
  onNavigateToProfile: () => void;
}

export default function ProductSearch({ onNavigateToProfile }: ProductSearchProps) {
  const [tab, setTab] = useState<Tab>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [foods, setFoods] = useState<Food[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [filteredFoods, setFilteredFoods] = useState<Food[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [loading, setLoading] = useState(true);
  const { user, profile, signOut } = useAuth();

  const productCategories = [
    { id: 'all', label: 'Todos', icon: Sparkles },
    { id: 'libros', label: 'Libros', icon: Book },
    { id: 'electronica', label: 'Electrónica', icon: Cpu },
    { id: 'materiales', label: 'Materiales', icon: Package },
    { id: 'ropa', label: 'Ropa y Accesorios', icon: Package },
    { id: 'deportes', label: 'Deportes', icon: Package },
    { id: 'muebles', label: 'Muebles', icon: Package },
    { id: 'instrumentos', label: 'Instrumentos', icon: Package },
    { id: 'juegos', label: 'Juegos y Hobbies', icon: Package },
    { id: 'transporte', label: 'Transporte', icon: Package },
    { id: 'otros', label: 'Otros', icon: Package },
  ];

  const serviceCategories = [
    { id: 'all', label: 'Todos', icon: Sparkles },
    { id: 'tutorias', label: 'Tutorías', icon: Book },
    { id: 'tecnico', label: 'Soporte Técnico', icon: Cpu },
    { id: 'diseno', label: 'Diseño', icon: Package },
    { id: 'escritura', label: 'Escritura', icon: Book },
    { id: 'otro', label: 'Otro', icon: Sparkles },
  ];

  const foodCategories = [
    { id: 'all', label: 'Todos', icon: Sparkles },
    { id: 'snacks', label: 'Snacks', icon: Package },
    { id: 'comidas', label: 'Comidas', icon: Package },
    { id: 'bebidas', label: 'Bebidas', icon: Package },
    { id: 'postres', label: 'Postres', icon: Package },
    { id: 'otro', label: 'Otro', icon: Sparkles },
  ];

  const tabConfig = [
    { id: 'products' as Tab, label: 'Productos', icon: ShoppingBag },
    { id: 'services' as Tab, label: 'Servicios', icon: Wrench },
    { id: 'foods' as Tab, label: 'Alimentos', icon: UtensilsCrossed },
  ];

  useEffect(() => {
    loadAllData();
  }, [user]);

  useEffect(() => {
    if (tab === 'products') filterProducts();
    else if (tab === 'services') filterServices();
    else filterFoods();
  }, [searchQuery, selectedCategory, products, services, foods, tab]);

  async function loadAllData() {
    setLoading(true);
    try {
      const [productsRes, servicesRes, foodsRes] = await Promise.all([
        supabase.from('products').select('*, profiles(*)').order('created_at', { ascending: false }),
        supabase.from('services').select('*, profiles(*)').order('created_at', { ascending: false }),
        supabase.from('foods').select('*, profiles(*)').order('created_at', { ascending: false }),
      ]);
      if (productsRes.error) throw productsRes.error;
      if (servicesRes.error) throw servicesRes.error;
      if (foodsRes.error) throw foodsRes.error;
      setProducts(productsRes.data || []);
      setServices(servicesRes.data || []);
      setFoods(foodsRes.data || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }

  function filterProducts() {
    let filtered = products.filter(p => p.user_id !== user?.id);
    if (selectedCategory !== 'all') filtered = filtered.filter(p => p.category === selectedCategory);
    if (searchQuery) filtered = filtered.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.description.toLowerCase().includes(searchQuery.toLowerCase()));
    setFilteredProducts(filtered);
  }

  function filterServices() {
    let filtered = services.filter(s => s.user_id !== user?.id);
    if (selectedCategory !== 'all') filtered = filtered.filter(s => s.category === selectedCategory);
    if (searchQuery) filtered = filtered.filter(s => s.title.toLowerCase().includes(searchQuery.toLowerCase()) || s.description.toLowerCase().includes(searchQuery.toLowerCase()));
    setFilteredServices(filtered);
  }

  function filterFoods() {
    let filtered = foods.filter(f => f.user_id !== user?.id);
    if (selectedCategory !== 'all') filtered = filtered.filter(f => f.category === selectedCategory);
    if (searchQuery) filtered = filtered.filter(f => f.title.toLowerCase().includes(searchQuery.toLowerCase()) || f.description.toLowerCase().includes(searchQuery.toLowerCase()));
    setFilteredFoods(filtered);
  }

  function handleTabChange(newTab: Tab) {
    setTab(newTab);
    setSelectedCategory('all');
    setSearchQuery('');
  }

  const categories = tab === 'products' ? productCategories : tab === 'services' ? serviceCategories : foodCategories;
  const isProducts = tab === 'products';
  const isServices = tab === 'services';
  const filtered = isProducts ? filteredProducts : isServices ? filteredServices : filteredFoods;
  const placeholder = isProducts ? 'Buscar productos...' : isServices ? 'Buscar servicios...' : 'Buscar alimentos...';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-green-600 rounded-xl flex items-center justify-center">
                <ShoppingBag className="w-4.5 h-4.5 text-white" />
              </div>
              <span className="text-lg font-bold text-gray-900 tracking-tight hidden sm:block">CampusMarket</span>
            </div>

            {/* Search */}
            <div className="flex-1 max-w-md mx-4">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={placeholder}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-green-500/20 focus:border-green-500 focus:bg-white outline-none transition-all"
                />
              </div>
            </div>

            {/* User */}
            <div className="flex items-center gap-2">
              <button onClick={onNavigateToProfile} className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors">
                <img
                  src={profile?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.full_name || 'U')}&background=16a34a&color=fff&size=128`}
                  alt={profile?.full_name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="text-sm font-medium text-gray-700 hidden sm:block">{profile?.full_name?.split(' ')[0]}</span>
              </button>
              <button onClick={signOut} className="w-9 h-9 flex items-center justify-center rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-colors">
                <LogOut className="w-4.5 h-4.5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-green-600 via-green-600 to-green-700">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 80%, white 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur rounded-full text-white text-xs font-medium mb-5">
                <Sparkles className="w-3.5 h-3.5" />
                Universidad del Pacífico · Buenaventura
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight mb-4 tracking-tight">
                Compra y venta entre estudiantes de la universidad.
              </h1>
              <p className="text-green-100 text-base sm:text-lg leading-relaxed mb-8">
                Encuentra productos de segunda mano, materiales académicos, tecnología y mucho más.
              </p>
              <button
                onClick={onNavigateToProfile}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-green-700 rounded-xl font-semibold text-sm hover:bg-green-50 transition-colors shadow-lg"
              >
                <Plus className="w-4.5 h-4.5" />
                Publicar producto
              </button>
            </div>
            <div className="hidden lg:flex justify-end">
              <div className="relative w-full max-w-md">
                <div className="absolute -inset-4 bg-white/10 rounded-3xl blur-2xl" />
                <img
                  src="https://images.pexels.com/photos/1438072/pexels-photo-1438072.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Estudiantes universitarios"
                  className="relative rounded-2xl shadow-2xl w-full object-cover aspect-[4/3]"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs + Categories */}
      <div className="sticky top-16 z-30 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Tabs */}
          <div className="flex items-center gap-1 py-3">
            {tabConfig.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => handleTabChange(id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  tab === id
                    ? 'bg-green-50 text-green-700'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>

          {/* Category pills */}
          <div className="flex items-center gap-2 py-3 overflow-x-auto">
            {categories.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setSelectedCategory(id)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  selectedCategory === id
                    ? 'bg-green-600 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden border border-gray-100 animate-pulse">
                <div className="aspect-square bg-gray-100" />
                <div className="p-4 space-y-2">
                  <div className="h-3 bg-gray-100 rounded w-3/4" />
                  <div className="h-5 bg-gray-100 rounded w-1/2" />
                  <div className="h-8 bg-gray-100 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              {isProducts ? <ShoppingBag className="w-7 h-7 text-gray-300" /> : isServices ? <Wrench className="w-7 h-7 text-gray-300" /> : <UtensilsCrossed className="w-7 h-7 text-gray-300" />}
            </div>
            <p className="text-gray-400 text-base font-medium">No se encontraron resultados</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {isProducts
              ? filteredProducts.map((p) => <ProductCard key={p.id} product={p} onView={() => setSelectedProduct(p)} />)
              : isServices
              ? filteredServices.map((s) => <ServiceCard key={s.id} service={s} onView={() => setSelectedService(s)} />)
              : filteredFoods.map((f) => <FoodCard key={f.id} food={f} onView={() => setSelectedFood(f)} />)}
          </div>
        )}
      </main>

      {/* Modals */}
      {selectedProduct && <ProductDetail product={selectedProduct} onClose={() => setSelectedProduct(null)} />}
      {selectedService && <ServiceDetail service={selectedService} onClose={() => setSelectedService(null)} />}
      {selectedFood && <FoodDetail food={selectedFood} onClose={() => setSelectedFood(null)} />}
    </div>
  );
}
