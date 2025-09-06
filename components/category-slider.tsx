'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Button } from './ui/button';
import {} from './lib/utils';

interface CategorySliderProps {
  categories: {
    name: string;
    icon: any;
  }[];
  activeCategory: string;
  setActiveCategory: (category: string) => void;
}

export default function CategorySlider({
  categories,
  activeCategory,
  setActiveCategory,
}: CategorySliderProps) {
  const sliderRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (sliderRef.current) {
      const { current } = sliderRef;
      const scrollAmount = direction === 'left' ? -300 : 300;
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative">
      <div className="absolute left-2 top-1/2 -translate-y-1/2 ">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full bg-black/50 backdrop-blur-sm text-white hover:bg-black/70"
          onClick={() => scroll('left')}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
      </div>

      <div
        ref={sliderRef}
        className="flex items-center gap-2 overflow-x-auto py-2 px-12 scrollbar-hide bg-gradient-to-br from-gray-500 to-gray-600 my-4 rounded-xl"
      >
        {categories.map((category) => {
          const Icon = category.icon;
          const isActive = activeCategory === category.name;

          return (
            <motion.button
              key={category.name}
              className={
                (isActive
                  ? 'bg-gradient-to-r from-primary to-secondary text-white'
                  : 'bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white') +
                ' flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all w-fit'
              }
              onClick={() => setActiveCategory(category.name)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Icon
                className={
                  'h-4 w-4 ' + isActive ? 'text-white' : 'text-gray-400'
                }
              />
              <span className="text-sm font-medium">{category.name}</span>
            </motion.button>
          );
        })}
      </div>

      <div className="absolute right-2 top-1/2 -translate-y-1/2 ">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full bg-black/50 backdrop-blur-sm text-white hover:bg-black/70"
          onClick={() => scroll('right')}
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
