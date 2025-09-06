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
      image: '/placeholder.svg?height=300&width=200',
      rating: 4.9,
      year: 2013,
      duration: '24m',
    },
    {
      id: '2',
      title: 'Demon Slayer',
      type: 'series',
      image: '/placeholder.svg?height=300&width=200',
      rating: 4.8,
      year: 2019,
      duration: '24m',
    },
    {
      id: '3',
      title: 'Your Name',
      type: 'movie',
      image: '/placeholder.svg?height=300&width=200',
      rating: 4.7,
      year: 2016,
      duration: '1h 46m',
    },
    {
      id: '4',
      title: 'Jujutsu Kaisen',
      type: 'series',
      image: '/placeholder.svg?height=300&width=200',
      rating: 4.8,
      year: 2020,
      duration: '24m',
    },
    {
      id: '5',
      title: 'Anime Lofi Beats',
      type: 'song',
      image: '/placeholder.svg?height=300&width=200',
      duration: '3:45',
    },
  ];

  // Filter categories
  const categories = [
    { id: 'all', label: 'الكل', icon: Search },
    { id: 'series', label: 'مسلسلات', icon: Tv },
    { id: 'movies', label: 'أفلام', icon: Film },
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
    console.log(`Navigating to ${result.type}: ${result.title}`);
    // router.push(`/${result.type}/${result.id}`)
    resetSearch();
  };

  return (
    <div className="relative ">
      <div className="relative">
        <motion.div
          className={`relative flex items-center rounded-full ${
            isExpanded
              ? 'bg-white/10 backdrop-blur-md border border-white/20'
              : 'bg-white/5 border border-white/10'
          }`}
          animate={{
            width: isExpanded ? '100%' : '240px',
          }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        >
          <motion.div
            className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400"
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
            placeholder="ابحث عن مسلسل,فيلم ..."
            className="w-full bg-transparent border-none - pl-10 pr-10 py-3 focus:outline-none text-white placeholder:text-gray-400"
          />

          <AnimatePresence>
            {searchQuery && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                onClick={resetSearch}
              >
                <X className="h-5 w-5" />
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              ref={resultsRef}
              className="absolute top-full left-0 right-0 mt-2 bg-[#12121A]/95 backdrop-blur-md rounded-xl border border-white/10 shadow-xl overflow-hidden"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            >
              {/* Categories */}
              <div className="flex items-center gap-2 p-3 border-b border-white/10 overflow-x-auto scrollbar-hide">
                {categories.map((category) => {
                  const Icon = category.icon;
                  const isActive = selectedCategory === category.id;

                  return (
                    <motion.button
                      key={category.id}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full whitespace-nowrap text-sm scrollbar-hide ${
                        isActive
                          ? 'bg-gradient-to-r from-primary to-secondary text-white'
                          : 'bg-white/5 hover:bg-white/10 text-gray-300 '
                      }`}
                      onClick={() => setSelectedCategory(category.id)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      <span>{category.label}</span>
                    </motion.button>
                  );
                })}
              </div>

              {/* Results */}
              <div className="max-h-[70vh] overflow-y-auto p-2">
                {results.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {results.map((result) => (
                      <motion.div
                        key={result.id}
                        className="flex gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer"
                        onClick={() => navigateToResult(result)}
                        whileHover={{ x: 5 }}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ type: 'spring' }}
                      >
                        <div className="relative h-20 w-14 rounded-md overflow-hidden flex-shrink-0">
                          <Image
                            src={result.image || '/placeholder.svg'}
                            alt={result.title}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                          <div className="absolute bottom-1 right-1">
                            {result.type === 'movie' && (
                              <Film className="h-3 w-3 text-white" />
                            )}
                            {result.type === 'series' && (
                              <Tv className="h-3 w-3 text-white" />
                            )}
                            {result.type === 'song' && (
                              <Music className="h-3 w-3 text-white" />
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col justify-between py-1">
                          <div>
                            <h4 className="text-sm font-medium text-white line-clamp-1">
                              {result.title}
                            </h4>
                            <div className="flex items-center gap-2 mt-1">
                              {result.rating && (
                                <div className="flex items-center text-xs text-yellow-400">
                                  <Star className="h-3 w-3 fill-yellow-400 mr-0.5" />
                                  <span>{result.rating}</span>
                                </div>
                              )}
                              {result.year && (
                                <span className="text-xs text-gray-400">
                                  {result.year}
                                </span>
                              )}
                              {result.duration && (
                                <div className="flex items-center text-xs text-gray-400">
                                  <Clock className="h-3 w-3 mr-0.5" />
                                  <span>{result.duration}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center text-xs text-purple-400 mt-1 group">
                            <span className="group-hover:underline">
                              عرض التفاصيل
                            </span>
                            <ArrowRight className="h-3 w-3 ml-1 transition-transform group-hover:translate-x-1" />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : searchQuery && !isLoading ? (
                  <div className="py-8 text-center">
                    <p className="text-gray-400">
                      لم يتم العثور على نتائج ل {searchQuery}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      جرب كلمات أخرى أو تصفح الأقسام الرئيسية
                    </p>
                  </div>
                ) : !isLoading ? (
                  <div className="py-8 text-center">
                    <p className="text-gray-400">ابحث عن فيلم أو مسلسل</p>
                    <p className="text-sm text-gray-500 mt-1">
                      ابحث عن فيلمك المفضل ومسلسلاتك المحبوبة وأكثر
                    </p>
                  </div>
                ) : null}

                {isLoading && (
                  <div className="py-12 flex justify-center items-center">
                    <div className="flex flex-col items-center">
                      <Loader2 className="h-8 w-8 text-purple-500 animate-spin mb-2" />
                      <p className="text-gray-400 animate-pulse">
                        جاري البحث...
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              {results.length > 0 && !isLoading && (
                <div className="p-3 border-t border-white/10 flex justify-between items-center">
                  <span className="text-xs text-gray-400">
                    {results.length} النتائج
                  </span>
                  <motion.button
                    className="text-xs text-purple-400 flex items-center"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() =>
                      router.push(
                        `/search?q=${encodeURIComponent(searchQuery)}`
                      )
                    }
                  >
                    عرض كل النتائج <ArrowRight className="h-3 w-3 ml-1" />
                  </motion.button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
