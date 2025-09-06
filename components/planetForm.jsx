'use client';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import React, { useContext, useEffect, useState } from 'react';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';
import { inputsContext } from './Context';
import Loading from './Loading';
import { motion, AnimatePresence } from 'framer-motion';
import AnimeCard from './anime-card';
import { Sparkle } from 'lucide-react';
import { FaPlaneArrival } from 'react-icons/fa';
import { FaPlane } from 'react-icons/fa6';

export default function PlanetForm({
  planetImage,
  planetName,
  planetSerieses,
  planetColor,
  route,
}) {
  const [page, setPage] = useState(1);
  const [mySerieses, setMySerieses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const { dispatch } = useContext(inputsContext);
  const session = useSession();
  console.log('route', route);

  useEffect(() => {
    fetchPlanetSerieses();
  }, [page, session]);

  const fetchPlanetSerieses = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/${route}?page=${page}&planetName=${planetName}&limit=6`
      );

      if (response.ok) {
        const data = await response.json();
        console.log('data', data);
        setMySerieses(
          data?.mockSeries || data?.series || data?.movies || data?.songs || []
        );
        setTotal(data?.pagination?.total - data?.pagination?.skip);
        dispatch({ type: 'MY_SERIESES', payload: data });
      }
    } catch (error) {
      console.error('Error fetching serieses:', error);
    } finally {
      setIsLoading(false);
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
  //! يجب تفعيل هذا قبل الرفع
  if (session?.status === 'unauthenticated') {
    // return <Login />;
  }

  return (
    <div
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
          : '') + ` min-h-screen pb-12 sm:mt-24 `
      }
    >
      {/* Header */}
      <div className="relative border border-white/20 bg-white/30 ">
        <motion.div
          className="relative flex justify-center items-center flex-shrink-0"
          whileTap={{ scale: 0.95 }}
        >
          <div className="relative h-[250px] w-full">
            <Image
              priority
              src={planetImage}
              layout="fill"
              objectFit="contain"
              alt={planetName}
              className="object-center mt-24"
            />
          </div>

          {/* Orbiting stars */}
          <motion.div
            className="absolute top-8 bottom-0 right-0 left-0 mx-auto my-auto pointer-events-none size-1/2"
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
                    ? 'bg-red-400/60 '
                    : planetColor === 'lime'
                    ? 'bg-lime-400/60 '
                    : planetColor === 'purple'
                    ? 'bg-purple-400/60 '
                    : planetColor === 'rose'
                    ? 'bg-rose-400/60 '
                    : planetColor === 'fuchsia'
                    ? 'bg-fuchsia-400/60 '
                    : planetColor === 'blue'
                    ? 'bg-blue-400/60 '
                    : planetColor === 'pink'
                    ? 'bg-pink-400/60 '
                    : planetColor === 'orange'
                    ? 'bg-orange-400/60 '
                    : planetColor === 'yellow'
                    ? 'bg-yellow-400/60 '
                    : 'bg-blue-400/60') +
                  ` absolute w-2 h-2 rounded-full border border-white/60`
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
      </div>
      {/* Main content */}
      <div className="container mx-auto p-4 relative mt-36">
        <div className="flex flex-col sm:flex-row justify-between items-center w-full">
          <motion.span
            className="flex justify-center items-center gap-2 font-bold sm:text-xl my-2 select-none text-white text-nowrap bg-white/20 rounded-full py-2 px-4 w-fit"
            whileHover={{ scale: 1.05 }}
          >
            كوكب {planetName}
            <span>
              <Sparkle className="text-amber-300" />
            </span>
          </motion.span>
          <motion.span
            className="flex justify-center items-center gap-2 font-bold sm:text-xl my-2 select-none text-white text-nowrap bg-white/20 rounded-full py-2 px-4 w-fit"
            whileHover={{ scale: 1.05 }}
          >
            عدد المسلسلات {total}
            <span>
              <FaPlane className="text-lime-400" />
            </span>
          </motion.span>
        </div>
        {/* Serieses list */}
        <div className="mb-8 mt-8 relative w-full rounded-xl border border-white/40 p-6 shadow-xl">
          <AnimatePresence mode="wait">
            {mySerieses?.length > 0 ? (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 justify-center items-center gap-4"
              >
                {mySerieses?.map((seriese, index) => (
                  <motion.div
                    key={seriese?.id || index}
                    variants={itemVariants}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 "
                  >
                    <AnimeCard
                      title={seriese?.seriesName}
                      image={seriese?.seriesImage}
                      type="Manga"
                      rating={4.9}
                    />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <Loading />
            )}
          </AnimatePresence>

          {/* Pagination */}
          {mySerieses?.length > 0 && (
            <div className="flex justify-center items-center mt-8">
              <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full p-1">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    if (mySerieses?.length >= 6) {
                      setPage(page + 1);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  }}
                  disabled={mySerieses?.length < 6}
                  className="h-10 w-10 rounded-full flex items-center justify-center text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <MdKeyboardArrowRight className="h-6 w-6" />
                </motion.button>
                <div className="px-4 font-medium text-white">الصفحة {page}</div>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    if (page > 1) {
                      setPage(page - 1);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  }}
                  disabled={page <= 1}
                  className="h-10 w-10 rounded-full flex items-center justify-center text-white disabled:opacity-50 disabled:cursor-not-allowed "
                >
                  <MdKeyboardArrowLeft className="h-6 w-6" />
                </motion.button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
