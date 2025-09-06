// React Component (with localStorage clearing)
import React, { useEffect, useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { inputsContext } from '../components/Context';
import SmallItem from '../components/SmallItem';
import Loading from '../components/Loading';
import { MdKeyboardArrowRight, MdKeyboardArrowLeft } from 'react-icons/md';
import { FaUtensils, FaSearch } from 'react-icons/fa';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { fakeData } from '../fakeData';
// console.log('fakeData', fakeData);
export default function AllCookingRecipes() {
  const [pageNumber, setPageNumber] = useState(1);
  const [allCookingRecipes, setAllCookingRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { dispatch, newRecipe, deletedRecipe } = useContext(inputsContext);
  const session = useSession();
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    fetchAllCookingRecipes();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [newRecipe, deletedRecipe, pageNumber]);

  const fetchAllCookingRecipes = async () => {
    setIsLoading(true);
    setErrorMessage(null); // Clear previous error messages
    const cacheKey = `allCookingRecipes_page_${pageNumber}`;

    try {
      const cachedRecipes = localStorage.getItem(cacheKey);

      if (cachedRecipes) {
        const parsedRecipes = JSON.parse(cachedRecipes);
        setAllCookingRecipes(parsedRecipes);
      } else {
        const response = await fetch(
          `/api/allCookingRecipes?page=${pageNumber}&limit=6`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const json = await response.json();

        setAllCookingRecipes(json);
        localStorage.setItem(cacheKey, JSON.stringify(json));
        dispatch({ type: 'SET_RECIPES', payload: json });
      }
    } catch (error) {
      console.error('Error fetching or retrieving recipes:', error);
      setErrorMessage('حدثت مشكلة ما حاول مرة أخرى لاحقا.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (newRecipe || deletedRecipe) {
      localStorage.removeItem(`allCookingRecipes_page_${pageNumber}`); // Clear specific page
    }
  }, [newRecipe, deletedRecipe, pageNumber]);

  const hasRecipes =
    allCookingRecipes &&
    allCookingRecipes.meals &&
    allCookingRecipes.meals.length > 0;

  const handleNextPage = () => {
    setPageNumber((prev) => prev + 1);
    // window.scrollTo({ top: 52, behavior: 'smooth' });
  };

  const handlePreviousPage = () => {
    setPageNumber((prev) => Math.max(prev - 1, 1));
    // window.scrollTo({ top: 52, behavior: 'smooth' });
  };

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

  return (
    <div className="flex flex-col items-center w-full rounded-2xl xl:rounded-r-sm xl:rounded-l-2xl overflow-hidden  border-l">
      <div className="w-full bg-gradient-to-r from-secondary to-primary text-white p-4 md:p-6">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h1 className="text-xl md:text-2xl font-bold flex items-center">
                <FaUtensils className="mr-2" /> وصفات شهية
              </h1>
              <p className="mt-2 text-white text-sm md:text-lg">
                استكشف مجموعة متنوعة من الوصفات اللذيذة من مختلف المطابخ
              </p>
            </div>

            {session?.status === 'authenticated' && (
              <Link
                href="/newRecipe"
                className="px-4 py-2 bg-white text-primary rounded-full font-medium hover:bg-orange-50 transition-colors shadow-md hover:shadow-lg flex items-center text-sm md:text-base"
              >
                <span className="mr-2">+</span> إضافة وصفة جديدة
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="w-full p-2 md:p-4">
        {/* <AnimatePresence mode="wait">
          {isLoading ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <Loading />
            </div>
          ) : errorMessage ? (
            <div className="text-red-500">{errorMessage}</div>
          ) : hasRecipes ? (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {allCookingRecipes.meals.map((recipe, index) => (
                <motion.div key={index} variants={itemVariants}>
                  <SmallItem recipe={recipe} index={index} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              className="flex flex-col items-center justify-center min-h-[400px] text-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="bg-orange-100 p-4 rounded-full mb-4">
                <FaSearch className="text-primary text-3xl" />
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                لا توجد وصفات حالياً
              </h2>
              <p className="text-gray-600 max-w-md mb-4 text-sm md:text-base">
                لم نتمكن من العثور على أي وصفات. يمكنك إضافة وصفة جديدة أو
                المحاولة مرة أخرى لاحقاً.
              </p>
              {session?.status === 'authenticated' && (
                <Link
                  href="/newRecipe"
                  className="px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-full font-medium hover:shadow-lg transition-all text-sm md:text-base"
                >
                  إضافة وصفة جديدة
                </Link>
              )}
            </motion.div>
          )}
        </AnimatePresence> */}
        <AnimatePresence>
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {fakeData?.map((recipe, index) => (
              <motion.div key={index} variants={itemVariants}>
                <SmallItem recipe={recipe} index={index} />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {hasRecipes && (
        <div className="w-full border-t border-gray-100 p-4 flex flex-col sm:flex-row items-center justify-between">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleNextPage}
            disabled={allCookingRecipes?.meals?.length < 6}
            className="px-4 py-2 rounded-full bg-gradient-to-r from-primary to-secondary text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-md hover:shadow-lg transition-all duration-300 mb-2 sm:mb-0"
          >
            التالي
            <MdKeyboardArrowRight className="text-xl" />
          </motion.button>

          <div className="flex items-center">
            <span className="px-3 py-1 rounded-full bg-orange-50 text-primary font-medium text-sm">
              الصفحة {pageNumber}
            </span>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePreviousPage}
            disabled={pageNumber <= 1}
            className="px-4 py-2 rounded-full bg-gradient-to-r from-primary to-secondary text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-md hover:shadow-lg transition-all duration-300"
          >
            <MdKeyboardArrowLeft className="text-xl" />
            السابق
          </motion.button>
        </div>
      )}
    </div>
  );
}
