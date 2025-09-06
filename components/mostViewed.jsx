'use client';

import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Plus, Loader2, Star } from 'lucide-react';
import { FaArrowDown, FaArrowUp } from 'react-icons/fa';
import Stars from './stars/stars';
import Loading from './Loading';
export default function MostViewed({ path, isAdmin = false }) {
  const [page, setPage] = useState(1);
  const [series, setSeries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showTip, setShowTip] = useState(true);
  const [isVertical, setIsVertical] = useState(false);
  const router = useRouter();
  const [animateStars, setAnimateStars] = useState(false);
  const starsRef = useRef([]);

  // Mock data for demonstration
  const mockSeries = [
    {
      id: '1',
      seriesName: 'Space Adventure Chronicles',
      seriesImage: '/images/photo-1.png',
      rating: 4.8,
      episodes: 24,
    },

    {
      id: '2',
      seriesName: 'Cosmic Explorers',
      seriesImage: '/images/photo-2.png',
      rating: 4.7,
      episodes: 18,
    },
    {
      id: '3',
      seriesName: 'Stellar Odyssey',
      seriesImage: '/images/photo-3.png',
      rating: 4.9,
      episodes: 12,
    },
    {
      id: '4',
      seriesName: 'Galactic Pioneers',
      seriesImage: '/images/photo-4.png',
      rating: 4.6,
      episodes: 36,
    },
    {
      id: '5',
      seriesName: 'Nebula Voyagers',
      seriesImage: '/images/photo-5.png',
      rating: 4.5,
      episodes: 24,
    },
  ];

  const [sliderRef, instanceRef] = useKeenSlider({
    loop: false,
    mode: 'free',
    rtl: !isVertical,
    vertical: isVertical,
    slides: {
      perView: isVertical ? 2 : 4,
      spacing: isVertical ? 16 : 20,
    },
    slideChanged(slider) {
      const currentSlide = slider.track.details.rel;
      const totalSlides = slider.track.details.slides.length;

      // Load more when reaching near the end
      if (currentSlide >= totalSlides - 3) {
        setPage((prev) => prev + 1);
      }
    },
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleResize = () => {
        setIsVertical(window.innerWidth < 768);
      };

      handleResize();
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  useEffect(() => {
    fetchSeries();

    const timer = setTimeout(() => {
      setShowTip(false);
    }, 200000);

    return () => clearTimeout(timer);
  }, [page]);

  useEffect(() => {
    if (instanceRef.current) {
      instanceRef.current.update();
    }
  }, [series, isVertical]);

  const fetchSeries = async () => {
    setIsLoading(true);

    try {
      const apiUrl = `/api/most-viewed?page=${page}&limit=6&mostViewed=true`;

      // console.log('جلب البيانات من:', apiUrl);

      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error(`فشل في جلب البيانات: ${response.status}`);
      }

      const data = await response.json();
      console.log('بيانات المستلمة:', data);

      // التأكد من أن البيانات تحتوي على مصفوفة المسلسلات
      const receivedSeries =
        data.mockSeries || data.series || data.movies || data.songs || [];

      if (page === 1) {
        setSeries(receivedSeries);
      } else {
        setSeries((prev) => [...prev, ...receivedSeries]);
      }

      // التحقق إذا كان هناك المزيد من البيانات للتحميل
      setHasMore(
        receivedSeries.length > 0 &&
          page * 6 < (data.pagination?.total || Infinity)
      );
    } catch (error) {
      console.error('خطأ في جلب المسلسلات:', error);
    } finally {
      setIsLoading(false);
    }
    // setTimeout(() => {
    //   const existingIds = new Set(series.map((item) => item.id));
    //   const newSeries = mockSeries.filter((item) => !existingIds.has(item.id));

    //   if (newSeries.length > 0) {
    //     setSeries((prev) => [...prev, ...newSeries]);
    //   }

    //   setIsLoading(false);
    // }, 1000);
  };

  const handleAddToFeatured = async (id) => {
    // In a real app, you would call your API
    console.log(`Adding series ${id} to featured`);

    // Show success animation
    const seriesElement = document.getElementById(`series-${id}`);
    if (seriesElement) {
      seriesElement.classList.add('animate-pulse');
      setTimeout(() => {
        seriesElement.classList.remove('animate-pulse');
      }, 1000);
    }
  };

  const navigateToSeries = (seriesName) => {
    router.push(`/series/${encodeURIComponent(seriesName)}`);
  };

  return (
    <motion.div
      className={`bg-gradient-to-br from-teal-100/10 via-teal-400 to-teal-100/10 
         relative w-full rounded-xl border border-white/40 p-6 shadow-xl mb-4`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Stars />

      {/* Planet Header */}
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
        <motion.div
          className="relative h-24 w-24 sm:h-32 sm:w-32 flex-shrink-0"
          whileHover={{ scale: 1.05, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
        >
          <div
            className="relative h-24 w-24 sm:h-32 sm:w-32 flex-shrink-0 hover:cursor-pointer"
            onClick={() => router.push(path)}
          >
            <Image
              src={'/images/fish.png'}
              alt={'mostViewed'}
              fill
              className="object-contain drop-shadow-xl"
            />
          </div>

          {/* Orbiting stars */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            animate={{ rotate: 360 }}
            transition={{
              duration: 20,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'linear',
            }}
          >
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className={`bg-cyan-400 absolute w-2 h-2 rounded-full border border-white/20`}
                style={{
                  top: `${15 + i * 30}%`,
                  left: `${50 + Math.cos(i * 2) * 40}%`,
                }}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.7, 1, 0.7],
                }}
                transition={{
                  duration: 2 + i,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: i * 0.5,
                }}
              />
            ))}
          </motion.div>
        </motion.div>

        <div className="text-center sm:text-left">
          <motion.h2
            className="text-2xl sm:text-3xl font-bold text-white mb-2 select-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            الأكثر مشاهدة
          </motion.h2>
          <motion.p
            className="text-white/80 max-w-md select-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            هذه المسلسلات الأعلى مشاهدة{' '}
          </motion.p>
        </div>
      </div>

      {/* Slider Navigation Tip */}
      <AnimatePresence>
        <motion.div
          className=" h-12 w-fit"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          {showTip && (
            <div className=" flex items-center gap-2 my-2 w-fit bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full text-white text-sm">
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
              >
                {isVertical ? (
                  <FaArrowUp className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </motion.div>
              <span className="select-none">اسحب للمزيد</span>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Series Slider */}
      <div className="relative">
        <div
          ref={sliderRef}
          className={`keen-slider ${
            isVertical ? 'h-[500px]' : 'h-auto'
          } rounded-lg overflow-visible`}
        >
          {series.length === 0 && isLoading ? (
            <Loading />
          ) : (
            series.map((item) => (
              <div
                key={item.id}
                id={`series-${item.id}`}
                className="keen-slider__slide"
              >
                <motion.div
                  className="relative flex flex-col h-full rounded-lg overflow-hidden bg-black/20 backdrop-blur-sm"
                  whileHover={{ y: -5, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Admin Add Button */}
                  {isAdmin && (
                    <motion.button
                      className="absolute top-2 right-2  bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full p-1.5"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToFeatured(item.id);
                      }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Plus className="h-4 w-4 text-white" />
                    </motion.button>
                  )}

                  {/* Series Image */}
                  <div
                    className="relative aspect-[2/3] w-full cursor-pointer"
                    onClick={() => navigateToSeries(item.seriesName)}
                  >
                    <Image
                      src={item.seriesImage || '/placeholder.svg'}
                      alt={item.seriesName}
                      fill
                      className="object-cover transition-transform duration-500 hover:scale-110"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />

                    {/* Rating Badge */}
                    {item.rating && (
                      <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/60 backdrop-blur-sm rounded-full px-2 py-1">
                        <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                        <span className="text-xs text-white">
                          {item.rating * 1000}
                        </span>
                      </div>
                    )}

                    {/* Episodes Badge */}
                    {item.episodes && (
                      <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm rounded-full px-2 py-0.5">
                        <span className="text-xs text-white">
                          {item.episodes} eps
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Series Title */}
                  <div className="p-3">
                    <h3 className="text-sm font-medium text-white line-clamp-2">
                      {item.seriesName}
                    </h3>
                  </div>
                </motion.div>
              </div>
            ))
          )}

          {/* Load More Indicator */}
          {isLoading && series.length > 0 && (
            <div className="keen-slider__slide flex items-center justify-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: 'linear',
                }}
              >
                <Loader2 className="h-8 w-8 text-white/70" />
              </motion.div>
            </div>
          )}
        </div>

        {/* Slider Controls */}
        {!isVertical && (
          <>
            <motion.button
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2  h-10 w-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white shadow-lg border border-white/10"
              onClick={() => instanceRef.current?.prev()}
              whileHover={{
                scale: 1.1,
                backgroundColor: 'rgba(255,255,255,0.3)',
              }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronLeft className="h-6 w-6" />
            </motion.button>

            <motion.button
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2  h-10 w-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white shadow-lg border border-white/10"
              onClick={() => instanceRef.current?.next()}
              whileHover={{
                scale: 1.1,
                backgroundColor: 'rgba(255,255,255,0.3)',
              }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronRight className="h-6 w-6" />
            </motion.button>
          </>
        )}
      </div>
    </motion.div>
  );
}
