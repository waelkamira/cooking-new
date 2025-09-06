'use client';
import SmallItem from '../../components/SmallItem';
import Image from 'next/image';
import BackButton from '../../components/BackButton';
import SideBarMenu from '../../components/SideBarMenu';
import { TfiMenuAlt } from 'react-icons/tfi';
import Button from '../../components/Button';
import Loading from '../../components/Loading';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUtensils, FaDice, FaRandom } from 'react-icons/fa';
import { FaArrowLeft } from 'react-icons/fa6';
import Logo from '../../components/photos/logo';

export default function WhatToCookToday() {
  const [isOpen, setIsOpen] = useState(false);
  const [randomCookingRecipes, setRandomCookingRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isShuffling, setIsShuffling] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0); // مفتاح التحديث

  useEffect(() => {
    fetchAllMainCookingRecipes();
  }, []);

  const fetchAllMainCookingRecipes = async () => {
    setIsLoading(true);
    setIsShuffling(true);
    try {
      const response = await fetch(
        '/api/allCookingRecipes?limit=8&random=true'
      );
      if (response.ok) {
        const json = await response.json();
        setRandomCookingRecipes(json);
        setRefreshKey((prevKey) => prevKey + 1); // تحديث المفتاح
      }
    } catch (error) {
      console.error('Error fetching recipes:', error);
    } finally {
      setIsLoading(false);
      setIsShuffling(false);
    }
  };

  const toggleFavorite = (id) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter((favId) => favId !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };

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
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };
  // from-[#ff6e30] to-[#121A2F]

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#ff6e30] to-[#121A2F] pb-12">
      {/* Header */}
      <div className="relative">
        {/* Background image with overlay */}
        <div className="relative h-[300px] w-full overflow-hidden">
          {/* الشعار الجانبي */}
          <Logo />

          <div className="absolute inset-0 bg-black/10 z-10"></div>
          <Image
            priority
            src="/photo (31).png"
            layout="fill"
            objectFit="cover"
            alt="Food background"
            className="object-center"
          />

          {/* Back button */}
          <div className="absolute top-4 left-4 z-50 cursor-pointer">
            <Link href="/">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="bg-white/20 backdrop-blur-sm p-3 rounded-full text-white hover:bg-white/30 transition-colors"
              >
                <FaArrowLeft className="h-5 w-5" />
              </motion.button>
            </Link>
          </div>

          {/* Menu button */}
          <div className="absolute top-4 right-4 z-50">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsOpen(!isOpen)}
              className="bg-white/20 backdrop-blur-sm p-3 rounded-full text-white hover:bg-white/30 transition-colors"
            >
              <TfiMenuAlt className="h-5 w-5" />
            </motion.button>
          </div>

          {/* Mobile menu */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, x: 300 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 300 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
                onClick={() => setIsOpen(false)}
              >
                <div
                  className="absolute top-0 right-0 h-full w-[80%] max-w-sm"
                  onClick={(e) => e.stopPropagation()}
                >
                  <SideBarMenu setIsOpen={setIsOpen} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Page title */}
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-white">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl md:text-5xl font-bold mb-4 text-center"
            >
              شو أطبخ اليوم؟
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-lg text-white/90 max-w-xl text-center px-4"
            >
              احصل على اقتراحات لوصفات شهية لوجبة اليوم
            </motion.p>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 -mt-16 relative z-30">
        {/* Suggestion card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-xl overflow-hidden mb-12"
        >
          <div className="p-4 sm:p-6 md:p-8">
            <div className="flex justify-center sm:justify-start items-center mb-6 w-full">
              <div className="size-12 bg-orange-500 rounded-full flex items-center justify-center mx-2 min-w-12">
                <FaUtensils className="h-6 w-full text-white" />
              </div>
              <div>
                <h2 className="text-md lg:text-2xl font-bold text-gray-800">
                  اقتراحات الطبخ
                </h2>
                <p className="text-sm lg:text-lg text-gray-600">
                  اضغط على الزر للحصول على ثلاث أفكار جديدة لطبخة اليوم
                </p>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => fetchAllMainCookingRecipes()}
              disabled={isShuffling}
              className="w-full bg-gradient-to-r from-[#ff6e30] to-secondary text-white font-bold py-2 lg:py-4 px-6 rounded-full shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isShuffling ? (
                <div className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  جاري الاقتراح...
                </div>
              ) : (
                <>
                  <FaDice className="h-5 w-5 ml-2" />
                  اقتراح أفكار جديدة
                </>
              )}
            </motion.button>
          </div>
        </motion.div>

        {/* Recipe suggestions */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl lg:text-2xl font-bold text-white flex items-center">
              <FaRandom className="ml-2" />
              الأفكار المقترحة لطبخة اليوم
            </h2>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center min-h-[300px] bg-white/10 backdrop-blur-sm rounded-xl">
              <Loading />
            </div>
          ) : (
            <AnimatePresence mode="wait" key={refreshKey}>
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {randomCookingRecipes.length > 0 ? (
                  randomCookingRecipes.map((recipe, index) => (
                    <motion.div
                      key={recipe.id || index}
                      variants={itemVariants}
                      transition={{ duration: 0.3 }}
                      className="transform transition-all duration-300 hover:-translate-y-2"
                    >
                      <SmallItem recipe={recipe} index={index} show={false} />
                    </motion.div>
                  ))
                ) : (
                  <motion.div
                    variants={itemVariants}
                    className="col-span-full flex flex-col items-center justify-center bg-white/10 backdrop-blur-sm rounded-xl p-8 text-center"
                  >
                    <div className="h-20 w-20 bg-white/20 rounded-full flex items-center justify-center mb-4">
                      <FaUtensils className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      لا توجد وصفات متاحة
                    </h3>
                    <p className="text-white/80 mb-6">
                      لم نتمكن من العثور على وصفات. يرجى المحاولة مرة أخرى
                      لاحقاً.
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={fetchAllMainCookingRecipes}
                      className="bg-gradient-to-r from-[#ff6e30] to-secondary text-white border font-bold py-2 px-6 rounded-full shadow-md hover:shadow-lg"
                    >
                      إعادة المحاولة
                    </motion.button>
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </div>

        {/* Tips section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="bg-white/10 backdrop-blur-sm rounded-xl p-4 sm:p-6 md:p-8 text-white"
        >
          <h3 className="text-xl font-bold mb-4">نصائح للطبخ</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white/10 rounded-lg p-4">
              <h4 className="flex justify-start items-center gap-2 font-bold mb-2 text-sm">
                <span className="h-6 w-6 bg-white/20 rounded-full flex items-center justify-center mr-2 text-sm">
                  1
                </span>
                خطط لوجباتك مسبقاً
              </h4>
              <p className="text-white/80 text-sm">
                التخطيط المسبق للوجبات يساعدك على توفير الوقت والجهد ويضمن تناول
                وجبات متوازنة.
              </p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <h4 className="flex justify-start items-center gap-2 font-bold mb-2 text-sm">
                <span className="h-6 w-6 bg-white/20 rounded-full flex items-center justify-center mr-2 text-sm">
                  2
                </span>
                استخدم المكونات الموسمية
              </h4>
              <p className="text-white/80 text-sm">
                المكونات الموسمية تكون أكثر طزاجة ونكهة وغالباً ما تكون أقل
                تكلفة.
              </p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <h4 className="flex justify-start items-center gap-2 font-bold mb-2 text-sm ">
                <span className="h-6 w-6 bg-white/20 rounded-full flex items-center justify-center mr-2 text-sm">
                  3
                </span>
                جرب وصفات جديدة
              </h4>
              <p className="text-white/80 text-sm">
                تجربة وصفات جديدة تضيف تنوعاً لمائدتك وتساعدك على تطوير مهاراتك
                في الطبخ.
              </p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <h4 className="flex justify-start items-center gap-2 font-bold mb-2 text-sm">
                <span className="h-6 w-6 bg-white/20 rounded-full flex items-center justify-center mr-2 text-sm">
                  4
                </span>
                حضّر وجبات إضافية
              </h4>
              <p className="text-white/80 text-sm">
                طبخ كميات إضافية يوفر لك وجبات جاهزة للأيام المزدحمة ويقلل من
                هدر الطعام.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
