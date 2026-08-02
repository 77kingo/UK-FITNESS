import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';

interface Review {
  id: string;
  author: string;
  rating: number;
  text: string;
  status: 'pending' | 'approved' | 'removed';
  date: string;
}

const FALLBACK_REVIEWS: Review[] = [
  { id: 'fb1', author: 'Sarah Jenkins', rating: 5, text: 'The HIIT classes here completely changed my perspective on fitness. Elite trainers and unmatched energy!', status: 'approved', date: new Date().toISOString() },
  { id: 'fb2', author: 'David Okafor', rating: 5, text: 'Best strength facility I have ever trained at. The Eleiko plates and platforms are top tier. 10/10.', status: 'approved', date: new Date().toISOString() },
  { id: 'fb3', author: 'Emma L.', rating: 4, text: 'The recovery sanctuary is incredible. Cold plunges after a heavy leg day is exactly what I needed.', status: 'approved', date: new Date().toISOString() }
];

export const Testimonials: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('uk_admin_reviews');
      if (stored) {
        const parsed = JSON.parse(stored) as Review[];
        const approved = parsed.filter(r => r.status === 'approved');
        if (approved.length > 0) {
          setReviews(approved);
          return;
        }
      }
    } catch (e) {
      console.error(e);
    }
    // Fallback if empty or none approved
    setReviews(FALLBACK_REVIEWS);
  }, []);

  const next = () => setCurrentIndex((prev) => (prev + 1) % reviews.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);

  if (reviews.length === 0) return null;

  const current = reviews[currentIndex];

  return (
    <div className="py-24 relative overflow-hidden bg-black border-t border-gray-900">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-neon/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-brand-neon text-sm font-extrabold uppercase tracking-widest">Real Results</span>
          <h2 className="text-3xl sm:text-5xl font-black text-white mt-3 uppercase tracking-tight">Athlete Testimonials</h2>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative glass-card p-8 md:p-12 rounded-3xl border border-gray-800">
            <Quote className="absolute top-8 left-8 h-12 w-12 text-brand-neon/20" />
            
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="relative z-10 flex flex-col items-center text-center space-y-6 pt-8"
              >
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-6 w-6 ${i < current.rating ? 'text-yellow-400 fill-current' : 'text-gray-700'}`} 
                    />
                  ))}
                </div>
                
                <p className="text-xl md:text-3xl font-medium text-white leading-relaxed italic">
                  "{current.text}"
                </p>
                
                <div>
                  <h4 className="text-brand-neon font-black uppercase tracking-widest">{current.author}</h4>
                  <p className="text-gray-500 text-sm mt-1">Verified Athlete</p>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Controls */}
            {reviews.length > 1 && (
              <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between px-4 md:-mx-6 pointer-events-none">
                <button 
                  onClick={prev}
                  className="pointer-events-auto h-12 w-12 rounded-full bg-brand-dark border border-gray-700 flex items-center justify-center text-gray-400 hover:text-brand-neon hover:border-brand-neon transition-all"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button 
                  onClick={next}
                  className="pointer-events-auto h-12 w-12 rounded-full bg-brand-dark border border-gray-700 flex items-center justify-center text-gray-400 hover:text-brand-neon hover:border-brand-neon transition-all"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </div>
            )}
          </div>
          
          {/* Indicators */}
          {reviews.length > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {reviews.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`h-1.5 rounded-full transition-all ${i === currentIndex ? 'w-8 bg-brand-neon' : 'w-2 bg-gray-700 hover:bg-gray-500'}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
