import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface Category {
  id: number;
  name: string;
  icon: string;
}

interface CategoryCardProps {
  category: Category;
  index: number;
}

export default function CategoryCard({ category, index }: CategoryCardProps) {
  const gradients = [
    'from-[#8B1538] to-[#D4AF37]',
    'from-[#008080] to-[#2ECC71]',
    'from-[#6B5B95] to-[#8B1538]',
    'from-[#D4AF37] to-[#FF6B6B]',
    'from-[#FF6B6B] to-[#6B5B95]',
    'from-[#2ECC71] to-[#008080]'
  ];

  const gradient = gradients[index % gradients.length];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.05, y: -5 }}
    >
      <Link
        to={`/category/${category.name}`}
        className={`block bg-gradient-to-br ${gradient} p-6 text-center text-white shadow-lg hover:shadow-xl transition-all duration-300`}
      >
        <span className="text-4xl mb-3 block">{category.icon}</span>
        <h3 className="font-cinzel text-base font-semibold tracking-wider">{category.name}</h3>
      </Link>
    </motion.div>
  );
}
