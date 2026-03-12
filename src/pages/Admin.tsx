import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Unlock, Plus, Edit2, Trash2, Save, X, ArrowLeft, Image, Upload } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  category: string;
  description: string;
  image_url: string;
  featured: boolean;
}

interface Category {
  id: number;
  name: string;
  icon: string;
}

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    category: '',
    description: '',
    image_url: '',
    featured: false
  });
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  const ADMIN_PASSWORD = 'bigshopee2020';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setError('');
      fetchData();
    } else {
      setError('Incorrect password. Please try again.');
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/categories')
      ]);
      const productsData = await productsRes.json();
      const categoriesData = await categoriesRes.json();
      setProducts(productsData);
      setCategories(categoriesData);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (file: File, isEdit: boolean = false) => {
    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: base64, filename: file.name })
        });
        const data = await res.json();
        if (data.url) {
          if (isEdit && editingProduct) {
            setEditingProduct({ ...editingProduct, image_url: data.url });
          } else {
            setNewProduct({ ...newProduct, image_url: data.url });
          }
        }
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('Upload error:', err);
      setUploading(false);
    }
  };

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.category) return;
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct)
      });
      if (res.ok) {
        setIsAddingNew(false);
        setNewProduct({ name: '', category: '', description: '', image_url: '', featured: false });
        fetchData();
      }
    } catch (err) {
      console.error('Add error:', err);
    }
  };

  const handleUpdateProduct = async () => {
    if (!editingProduct) return;
    try {
      const res = await fetch('/api/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingProduct)
      });
      if (res.ok) {
        setEditingProduct(null);
        fetchData();
      }
    } catch (err) {
      console.error('Update error:', err);
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      const res = await fetch('/api/products', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      if (res.ok) {
        fetchData();
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#1a0a0a] flex items-center justify-center p-4">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, #D4AF37 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }} />
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white shadow-2xl p-8 w-full max-w-md relative z-10"
        >
          <div className="text-center mb-8">
            <Lock className="w-16 h-16 mx-auto text-maroon mb-4" />
            <h1 className="font-cinzel text-3xl font-semibold text-foreground tracking-wider">Admin Panel</h1>
            <p className="font-cormorant text-foreground/70 mt-2 text-lg">Enter password to access</p>
          </div>

          <form onSubmit={handleLogin}>
            <div className="mb-6">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="w-full px-4 py-3 border-2 border-muted font-cormorant text-lg focus:border-gold focus:outline-none transition"
              />
              {error && (
                <p className="text-coral mt-2 font-cormorant">{error}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-maroon to-gold text-white py-3 font-cinzel tracking-wider hover:opacity-90 transition"
            >
              <Unlock className="w-5 h-5 inline mr-2" />
              Unlock Admin
            </button>
          </form>

          <Link
            to="/"
            className="block text-center mt-6 text-teal font-cinzel tracking-wider hover:text-maroon transition"
          >
            <ArrowLeft className="w-4 h-4 inline mr-1" />
            Back to Website
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-[#1a0a0a] shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-gold hover:text-white transition">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <h1 className="font-cinzel text-2xl font-semibold text-white tracking-wider">Admin Panel</h1>
          </div>
          <button
            onClick={() => setIsAuthenticated(false)}
            className="text-coral font-cinzel tracking-wider hover:text-white transition flex items-center gap-1"
          >
            <Lock className="w-4 h-4" />
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Add Product Button */}
        <div className="mb-8 flex justify-between items-center">
          <h2 className="font-cinzel text-2xl font-semibold text-foreground tracking-wider">Manage Products</h2>
          <button
            onClick={() => setIsAddingNew(true)}
            className="bg-gradient-to-r from-teal to-emerald text-white px-6 py-2 font-cinzel tracking-wider flex items-center gap-2 hover:opacity-90 transition"
          >
            <Plus className="w-5 h-5" />
            Add Product
          </button>
        </div>

        {/* Add New Product Form */}
        <AnimatePresence>
          {isAddingNew && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white shadow-lg p-6 mb-8"
            >
              <h3 className="font-cinzel text-xl font-semibold text-purple mb-4 tracking-wider">Add New Product</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Product Name"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="px-4 py-3 border-2 border-muted font-cormorant text-lg focus:border-purple focus:outline-none"
                />
                <select
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                  className="px-4 py-3 border-2 border-muted font-cormorant text-lg focus:border-purple focus:outline-none"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
                <textarea
                  placeholder="Description"
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  className="px-4 py-3 border-2 border-muted font-cormorant text-lg focus:border-purple focus:outline-none md:col-span-2"
                  rows={3}
                />
                <div className="md:col-span-2">
                  <div className="flex items-center gap-4 mb-2">
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
                      className="hidden"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      className="flex items-center gap-2 px-4 py-2 bg-muted font-cinzel tracking-wider hover:bg-gold/20 transition"
                    >
                      <Upload className="w-5 h-5 text-purple" />
                      {uploading ? 'Uploading...' : 'Upload Image from Gallery'}
                    </button>
                    {newProduct.image_url && (
                      <img src={newProduct.image_url} alt="Preview" className="w-16 h-16 object-cover" />
                    )}
                  </div>
                </div>
                <label className="flex items-center gap-2 font-cormorant text-lg">
                  <input
                    type="checkbox"
                    checked={newProduct.featured}
                    onChange={(e) => setNewProduct({ ...newProduct, featured: e.target.checked })}
                    className="w-5 h-5 accent-purple"
                  />
                  Featured Product
                </label>
              </div>
              <div className="flex gap-4 mt-6">
                <button
                  onClick={handleAddProduct}
                  className="bg-gradient-to-r from-purple to-maroon text-white px-6 py-2 font-cinzel tracking-wider flex items-center gap-2 hover:opacity-90 transition"
                >
                  <Save className="w-5 h-5" />
                  Save Product
                </button>
                <button
                  onClick={() => setIsAddingNew(false)}
                  className="bg-muted text-foreground px-6 py-2 font-cinzel tracking-wider flex items-center gap-2 hover:bg-gray-200 transition"
                >
                  <X className="w-5 h-5" />
                  Cancel
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Products List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-12 h-12 border-4 border-maroon border-t-gold rounded-full"
            />
          </div>
        ) : (
          <div className="grid gap-4">
            {products.map((product) => (
              <motion.div
                key={product.id}
                layout
                className="bg-white shadow-md p-4 md:p-6"
              >
                {editingProduct?.id === product.id ? (
                  // Edit Mode
                  <div className="grid md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      value={editingProduct.name}
                      onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                      className="px-4 py-2 border-2 border-muted font-cormorant text-lg focus:border-purple focus:outline-none"
                    />
                    <select
                      value={editingProduct.category}
                      onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                      className="px-4 py-2 border-2 border-muted font-cormorant text-lg focus:border-purple focus:outline-none"
                    >
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.name}>{cat.name}</option>
                      ))}
                    </select>
                    <textarea
                      value={editingProduct.description}
                      onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                      className="px-4 py-2 border-2 border-muted font-cormorant text-lg focus:border-purple focus:outline-none md:col-span-2"
                      rows={2}
                    />
                    <div className="md:col-span-2">
                      <div className="flex items-center gap-4">
                        <input
                          type="file"
                          ref={editFileInputRef}
                          accept="image/*"
                          onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], true)}
                          className="hidden"
                        />
                        <button
                          onClick={() => editFileInputRef.current?.click()}
                          disabled={uploading}
                          className="flex items-center gap-2 px-4 py-2 bg-muted font-cinzel tracking-wider hover:bg-gold/20 transition"
                        >
                          <Upload className="w-5 h-5 text-purple" />
                          {uploading ? 'Uploading...' : 'Change Image'}
                        </button>
                        {editingProduct.image_url && (
                          <img src={editingProduct.image_url} alt="Preview" className="w-16 h-16 object-cover" />
                        )}
                      </div>
                    </div>
                    <label className="flex items-center gap-2 font-cormorant text-lg">
                      <input
                        type="checkbox"
                        checked={editingProduct.featured}
                        onChange={(e) => setEditingProduct({ ...editingProduct, featured: e.target.checked })}
                        className="w-5 h-5 accent-purple"
                      />
                      Featured
                    </label>
                    <div className="flex gap-2 justify-end md:col-span-2">
                      <button
                        onClick={handleUpdateProduct}
                        className="bg-emerald text-white px-4 py-2 font-cinzel tracking-wider flex items-center gap-1 hover:opacity-90"
                      >
                        <Save className="w-4 h-4" />
                        Save
                      </button>
                      <button
                        onClick={() => setEditingProduct(null)}
                        className="bg-muted text-foreground px-4 py-2 font-cinzel tracking-wider flex items-center gap-1 hover:bg-gray-200"
                      >
                        <X className="w-4 h-4" />
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  // View Mode
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                    <div className="w-20 h-20 flex-shrink-0">
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center">
                          <Image className="w-8 h-8 text-foreground/30" />
                        </div>
                      )}
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-cinzel text-lg font-semibold text-foreground tracking-wider">{product.name}</h3>
                        {product.featured && (
                          <span className="bg-gold/20 text-gold px-2 py-0.5 text-xs font-cinzel tracking-wider">Featured</span>
                        )}
                      </div>
                      <p className="font-cinzel text-sm text-purple tracking-wider">{product.category}</p>
                      <p className="font-cormorant text-foreground/70 line-clamp-1">{product.description}</p>
                    </div>
                    <div className="flex gap-2 self-end md:self-auto">
                      <button
                        onClick={() => setEditingProduct(product)}
                        className="bg-teal/10 text-teal p-2 hover:bg-teal/20 transition"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="bg-coral/10 text-coral p-2 hover:bg-coral/20 transition"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
