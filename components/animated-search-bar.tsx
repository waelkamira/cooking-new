'use client';

import type React from 'react';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Search,
  X,
  Loader2,
  ArrowRight,
  Star,
  Clock,
  Film,
  Music,
  Tv,
} from 'lucide-react';

// Function to normalize Arabic text if needed
const normalizeArabic = (text: string) => {
  if (!text) return '';
  return text.replace(/[أ]/g, 'أ');
};

interface SearchResult {
  id: string;
  title: string;
  type: 'series' | 'movie' | 'episode' | 'song';
  image: string;
  rating?: number;
  year?: number;
  duration?: string;
}

export default function AnimatedSearchBar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Mock data for demonstration
  const mockResults: SearchResult[] = [
    {
      id: '1',
      title: 'Attack on Titan',
      type: 'series',
      image: '/images/photo-4.png',
      rating: 4.9,
      year: 2013,
      duration: '24m',
    },
    {
      id: '2',
      title: 'Demon Slayer',
      type: 'series',
      image: '/images/photo-4.png',
      rating: 4.8,
      year: 2019,
      duration: '24m',
    },
    {
      id: '3',
      title: 'Your Name',
      type: 'movie',
      image: '/images/photo-4.png',
      rating: 4.7,
      year: 2016,
      duration: '1h 46m',
    },
    {
      id: '4',
      title: 'Jujutsu Kaisen',
      type: 'series',
      image: '/images/photo-4.png',
      rating: 4.8,
      year: 2020,
      duration: '24m',
    },
    {
      id: '5',
      title: 'Anime Lofi Beats',
      type: 'song',
      image: '/images/photo-4.png',
      duration: '3:45',
    },
  ];

  // Filter categories
  const categories = [
    { id: 'all', label: 'الكل', icon: Search },
    { id: 'series', label: 'المسلسلات', icon: Tv },
    { id: 'movies', label: 'الأفلام', icon: Film },
    { id: 'music', label: 'أغاني', icon: Music },
  ];

  // Handle search
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      const filtered =
        selectedCategory === 'all'
          ? mockResults
          : mockResults.filter(
              (item) =>
                item.type ===
                (selectedCategory === 'movies'
                  ? 'movie'
                  : selectedCategory === 'music'
                  ? 'song'
                  : 'series')
            );

      setResults(filtered);
      setIsLoading(false);
    }, 800);

    // In a real app, you would fetch from your API:
    // try {
    //   const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}&category=${selectedCategory}`)
    //   const data = await res.json()
    //   setResults(data)
    // } catch (error) {
    //   console.error("Search error:", error)
    // } finally {
    //   setIsLoading(false)
    // }
  };

  // Handle key press
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    } else if (e.key === 'Escape') {
      resetSearch();
    }
  };

  // Reset search
  const resetSearch = () => {
    setSearchQuery('');
    setResults([]);
    setIsExpanded(false);
  };

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        resultsRef.current &&
        !resultsRef.current.contains(event.target as Node) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node)
      ) {
        setIsExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Navigate to result
  const navigateToResult = (result: SearchResult) => {
    // In a real app, you would navigate to the appropriate page
    console.log(`Navigating to ${result?.type}: ${result?.title}`);
    // router.push(`/${result?.type}/${result?.id}`)
    resetSearch();
  };

  return (
    <div className="relative w-full">
      <div className="relative w-full">
        <motion.div
          className={`relative flex items-center rounded-full ${
            isExpanded
              ? 'bg-white/10 backdrop-blur-md border border-white/20'
              : 'bg-white/5 border border-white/10 '
          }`}
          animate={{
            width: isExpanded ? '100%' : '200px',
          }}
          transition={{ type: 'bounce', stiffness: 400, damping: 30 }}
        >
          <motion.div
            className="absolute left-3 top-3 bottom-0 my-auto text-white"
            animate={{
              scale: isLoading ? [1, 1.2, 1] : 1,
              rotate: isLoading ? 360 : 0,
            }}
            transition={{
              rotate: {
                repeat: Number.POSITIVE_INFINITY,
                duration: 1,
                ease: 'linear',
              },
              scale: {
                repeat: isLoading ? Number.POSITIVE_INFINITY : 0,
                duration: 1,
              },
            }}
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Search className="h-5 w-5" />
            )}
          </motion.div>

          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsExpanded(true)}
            onKeyDown={handleKeyDown}
            placeholder="ابحث عن مسلسل فيلم..."
            className="w-full bg-transparent z-50 border-none pl-2 pr-2 sm:pl-10 sm:pr-10 py-3 focus:outline-none text-white"
          />

          <AnimatePresence>
            {searchQuery && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute right-3 top-1/2 -translate-y-1/2  hover:text-white"
                onClick={resetSearch}
              >
                <X className="h-5 w-5" />
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
