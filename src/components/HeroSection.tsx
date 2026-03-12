import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SparkleEffect from './SparkleEffect';

const slides = [
  '/images/slide1.jpg',
  '/images/slide2.jpg',
  '/images/slide3.jpg',
  '/images/slide4.jpg',
  '/images/slide5.jpg',
];

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Split Screen Container */}
      <div className="flex flex-col md:flex-row h-full">
        {/* Left Half - Sparkle Animation with Text */}
        <div className="relative w-full md:w-1/2 h-1/2 md:h-full bg-gradient-to-br from-[#1a0a0a] via-[#2d1515] to-[#1a0a0a]">
          {/* Sparkle Effect */}
          <SparkleEffect />
          
          {/* Decorative Pattern Overlay */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, #D4AF37 1px, transparent 0)`,
              backgroundSize: '40px 40px'
            }} />
          </div>

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center justify-center h-full px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              <h2 className="font-serif text-[#D4AF37] text-lg md:text-xl tracking-[0.3em] uppercase mb-4">
                Welcome to
              </h2>
              <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-white font-bold mb-4 leading-tight tracking-wide">
                Big<span className="text-[#D4AF37]">Shopee</span>
              </h1>
              <div className="w-32 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto mb-6" />
              <p className="font-serif text-white/80 text-lg md:text-xl tracking-wider max-w-md mx-auto mb-8 italic">
                Exquisite Traditional Wear
              </p>
              <motion.a
                href="#collection"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-block bg-[#D4AF37] text-[#1a0a0a] px-10 py-4 font-serif text-lg tracking-wider uppercase hover:bg-[#FFD700] transition-colors"
              >
                Explore Collection
              </motion.a>
            </motion.div>
          </div>

          {/* Corner Decorations */}
          <div className="absolute top-8 left-8 w-16 h-16 border-l-2 border-t-2 border-[#D4AF37]/50" />
          <div className="absolute bottom-8 right-8 w-16 h-16 border-r-2 border-b-2 border-[#D4AF37]/50" />
        </div>

        {/* Right Half - Image Slideshow */}
        <div className="relative w-full md:w-1/2 h-1/2 md:h-full overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0"
            >
              <img
                src={slides[currentSlide]}
                alt="Traditional wear"
                className="w-full h-full object-cover"
              />
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-[#1a0a0a]/30" />
            </motion.div>
          </AnimatePresence>

          {/* Slide Indicators */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? 'bg-[#D4AF37] scale-125'
                    : 'bg-white/50 hover:bg-white/80'
                }`}
              />
            ))}
          </div>

          {/* Frame Border */}
          <div className="absolute inset-4 border border-[#D4AF37]/30 pointer-events-none" />
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:block z-20"
      >
        <div className="w-6 h-10 border-2 border-[#D4AF37] rounded-full flex justify-center pt-2">
          <div className="w-1.5 h-3 bg-[#D4AF37] rounded-full" />
        </div>
      </motion.div>
    </section>
  );
}
