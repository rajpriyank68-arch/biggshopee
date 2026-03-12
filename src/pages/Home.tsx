import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Star, Heart, Menu, X, Settings, Phone, MapPin } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import HeroSection from '../components/HeroSection';

interface Product {
  id: number;
  name: string;
  category: string;
  description: string;
  image_url: string;
  featured: boolean;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const productsRes = await fetch('/api/products?featured=true');
      const productsData = await productsRes.json();
      setProducts(productsData);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#2d1810] flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 border-4 border-maroon border-t-gold rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#2d1810]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#1a0a0a]/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Sparkles className="w-7 h-7 text-gold" />
            <h1 className="font-cinzel text-2xl md:text-3xl text-white font-semibold tracking-wider">
              Big<span className="text-gold">Shopee</span>
            </h1>
          </Link>
          
          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#home" className="font-cinzel text-white/80 hover:text-gold transition tracking-wider text-sm uppercase">Home</a>
            <a href="#collection" className="font-cinzel text-white/80 hover:text-gold transition tracking-wider text-sm uppercase">Collection</a>
            <a href="#about" className="font-cinzel text-white/80 hover:text-gold transition tracking-wider text-sm uppercase">About</a>
            <a href="#contact" className="font-cinzel text-white/80 hover:text-gold transition tracking-wider text-sm uppercase">Contact</a>
            <Link to="/admin" className="flex items-center gap-1 text-gold hover:text-white transition font-cinzel tracking-wider text-sm uppercase">
              <Settings className="w-4 h-4" />
              Admin
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 text-white"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Nav */}
        {menuOpen && (
          <motion.nav 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-[#1a0a0a] border-t border-gold/20 px-4 py-4 flex flex-col gap-4"
          >
            <a href="#home" onClick={() => setMenuOpen(false)} className="font-cinzel text-white/80 hover:text-gold transition tracking-wider text-sm uppercase">Home</a>
            <a href="#collection" onClick={() => setMenuOpen(false)} className="font-cinzel text-white/80 hover:text-gold transition tracking-wider text-sm uppercase">Collection</a>
            <a href="#about" onClick={() => setMenuOpen(false)} className="font-cinzel text-white/80 hover:text-gold transition tracking-wider text-sm uppercase">About</a>
            <a href="#contact" onClick={() => setMenuOpen(false)} className="font-cinzel text-white/80 hover:text-gold transition tracking-wider text-sm uppercase">Contact</a>
            <Link to="/admin" onClick={() => setMenuOpen(false)} className="flex items-center gap-1 text-gold hover:text-white transition font-cinzel tracking-wider text-sm uppercase">
              <Settings className="w-4 h-4" />
              Admin Panel
            </Link>
          </motion.nav>
        )}
      </header>

      {/* Hero Section */}
      <section id="home">
        <HeroSection />
      </section>

      {/* Features */}
      <section className="py-16 bg-[#2d1810]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: '✨', title: 'Handcrafted', desc: 'Artisan Made', color: 'text-gold' },
              { icon: '🎨', title: 'Unique Designs', desc: 'One of a Kind', color: 'text-coral' },
              { icon: '💎', title: 'Premium Quality', desc: 'Finest Fabrics', color: 'text-purple' },
              { icon: '🌸', title: 'Traditional', desc: 'Heritage Styles', color: 'text-emerald' },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="text-center p-6 border border-gold/20 bg-gold/5"
              >
                <span className="text-4xl mb-3 block">{feature.icon}</span>
                <h3 className={`font-cinzel text-lg font-semibold ${feature.color} tracking-wider`}>{feature.title}</h3>
                <p className="font-cormorant text-white/60 text-lg">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Collection */}
      <section id="collection" className="py-20 bg-[#3d2518]">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="font-cormorant text-gold text-xl tracking-[0.3em] uppercase mb-2">Handpicked for You</h2>
            <h3 className="font-cinzel text-4xl md:text-5xl font-semibold text-white tracking-wide">Featured Collection</h3>
            <div className="w-24 h-[2px] bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mt-4" />
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Banner with Bride Background */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="/images/bride-bg.jpg" 
            alt="Indian Bride"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[#1a0a0a]/70" />
        </div>
        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
          >
            <Star className="w-12 h-12 mx-auto mb-6 text-gold" />
            <h2 className="font-cinzel text-3xl md:text-5xl font-semibold text-white mb-6 tracking-wide">Experience the Beauty of Tradition</h2>
            <p className="font-cormorant text-xl md:text-2xl text-white/80 max-w-2xl mx-auto italic">
              Each piece tells a story of heritage, craftsmanship, and timeless elegance.
            </p>
          </motion.div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-20 bg-[#2d1810]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
            >
              <h2 className="font-cormorant text-gold text-xl tracking-[0.3em] uppercase mb-2">Our Story</h2>
              <h3 className="font-cinzel text-4xl font-semibold text-white mb-8 tracking-wide">About BigShopee</h3>
              <p className="font-cormorant text-white/80 text-xl mb-6 leading-relaxed">
                At BigShopee, we celebrate the rich heritage of Indian textiles and craftsmanship. 
                Our collection features handpicked traditional wear that combines timeless elegance 
                with contemporary style.
              </p>
              <p className="font-cormorant text-white/80 text-xl mb-8 leading-relaxed">
                From intricate Banarasi sarees to regal sherwanis, each piece in our collection 
                is crafted by skilled artisans who have inherited their craft through generations.
              </p>
              <div className="flex items-center gap-4">
                <Heart className="w-6 h-6 text-coral" />
                <span className="font-cinzel text-white tracking-wider">Made with Love & Tradition</span>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="grid grid-cols-2 gap-4"
            >
              <img src="/images/saree1.jpg" alt="Saree" className="rounded-sm shadow-xl" />
              <img src="/images/lehenga1.jpg" alt="Lehenga" className="rounded-sm shadow-xl mt-8" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-[#3d2518]">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="font-cormorant text-gold text-xl tracking-[0.3em] uppercase mb-2">Get in Touch</h2>
            <h3 className="font-cinzel text-4xl md:text-5xl font-semibold text-white tracking-wide">Contact Us</h3>
            <div className="w-24 h-[2px] bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mt-4" />
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="bg-[#1a0a0a]/50 p-8 border border-gold/20"
            >
              <div className="flex items-start gap-4">
                <MapPin className="w-8 h-8 text-gold flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-cinzel text-xl text-gold mb-2 tracking-wider">Our Address</h4>
                  <p className="font-cormorant text-white/80 text-lg leading-relaxed">
                    Marwari Bazaar, Samastipur<br />
                    Near State Bank of India<br />
                    Bihar, India
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-[#1a0a0a]/50 p-8 border border-gold/20"
            >
              <div className="flex items-start gap-4">
                <Phone className="w-8 h-8 text-gold flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-cinzel text-xl text-gold mb-2 tracking-wider">Call Us</h4>
                  <a href="tel:8209087327" className="font-cormorant text-white/80 text-2xl hover:text-gold transition">
                    8209087327
                  </a>
                  <p className="font-cormorant text-white/60 text-lg mt-2">
                    Mon - Sat: 10:00 AM - 8:00 PM
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1a0a0a] text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-12 mb-12">
            <div>
              <h3 className="font-cinzel text-3xl text-gold mb-4 tracking-wider">BigShopee</h3>
              <p className="font-cormorant text-white/60 text-lg">Your destination for authentic traditional Indian wear.</p>
            </div>
            <div>
              <h4 className="font-cinzel text-xl text-gold mb-4 tracking-wider">Quick Links</h4>
              <ul className="space-y-3 font-cormorant text-white/60 text-lg">
                <li><a href="#home" className="hover:text-gold transition">Home</a></li>
                <li><a href="#collection" className="hover:text-gold transition">Collection</a></li>
                <li><a href="#about" className="hover:text-gold transition">About</a></li>
                <li><a href="#contact" className="hover:text-gold transition">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-cinzel text-xl text-gold mb-4 tracking-wider">Contact</h4>
              <p className="font-cormorant text-white/60 text-lg">Marwari Bazaar, Samastipur</p>
              <p className="font-cormorant text-white/60 text-lg">Near State Bank of India</p>
              <p className="font-cormorant text-white/60 text-lg mt-2">Phone: 8209087327</p>
            </div>
          </div>
          <div className="border-t border-gold/20 pt-8 text-center">
            <p className="font-cormorant text-white/40 text-lg">© 2024 BigShopee. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
