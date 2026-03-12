import { motion } from 'framer-motion';
import { Sparkles, Image } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  category: string;
  description: string;
  image_url: string;
  featured: boolean;
}

interface ProductCardProps {
  product: Product;
  index: number;
}

export default function ProductCard({ product, index }: ProductCardProps) {
  const colorClasses = [
    'text-maroon',
    'text-teal',
    'text-purple',
    'text-coral',
    'text-emerald',
    'text-gold'
  ];
  
  const bgClasses = [
    'bg-maroon/10',
    'bg-teal/10',
    'bg-purple/10',
    'bg-coral/10',
    'bg-emerald/10',
    'bg-gold/10'
  ];

  const colorClass = colorClasses[index % colorClasses.length];
  const bgClass = bgClasses[index % bgClasses.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white overflow-hidden shadow-lg card-hover group"
    >
      <div className="relative aspect-[3/4] overflow-hidden">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <Image className="w-16 h-16 text-foreground/20" />
          </div>
        )}
        {product.featured && (
          <div className="absolute top-4 left-4 bg-gold text-[#1a0a0a] px-4 py-1.5 flex items-center gap-1">
            <Sparkles className="w-4 h-4" />
            <span className="font-cinzel text-xs tracking-wider uppercase">Featured</span>
          </div>
        )}
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
      </div>
      <div className="p-5">
        <span className={`font-cinzel text-xs tracking-wider uppercase ${colorClass} ${bgClass} px-3 py-1`}>
          {product.category}
        </span>
        <h3 className="font-cinzel text-lg font-semibold text-foreground mt-3 line-clamp-1 tracking-wide">
          {product.name}
        </h3>
        <p className="font-cormorant text-base text-foreground/70 mt-2 line-clamp-2 italic">
          {product.description}
        </p>
      </div>
    </motion.div>
  );
}
