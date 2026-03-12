import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles } from 'lucide-react';
import ProductCard from '../components/ProductCard';

interface Product {
  id: number;
  name: string;
  category: string;
  description: string;
  image_url: string;
  featured: boolean;
}

export default function CategoryPage() {
  const { categoryName } = useParams<{ categoryName: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, [categoryName]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/products?category=${categoryName}`);
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-[#1a0a0a] shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link to="/" className="text-gold hover:text-white transition">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-gold" />
            <h1 className="font-cinzel text-2xl text-white font-semibold tracking-wider">BigShopee</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h2 className="font-cormorant text-teal text-xl tracking-[0.3em] uppercase mb-2">Explore Our</h2>
          <h1 className="font-cinzel text-4xl md:text-5xl font-semibold text-foreground tracking-wide">{categoryName}</h1>
          <div className="w-24 h-[2px] bg-gradient-to-r from-transparent via-teal to-transparent mx-auto mt-4" />
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-12">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-12 h-12 border-4 border-maroon border-t-gold rounded-full"
            />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="font-cormorant text-foreground/70 text-xl">No products found in this category.</p>
            <Link to="/" className="inline-block mt-4 text-teal hover:text-maroon font-cinzel tracking-wider">
              ← Back to Home
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
