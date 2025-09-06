'use client';

import Image from 'next/image';
import React from 'react';
import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

const animation = { duration: 40000, easing: (t) => t };

const categories = [
  { name: 'وجبة رئيسية', image: '/photo (5).png' },
  { name: 'معجنات', image: '/photo (6).png' },
  { name: 'شوربات', image: '/photo (7).png' },
  { name: 'مقبلات', image: '/photo (11).png' },
  { name: 'سلطات', image: '/photo (10).png' },
  { name: 'حلويات', image: '/photo (9).png' },
  { name: 'عصائر', image: '/photo (8).png' },
];

export default function Categories() {
  const router = useRouter();

  const [sliderRef] = useKeenSlider({
    loop: true,
    renderMode: 'performance',
    drag: false,
    breakpoints: {
      '(max-width: 767px)': {
        // للشاشات الصغيرة (أقل من 768px)
        slides: {
          perView: 2,
          spacing: 10,
        },
      },
      '(min-width: 768px) and (max-width: 1023px)': {
        // للشاشات المتوسطة (768px - 1023px)
        slides: {
          perView: 3, // أو أي عدد يناسب تصميمك
          spacing: 18,
        },
      },
      '(min-width: 1024px)': {
        // للشاشات الكبيرة (أكبر من أو تساوي 1024px)
        slides: {
          perView: 4,
          spacing: 20,
        },
      },
    },
    created(s) {
      s.moveToIdx(5, true, animation);
    },
    updated(s) {
      s.moveToIdx(s.track.details?.abs + 5, true, animation);
    },
    animationEnded(s) {
      s.moveToIdx(s.track.details?.abs + 5, true, animation);
    },
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.75, ease: 'easeOut' }}
      className="w-full py-12 px-2 lg:px-6 rounded-3xl relative overflow-hidden"
    >
      {/* Enhanced Background Decoration */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 left-0 w-full h-full opacity-20 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-1/2 h-1/2 opacity-20 blur-3xl" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto">
        <h2 className="text-xl sm:text-3xl md:text-4xl font-bold text-black text-center mb-8 tracking-tight ">
          استكشف الوصفات حسب الصنف
        </h2>
        <div
          ref={sliderRef}
          className="keen-slider rounded-xl overflow-visible"
        >
          {categories.map((category, index) => (
            <motion.div
              key={index}
              whileTap={{ scale: 0.95 }}
              className="keen-slider__slide flex flex-col items-center rounded-xl overflow-hidden cursor-pointer hover:scale-105"
              onClick={() => router.push(`?searchedCategory=${category?.name}`)}
            >
              {/* Category Image */}
              <div className="relative min-w-56 h-32 sm:w-72 sm:h-40 md:w-80 md:h-48 lg:w-96 lg:h-56 rounded-xl overflow-hidden shadow-lg">
                {/* تم تغيير rounded-3xl إلى rounded-xl */}
                <Image
                  src={category?.image}
                  alt={category?.name}
                  layout="fill"
                  objectFit="cover"
                  className="transition-all duration-300 hover:scale-110 rounded-xl" /* تم إضافة rounded-xl هنا */
                  priority
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 rounded-xl" />{' '}
                {/*تم إضافة rounded-xl هنا لكي يتناسق مع الصورة */}
                {/* Category Name */}
                <h3 className="absolute bottom-4 left-4 right-4 text-xl font-semibold text-white text-center select-none">
                  {category?.name}
                </h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
