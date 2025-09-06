'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play, Star, Calendar } from 'lucide-react';

const carouselItems = [
  {
    id: 1,
    title: 'سالي',
    description: 'شاهد جميع حلقات ',
    // image: '/placeholder.svg?height=600&width=1200',
    image: '/images/photo-1.png',
    rating: 4.9,
    year: 2019,
    genres: ['دراما', 'زمردة', 'مغامرات'],
    isNew: true,
  },
  {
    id: 2,
    title: 'عهد الأصدقاء',
    description: 'شاهد جميع حلقات ',
    // image: '/placeholder.svg?height=600&width=1200',
    image: '/images/photo-2.png',
    rating: 4.8,
    year: 2023,
    genres: ['دراما', 'مغامرات'],
    isNew: true,
  },
  {
    id: 3,
    title: 'الكابتن ماجد',
    description: 'شاهد جميع حلقات ',
    // image: '/placeholder.svg?height=600&width=1200',
    image: '/images/photo-3.png',
    rating: 4.7,
    year: 2020,
    genres: ['رياضة'],
    isNew: false,
  },
  {
    id: 4,
    title: 'نوار',
    description: 'شاهد جميع حلقات ',
    // image: '/placeholder.svg?height=600&width=1200',
    image: '/images/photo-4.png',
    rating: 4.7,
    year: 2020,
    genres: ['دراما', 'زمردة'],
    isNew: false,
  },
  {
    id: 5,
    title: 'داي الشجاع',
    description: 'شاهد جميع حلقات ',
    // image: '/placeholder.svg?height=600&width=1200',
    image: '/images/photo-5.png',
    rating: 4.7,
    year: 2020,
    genres: ['أكشن'],
    isNew: false,
  },
  {
    id: 6,
    title: 'بابار',
    description: 'شاهد جميع حلقات ',
    // image: '/placeholder.svg?height=600&width=1200',
    image: '/images/photo-6.png',
    rating: 4.7,
    year: 2020,
    genres: ['طبيعي'],
    isNew: false,
  },
  {
    id: 7,
    title: 'فريق الصقور',
    description: 'شاهد جميع حلقات ',
    // image: '/placeholder.svg?height=600&width=1200',
    image: '/images/photo-7.png',
    rating: 4.7,
    year: 2020,
    genres: ['رياضة'],
    isNew: false,
  },
  {
    id: 8,
    title: 'القناص',
    description: 'شاهد جميع حلقات ',
    // image: '/placeholder.svg?height=600&width=1200',
    image: '/images/photo-8.png',
    rating: 4.7,
    year: 2020,
    genres: ['أكشن'],
    isNew: false,
  },
  {
    id: 9,
    title: 'مدرسة الكونغ فو',
    description: 'شاهد جميع حلقات ',
    // image: '/placeholder.svg?height=600&width=1200',
    image: '/images/photo-9.png',
    rating: 4.7,
    year: 2020,
    genres: ['رياضة'],
    isNew: false,
  },
  {
    id: 10,
    title: 'تيمون وبومبا',
    description: 'شاهد جميع حلقات ',
    // image: '/placeholder.svg?height=600&width=1200',
    image: '/images/photo-10.png',
    rating: 4.7,
    year: 2020,
    genres: ['طبيعي', 'مغامرات'],
    isNew: false,
  },
  {
    id: 11,
    title: 'ون بيس',
    description: 'شاهد جميع حلقات ',
    // image: '/placeholder.svg?height=600&width=1200',
    image: '/images/photo-11.png',
    rating: 4.7,
    year: 2020,
    genres: ['أكشن', 'مغامرات'],
    isNew: false,
  },
];

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);

  const next = () => {
    setCurrent((current + 1) % carouselItems.length);
  };

  const prev = () => {
    setCurrent((current - 1 + carouselItems.length) % carouselItems.length);
  };

  useEffect(() => {
    if (!isAutoplay) return;

    const interval = setInterval(() => {
      next();
    }, 6000);

    return () => clearInterval(interval);
  }, [current, isAutoplay]);

  return (
    <div className="relative h-[300px] md:h-[600px] overflow-hidden -">
      <AnimatePresence mode="wait">
        {carouselItems.map(
          (item, index) =>
            index === current && (
              <motion.div
                key={item?.id}
                className="absolute inset-0 "
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A12] via-[#0A0A12]/60 to-transparent "></div>
                <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A12] via-transparent to-transparent "></div>

                <Image
                  src={item?.image || '/placeholder.svg'}
                  alt={item?.title}
                  fill
                  objectFit="fill"
                  className="object-cover "
                  priority
                />

                <div className="absolute inset-0  flex items-center">
                  <div className="container mx-auto px-4">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="max-w-2xl"
                    >
                      {item?.isNew && (
                        <span className="inline-flex items-center rounded-full bg-gradient-to-r from-primary to-secondary hover:bg-primary px-2.5 py-0.5 text-xs font-semibold text-white mb-4">
                          جديد
                        </span>
                      )}

                      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                        {item?.title}
                      </h1>

                      <p className="text-lg text-gray-300 mb-6 max-w-xl">
                        {item?.description} {item?.title} على موقعنا
                      </p>

                      <div className="flex items-center gap-4 mb-6">
                        <div className="flex items-center">
                          <Star className="h-5 w-5 text-yellow-400 fill-yellow-400 mr-1" />
                          <span>{item?.rating}</span>
                        </div>
                        <div className="flex items-center text-gray-300">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>{item?.year}</span>
                        </div>
                        <div className="flex gap-2">
                          {item?.genres.map((genre) => (
                            <span
                              key={genre}
                              className="text-sm bg-white/10 px-2 py-1 rounded-full"
                            >
                              {genre}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-4">
                        <motion.button
                          className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-primary to-secondary hover:bg-primary px-6 py-2.5 text-white font-medium"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Play className="mr-2 h-4 w-4" />
                          شاهد الأن
                        </motion.button>
                        <motion.button
                          className="inline-flex items-center justify-center rounded-full border border-white/20 bg-transparent px-6 py-2.5 text-white font-medium hover:bg-white/10"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          إضافة إلى قائمة المشاهدة
                        </motion.button>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            )
        )}
      </AnimatePresence>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2  flex items-center gap-2">
        {carouselItems.map((_, index) => (
          <button
            key={index}
            className={`h-2 rounded-full transition-all ${
              index === current
                ? 'w-8 bg-gradient-to-r from-primary to-secondary'
                : 'w-2 bg-white/30'
            }`}
            onClick={() => setCurrent(index)}
          />
        ))}
      </div>

      <button
        className="absolute left-4 top-1/2 -translate-y-1/2  h-10 w-10 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/50 transition-colors"
        onClick={prev}
        onMouseEnter={() => setIsAutoplay(false)}
        onMouseLeave={() => setIsAutoplay(true)}
      >
        <ChevronLeft className="h-6 w-6" />
      </button>

      <button
        className="absolute right-4 top-1/2 -translate-y-1/2  h-10 w-10 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/50 transition-colors"
        onClick={next}
        onMouseEnter={() => setIsAutoplay(false)}
        onMouseLeave={() => setIsAutoplay(true)}
      >
        <ChevronRight className="h-6 w-6" />
      </button>
    </div>
  );
}
