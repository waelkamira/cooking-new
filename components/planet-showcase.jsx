'use client';
import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Loader2,
  Star,
  Sparkles,
} from 'lucide-react';
import { FaArrowUp } from 'react-icons/fa';
import Stars from './stars/stars';
import Loading from './Loading';

export default function PlanetShowcase({
  route,
  planetName,
  planetImage,
  color,
  planetPath,
  isAdmin = false,
}) {
  const [page, setPage] = useState(1);
  const [series, setSeries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showTip, setShowTip] = useState(true);
  const [isVertical, setIsVertical] = useState(false);
  const [planetColor, setPlanetColor] = useState(color);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  // console.log('route', route, planetName, planetImage, color, planetPath);

  useEffect(() => {
    setPlanetColor(color);
  }, [color]);

  const [sliderRef, instanceRef] = useKeenSlider({
    loop: false,
    mode: 'free',
    rtl: true,
    vertical: isVertical,
    slides: {
      perView: isVertical ? 2 : 4,
      spacing: isVertical ? 16 : 20,
    },
    slideChanged(slider) {
      const currentSlide = slider.track.details.rel;
      const totalSlides = slider.track.details.slides.length;

      // تحميل المزيد عند الاقتراب من النهاية
      if (hasMore && currentSlide >= totalSlides - 3) {
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
    // إعادة تعيين حالة التحميل عند تغيير الصفحة
    if (page > 1) {
      fetchSeries();
    }
  }, [page]);

  useEffect(() => {
    // جلب البيانات الأولية عند التحميل
    if (page === 1) {
      fetchSeries();
    }

    const timer = setTimeout(() => {
      setShowTip(false);
    }, 10000);

    return () => clearTimeout(timer);
  }, []); // إزالة الاعتماد على page

  useEffect(() => {
    if (instanceRef.current) {
      instanceRef.current.update();
    }
  }, [series, isVertical, instanceRef]);

  // جلب المسلسلات
  const fetchSeries = useCallback(async () => {
    if (!hasMore && page > 1) return;
    if (!route) {
      setError('مسار API غير محدد');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const apiUrl = `/api/${route}?page=${page}&planetName=${planetName}&limit=6`;
      // console.log('جلب البيانات من:', apiUrl);

      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error(`فشل في جلب البيانات: ${response.status}`);
      }

      const data = await response.json();
      // console.log('بيانات المستلمة:', data);

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
      setError(`فشل في تحميل البيانات: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [page, hasMore, route, planetName]);

  const handleAddToFeatured = async (id) => {
    // في التطبيق الحقيقي، ستقوم باستدعاء API هنا
    console.log(`إضافة المسلسل ${id} إلى المميز`);

    // عرض رسالة نجاح
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

  // معالج أخطاء الصور
  const handleImageError = (e) => {
    e.target.src = '/placeholder.svg';
  };

  // إعادة المحاولة
  const handleRetry = () => {
    setPage(1);
    setSeries([]);
    setHasMore(true);
    setError(null);
    fetchSeries();
  };

  return (
    <motion.div
      className={
        (planetColor === 'red'
          ? 'bg-gradient-to-br from-red-100/10 via-red-400 to-red-100/10 '
          : planetColor === 'lime'
          ? 'bg-gradient-to-br from-lime-100/10 via-lime-400 to-lime-100/10 '
          : planetColor === 'purple'
          ? 'bg-gradient-to-br from-purple-100/10 via-purple-400 to-purple-100/10 '
          : planetColor === 'rose'
          ? 'bg-gradient-to-br from-rose-100/10 via-rose-400 to-rose-100/10 '
          : planetColor === 'fuchsia'
          ? 'bg-gradient-to-br from-fuchsia-100/10 via-fuchsia-400 to-fuchsia-100/10 '
          : planetColor === 'blue'
          ? 'bg-gradient-to-br from-blue-100/10 via-blue-400 to-blue-100/10 '
          : planetColor === 'pink'
          ? 'bg-gradient-to-br from-pink-100/10 via-pink-400 to-pink-100/10 '
          : planetColor === 'yellow'
          ? 'bg-gradient-to-br from-yellow-100/10 via-yellow-300 to-yellow-100/10 '
          : planetColor === 'orange'
          ? 'bg-gradient-to-br from-orange-100/10 via-orange-400 to-orange-100/10 '
          : 'bg-gradient-to-br from-gray-100/10 via-gray-400 to-gray-100/10 ') +
        ` relative w-full rounded-xl border border-white/40 p-6 shadow-xl mb-4`
      }
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* خلفية النجوم المتحركة */}
      <Stars />

      {/* زخارف الكواكب العائمة */}
      <div
        className="absolute top-10 left-10 w-20 h-20 rounded-full bg-white/10 blur-md animate-float"
        style={{ animationDelay: '0.5s' }}
      ></div>
      <div
        className="absolute bottom-20 right-10 w-16 h-16 rounded-full bg-gradient-to-br from-[#4facfe] to-[#00f2fe] opacity-20 blur-md animate-float"
        style={{ animationDelay: '1.2s' }}
      ></div>

      {/* الشعار مع تأثير التوهج */}
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
        <motion.div
          className="relative flex justify-center items-center flex-shrink-0"
          whileHover={{ scale: 1.05, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            onClick={() => router.push(planetPath)}
            className="relative h-32 w-52 sm:h-52 sm:w-80 mb-4 cursor-pointer"
          >
            <div className="absolute inset-0 bg-white rounded-full filter blur-xl opacity-40 animate-pulse"></div>
            <Image
              src={planetImage || '/placeholder.svg'}
              alt={planetName}
              fill
              className="object-contain drop-shadow-xl"
              onError={handleImageError}
            />
          </motion.div>

          {/* النجوم المدارية */}
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
                className={
                  (planetColor === 'red'
                    ? 'bg-red-400 '
                    : planetColor === 'lime'
                    ? 'bg-lime-400 '
                    : planetColor === 'purple'
                    ? 'bg-purple-400 '
                    : planetColor === 'rose'
                    ? 'bg-rose-400 '
                    : planetColor === 'fuchsia'
                    ? 'bg-fuchsia-400 '
                    : planetColor === 'blue'
                    ? 'bg-blue-400 '
                    : planetColor === 'pink'
                    ? 'bg-pink-400 '
                    : planetColor === 'orange'
                    ? 'bg-orange-400 '
                    : planetColor === 'yellow'
                    ? 'bg-yellow-400 '
                    : 'bg-blue-400 ') +
                  ` absolute w-2 h-2 rounded-full border border-white/20`
                }
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
          <div className="w-full space-y-2">
            <div className="sm:hidden flex items-center w-full px-8">
              <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-white to-transparent rounded-lg"></div>
            </div>
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex items-center gap-2"
            >
              <Sparkles className="text-white h-5 w-5 select-none" />
              <h1 className="text-2xl font-bold text-white my-2 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent select-none">
                كوكب {planetName}{' '}
              </h1>
            </motion.div>
          </div>

          <motion.p
            className="text-white/80 max-w-md select-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            استكشف عالماً مليئاً بالقصص الرائعة والمغامرات الشيقة على كوكب{' '}
            {planetName}
          </motion.p>
        </div>
      </div>

      {/* تلميح التنقل في المتزلقة */}
      <AnimatePresence>
        {showTip && (
          <motion.div
            className="h-12 w-fit"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="flex items-center gap-2 my-2 w-fit bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full text-white text-sm">
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
          </motion.div>
        )}
      </AnimatePresence>

      {/* رسالة الخطأ */}
      {error && (
        <motion.div
          className="mb-4 p-4 bg-red-500/20 backdrop-blur-sm rounded-lg border border-red-500/30 text-red-200 text-center"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p>{error}</p>
          <button
            onClick={handleRetry}
            className="mt-2 px-4 py-2 bg-red-500/30 hover:bg-red-500/40 rounded-lg transition-colors"
          >
            إعادة المحاولة
          </button>
        </motion.div>
      )}

      {/* متزلقة المسلسلات */}
      <div className="relative">
        <div
          ref={sliderRef}
          className={`keen-slider ${
            isVertical ? 'h-[500px]' : 'h-auto'
          } rounded-lg overflow-visible`}
        >
          {isLoading && series.length === 0 ? (
            <Loading />
          ) : series.length === 0 && !isLoading ? (
            <div className="flex items-center justify-center w-full h-64">
              <div className="text-center text-white/70">
                <p>لا توجد محتويات متاحة حالياً</p>
                <button
                  onClick={handleRetry}
                  className="mt-4 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                >
                  إعادة تحميل
                </button>
              </div>
            </div>
          ) : (
            Array.isArray(series) &&
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
                  {/* زر الإضافة للمميز (للمشرف) */}
                  {isAdmin && (
                    <motion.button
                      className="absolute top-2 right-2 z-10 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full p-1.5"
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

                  {/* صورة المسلسل */}
                  <div
                    className="relative aspect-[2/3] w-full cursor-pointer"
                    onClick={() =>
                      navigateToSeries(
                        item.title || item.seriesName || item.name
                      )
                    }
                  >
                    <Image
                      src={
                        item.imageUrl || item.seriesImage || '/placeholder.svg'
                      }
                      alt={item.title || item.seriesName || 'مسلسل'}
                      fill
                      className="object-cover transition-transform duration-500 hover:scale-110"
                      onError={handleImageError}
                    />

                    {/* تدرج اللون */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />

                    {/* شارة التقييم */}
                    {item.rating && (
                      <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/60 backdrop-blur-sm rounded-full px-2 py-1">
                        <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                        <span className="text-xs text-white">
                          {item.rating}
                        </span>
                      </div>
                    )}

                    {/* شارة الحلقات */}
                    {item.episodes && (
                      <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm rounded-full px-2 py-0.5">
                        <span className="text-xs text-white">
                          {item.episodes} حلقة
                        </span>
                      </div>
                    )}
                  </div>

                  {/* عنوان المسلسل */}
                  <div className="p-3">
                    <h3 className="text-sm font-medium text-white line-clamp-2">
                      {item.title || item.seriesName || item.name}
                    </h3>
                    {item.description && (
                      <p className="text-xs text-white/70 line-clamp-2 mt-1">
                        {item.description}
                      </p>
                    )}
                  </div>
                </motion.div>
              </div>
            ))
          )}

          {/* مؤشر تحميل المزيد */}
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

        {/* عناصر التحكم في المتزلقة */}
        {!isVertical && series.length > 0 && (
          <>
            <motion.button
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 h-10 w-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white shadow-lg border border-white/10 z-10"
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
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 h-10 w-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white shadow-lg border border-white/10 z-10"
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
