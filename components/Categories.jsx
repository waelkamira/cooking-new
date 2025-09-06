'use client';
import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaUtensils, FaArrowLeft } from 'react-icons/fa';

const categories = [
  {
    name: 'وجبة رئيسية',
    image: '/photo (12).png',
    icon: '🍲',
  },
  {
    name: 'معجنات',
    image: '/photo (13).png',
    icon: '🥐',
  },
  {
    name: 'شوربات',
    image: '/photo (14).png',
    icon: '🍜',
  },
  {
    name: 'مقبلات',
    image: '/photo (11).png',
    icon: '🥗',
  },
  {
    name: 'سلطات',
    image: '/photo (10).png',
    icon: '🥙',
  },
  {
    name: 'حلويات',
    image: '/photo (16).png',
    icon: '🍰',
  },
  {
    name: 'عصائر',
    image: '/photo (15).png',
    icon: '🧃',
  },
];

export default function CategoriesSlid() {
  const router = useRouter();
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <motion.div
      className="hidden xl:flex flex-col items-center justify-start p-4 w-full bg-gradient-to-b from-primary/20 to-secondary/20 rounded-xl shadow-lg overflow-hidden"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header */}
      <div className="flex items-center justify-center w-full mb-4">
        <div className="h-8 w-8 bg-white/20 rounded-full flex items-center justify-center mr-2">
          <FaUtensils className="text-white text-sm" />
        </div>
        <h2 className="text-lg text-nowrap font-bold text-white">
          ابحث حسب الصنف
        </h2>
      </div>

      {/* Categories List */}
      <div className="space-y-4 w-full">
        {categories.map((category, index) => (
          <motion.div
            key={index}
            className="w-full "
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            onHoverStart={() => setHoveredIndex(index)}
            onHoverEnd={() => setHoveredIndex(null)}
          >
            <div
              className="relative overflow-hidden rounded-xl cursor-pointer group text-center"
              onClick={() => router.push(`?searchedCategory=${category?.name}`)}
            >
              {/* Category Image with Overlay */}
              <div className="relative h-24 w-full overflow-hidden ">
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent z-10"></div>

                {/* Image */}
                <Image
                  src={category?.image || '/placeholder.svg'}
                  layout="fill"
                  objectFit="cover"
                  alt={category.name}
                  className="transition-transform duration-500 hover:scale-110"
                />

                {/* Category Info */}
                <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
                  <div className="flex items-center justify-center">
                    {/* <span className="text-2xl mr-3">{category.icon}</span> */}
                    <h3 className="text-white font-bold text-lg drop-shadow-md text-center w-full">
                      {category.name}
                    </h3>
                  </div>

                  <motion.div
                    animate={{
                      x: hoveredIndex === index ? 0 : 10,
                      opacity: hoveredIndex === index ? 1 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                    className="bg-white/20 backdrop-blur-sm p-1.5 rounded-full"
                  >
                    <FaArrowLeft className="text-white" />
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
