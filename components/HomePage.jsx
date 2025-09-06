'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SearchBar from './SearchBar';
import NewRecipeButton from './NewRecipeButton';
import AllCookingRecipes from './AllCookingRecipes';
import { useSession } from 'next-auth/react';
import SideBarMenu from './SideBarMenu';
import { TfiMenuAlt } from 'react-icons/tfi';
import { FaUtensils, FaHeart, FaBookOpen } from 'react-icons/fa';
import CategoriesSlides from './CategoriesSlides';
import { Suspense } from 'react';
import Loading from './Loading';
import SideBar from './SideBar';
import { MdEmojiFoodBeverage } from 'react-icons/md';
import ChatBot from './chatbot/Chatbot';

export default function HomePage() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    if (typeof window !== 'undefined' && session?.user?.image) {
      localStorage.setItem('image', JSON.stringify(session.user.image));
    }
  }, [session]);

  return (
    <Suspense fallback={<Loading />}>
      <div className="min-h-screen w-full bg-gradient-to-b from-four to-gray-100 z-10">
        {/* Header with background image */}
        <div className="relative">
          {/* Background image with overlay */}
          <div className="relative h-[300px] md:h-[400px] lg:h-[500px] w-full overflow-hidden">
            <div className="absolute inset-0  z-10"></div>
            <Image
              priority
              src="/photo (5).png"
              layout="fill"
              objectFit="cover"
              alt="صورة الخلفية"
              className="object-center"
            />

            {/* Mobile menu button */}
            <div className="absolute xl:hidden z-50 top-4 right-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 bg-gradient-to-r from-secondary to bg-primary backdrop-blur-sm rounded-full text-white hover:scale-105 transition-all ease-in-out duration-200"
              >
                <TfiMenuAlt className="text-2xl lg:text-3xl" />
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
                    className="absolute top-0 right-0 h-full w-[80%] max-w-sm shadow-xl"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <SideBarMenu setIsOpen={setIsOpen} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Header content */}
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-white px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center"
              >
                <h1 className="hidden md:block text-3xl md:text-5xl font-bold mt-4 xl:mt-28">
                  عالم الطبخ والوصفات الشهية
                </h1>
                <p className="text-sm md:text-xl text-white/90 mb-6 max-w-2xl mx-10">
                  استكشف مجموعة متنوعة من الوصفات اللذيذة من مختلف المطابخ
                  العالمية
                </p>

                {/* Search bar in header */}
                <div className="max-w-2xl mx-auto w-full">
                  <SearchBar />
                </div>
              </motion.div>
            </div>
          </div>

          {/* Floating action buttons */}
          <div className="container flex justify-center sm:justify-end items-center mx-auto px-4 w-full">
            <NewRecipeButton />
          </div>
        </div>

        {/* Main content */}
        <div className="container flex flex-col justify-center items-center mx-auto px-0 py-8 w-full">
          {/* <ChatBot /> */}
          <motion.div className="flex flex-col items-start justify-start w-full">
            {/* Feature cards */}
            <div className="hidden lg:grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {[
                {
                  icon: <FaUtensils className="text-3xl" />,
                  title: 'وصفات متنوعة',
                  description:
                    'استكشف مجموعة واسعة من الوصفات لجميع الأذواق والمناسبات',
                },
                {
                  icon: <FaHeart className="text-3xl" />,
                  title: 'وصفات صحية',
                  description:
                    'وصفات صحية ولذيذة تناسب جميع أنماط الحياة والاحتياجات الغذائية',
                },
                {
                  icon: <FaBookOpen className="text-3xl" />,
                  title: 'شارك وصفاتك',
                  description:
                    'شارك وصفاتك المفضلة مع مجتمعنا وألهم الآخرين بإبداعاتك',
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-xl p-6 shadow-md transition-shadow"
                >
                  <div className="h-14 w-14 rounded-full bg-gradient-to-r from-primary to-secondary text-white flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              ))}
            </div>

            {/* Categories section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="mb-8 w-full"
            >
              <div className="hidden lg:flex items-center justify-between mb-4 w-full p-4">
                <div className="bg-white rounded-xl p-6 shadow-md transition-shadow">
                  <div className="h-14 w-14 rounded-full bg-gradient-to-r from-primary to-secondary text-white flex items-center justify-center mb-4">
                    <FaBookOpen className="text-3xl" />
                  </div>
                  <h2 className=" text-xl font-bold">تصفح حسب التصنيف</h2>
                </div>
                <div className="h-14 w-14 rounded-full bg-gradient-to-r from-primary to-secondary text-white flex items-center justify-center mb-4">
                  <MdEmojiFoodBeverage className="text-3xl" />
                </div>
              </div>
              <div className="bg-white rounded-xl lg:p-4 shadow-md">
                <CategoriesSlides />
              </div>
            </motion.div>

            {/* Latest recipes section */}
            <div className="flex justify-center items-center gap-2 mb-6 w-full bg-white rounded-xl p-6 shadow-md transition-shadow">
              <div className="size-10 lg:size-14 rounded-full bg-gradient-to-r from-primary to-secondary text-white flex items-center justify-center mb-4">
                <FaUtensils className="text-white text-2xl lg:text-4xl" />
              </div>
              <h2 className="text-2xl font-bold">أحدث الوصفات</h2>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="flex justify-center items-start w-full "
            >
              {' '}
              <SideBar />
              <div className="flex flex-col items-start justify-start w-full">
                <AllCookingRecipes />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </Suspense>
  );
}
