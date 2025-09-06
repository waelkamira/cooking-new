'use client';
import { useSession } from 'next-auth/react';
import SmallItem from '../../components/SmallItem';
import Image from 'next/image';
import React, { useContext, useEffect, useState } from 'react';
import { IoMdAdd, IoMdClose } from 'react-icons/io';
import toast from 'react-hot-toast';
import CustomToast from '../../components/CustomToast';
import BackButton from '../../components/BackButton';
import {
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
  MdKeyboardDoubleArrowRight,
  MdOutlineRestaurantMenu,
} from 'react-icons/md';
import { MdKeyboardDoubleArrowLeft } from 'react-icons/md';
import Link from 'next/link';
import { inputsContext } from '../../components/Context';
import { TfiMenuAlt } from 'react-icons/tfi';
import SideBarMenu from '../../components/SideBarMenu';
import Button from '../../components/Button';
import Loading from '../../components/Loading';
import { useRouter } from 'next/navigation';
import { MdEdit } from 'react-icons/md';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowLeft, FaPlus, FaUtensils } from 'react-icons/fa';
import Login from '../login/page';
import Logo from '../../components/photos/logo';

export default function MyRecipes() {
  const [isOpen, setIsOpen] = useState(false);
  const [recipeId, setRecipeId] = useState('');
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [userRecipesCount, setUserRecipesCount] = useState(0);
  const [myRecipes, setMyRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const { dispatch } = useContext(inputsContext);
  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session?.status === 'authenticated') {
      fetchMyRecipes();
    }
  }, [pageNumber, session]);

  const fetchMyRecipes = async () => {
    setIsLoading(true);
    try {
      const email = session?.data?.user?.email;
      const response = await fetch(
        `/api/myRecipes?page=${pageNumber}&email=${email}&limit=6`
      );

      if (response.ok) {
        const data = await response.json();
        setMyRecipes(data?.recipes || []);
        setUserRecipesCount(data?.count || 0);
        dispatch({ type: 'MY_RECIPES', payload: data });
      }
    } catch (error) {
      console.error('Error fetching recipes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePost = async () => {
    try {
      const email = session?.data?.user?.email;
      const response = await fetch(
        `/api/allCookingRecipes?email=${email}&id=${recipeId}`,
        {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: recipeId, email: email }),
        }
      );

      if (response.ok) {
        toast.custom((t) => (
          <CustomToast
            t={t}
            message={'تم حذف هذه الوصفة بنجاح'}
            redEmoji={'✓'}
          />
        ));
        fetchMyRecipes();
      } else {
        toast.custom((t) => <CustomToast t={t} message={'حدث خطأ ما 😐'} />);
      }
    } catch (error) {
      console.error('Error deleting recipe:', error);
      toast.custom((t) => <CustomToast t={t} message={'حدث خطأ ما 😐'} />);
    } finally {
      setIsDeleteModalVisible(false);
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
    <div className="min-h-screen bg-gradient-to-b from-[#6D7B45] to-[#CBDB74] pb-12">
      {/* Header */}
      <div className="relative">
        {/* الشعار الجانبي */}
        <Logo />

        {/* Background image with overlay */}
        <div className="relative h-[250px] w-full overflow-hidden">
          {/* <div className="absolute inset-0 bg-black/40 z-10"></div> */}
          <Image
            priority
            src="/photo (18).png"
            layout="fill"
            objectFit="cover"
            alt="My Recipes"
            className="object-center"
          />

          {/* Back button */}
          <div className="absolute top-4 left-4 z-50">
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
              className="text-3xl md:text-5xl font-bold mb-2 text-center"
            >
              وصفاتي
            </motion.h1>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full"
            >
              <MdOutlineRestaurantMenu className="mr-2 text-[#CBDB74]" />
              <span className="text-white/90">{userRecipesCount} وصفة</span>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 -mt-16 relative z-30">
        {/* Add new recipe card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-xl overflow-hidden mb-12"
        >
          <div className="p-4 lg:p-6">
            <Link
              href={'/newRecipe'}
              className="text-xl lg:text-2xl font-bold text-gray-800"
            >
              <div className="flex items-center mb-6">
                <div className="size-12 bg-[#CBDB74] rounded-full flex items-center justify-center mx-2 hover:scale-105 ">
                  <IoMdAdd className="hover:rotate-180 h-6 w-6 text-white " />
                </div>
                <div>
                  إضافة وصفة جديدة
                  <p className="text-gray-400 text-sm lg:text-lg">
                    شارك وصفاتك المفضلة مع الآخرين
                  </p>
                </div>
              </div>
            </Link>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push('/newRecipe')}
              className="w-full bg-gradient-to-r from-[#6D7B45] to-[#CBDB74] text-white font-bold py-4 px-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center"
            >
              <FaPlus className="size-5 ml-2" />
              إنشاء وصفة جديدة
            </motion.button>
          </div>
        </motion.div>

        {/* Recipes list */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <FaUtensils className="ml-2" />
              وصفاتي
              <span className="mr-2 bg-white/20 text-white text-sm px-3 py-1 rounded-full">
                {userRecipesCount}
              </span>
            </h2>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center min-h-[300px] bg-white/10 backdrop-blur-sm rounded-xl">
              <Loading />
            </div>
          ) : (
            <AnimatePresence mode="wait">
              {myRecipes?.length > 0 ? (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {myRecipes.map((recipe, index) => (
                    <motion.div
                      key={recipe?.id || index}
                      variants={itemVariants}
                      transition={{ duration: 0.3 }}
                      className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300"
                    >
                      {/* Recipe actions */}
                      <div className="flex justify-between items-center bg-gray-50 px-4 py-3 border-b">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() =>
                            router.push(`/editRecipe/${recipe?.id}`)
                          }
                          className="flex items-center text-gray-700 hover:text-primary transition-colors"
                        >
                          <MdEdit className="h-5 w-5 ml-1" />
                          <span className="text-sm font-medium">تعديل</span>
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => {
                            setRecipeId(recipe?.id);
                            setSelectedRecipe(recipe);
                            setIsDeleteModalVisible(true);
                          }}
                          className="flex items-center text-gray-700 hover:text-primary transition-colors"
                        >
                          <IoMdClose className="h-5 w-5 ml-1" />
                          <span className="text-sm font-medium">حذف</span>
                        </motion.button>
                      </div>

                      {/* Recipe card */}
                      {/* <SmallItem recipe={recipe} index={index} show={false} /> */}
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-8 text-center"
                >
                  <div className="h-20 w-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaUtensils className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    لا توجد وصفات بعد
                  </h3>
                  <p className="text-white/80 mb-6">
                    لم تقم بإنشاء أي وصفة بعد. ابدأ بإضافة وصفتك الأولى!
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => router.push('/newRecipe')}
                    className="bg-white text-primary font-bold py-3 px-6 rounded-full shadow-md hover:shadow-lg"
                  >
                    <FaPlus className="inline-block ml-2" />
                    إنشاء وصفة جديدة
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          )}

          {/* Pagination */}
          {myRecipes?.length > 0 && (
            <div className="flex justify-center items-center mt-8">
              <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full p-1">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    if (pageNumber > 1) {
                      setPageNumber(pageNumber - 1);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  }}
                  disabled={pageNumber <= 1}
                  className="h-10 w-10 rounded-full flex items-center justify-center text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <MdKeyboardArrowRight className="h-6 w-6" />
                </motion.button>

                <div className="px-4 font-medium text-white">
                  الصفحة {pageNumber}
                </div>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    if (myRecipes?.length >= 6) {
                      setPageNumber(pageNumber + 1);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  }}
                  disabled={myRecipes?.length < 6}
                  className="h-10 w-10 rounded-full flex items-center justify-center text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <MdKeyboardArrowLeft className="h-6 w-6" />
                </motion.button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete confirmation modal */}
      <AnimatePresence>
        {isDeleteModalVisible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setIsDeleteModalVisible(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-6">
                <div className="h-16 w-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <IoMdClose className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  تأكيد الحذف
                </h3>
                <p className="text-gray-600">
                  هل أنت متأكد من رغبتك في حذف هذه الوصفة؟ لا يمكن التراجع عن
                  هذا الإجراء.
                </p>
              </div>

              <div className="flex gap-4">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleDeletePost}
                  className="flex-1 bg-primary hover:bg-secondary text-white font-bold py-3 px-4 rounded-lg transition-colors"
                >
                  نعم، حذف الوصفة
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setIsDeleteModalVisible(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-4 rounded-lg transition-colors"
                >
                  إلغاء
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
