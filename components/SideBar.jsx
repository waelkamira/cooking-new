'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { signOut, useSession } from 'next-auth/react';
import Button from './Button';
import Image from 'next/image';
import CurrentUser from '../components/CurrentUser';
import TheGarden from './Garden';
import Categories from './Categories';
import NewRecipeButton from './NewRecipeButton';
import LoadingPhoto from './LoadingPhoto';
import { motion } from 'framer-motion';
import {
  FaUtensils,
  FaHeart,
  FaAward,
  FaUsers,
  FaSignOutAlt,
  FaQuestion,
  FaBookOpen,
} from 'react-icons/fa';
import { FaPlus } from 'react-icons/fa6';

export default function SideBar() {
  const router = useRouter();
  const session = useSession();
  const [newImage, setNewImage] = useState('');
  const user = CurrentUser();
  const [userRecipeCount, setUserRecipeCount] = useState();
  const [isHovered, setIsHovered] = useState(null);

  useEffect(() => {
    getTheUserRecipeCount();
    if (typeof window !== 'undefined') {
      const img = localStorage.getItem('image');
      setNewImage(img);
    }
  }, []);

  // Get user recipe count
  async function getTheUserRecipeCount() {
    try {
      const response = await fetch('/api/myRecipes');
      if (response.ok) {
        const json = await response?.json();
        setUserRecipeCount(json?.count);
      }
    } catch (error) {
      console.error('Error fetching recipe count:', error);
    }
  }

  // Navigation items
  const navItems = [
    {
      title: 'إنشاء وصفة',
      path: '/newRecipe',
      icon: <FaPlus className="ml-2" />,
    },
    {
      title: 'شو أطبخ اليوم؟',
      path: '/whatToCookToday',
      icon: <FaQuestion className="ml-2" />,
    },
    {
      title: 'وصفاتي',
      path: '/myRecipes',
      icon: <FaUtensils className="ml-2" />,
    },
    {
      title: 'وصفاتي المفضلة',
      path: '/favoritePosts',
      icon: <FaHeart className="ml-2" />,
    },
    // { title: 'الجوائز', path: '/myGarden', icon: <FaAward className="ml-2" /> },
  ];

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
    <div className="hidden xl:block w-80 h-full">
      <motion.div
        className="w-full h-full bg-gradient-to-b from-primary to-secondary  rounded-2xl rounded-tl-[0] shadow-xl overflow-hidden"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* User Profile Section */}
        {session?.status === 'authenticated' ? (
          <motion.div
            className="p-6 bg-gradient-to-b from-secondary to-primary"
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div
              className="flex items-center gap-4 cursor-pointer group"
              onClick={() => router.push('/profile?username')}
            >
              <div className="relative size-16 rounded-full overflow-hidden border-4 border-white/20 shadow-lg group-hover:border-white/40 transition-all duration-300">
                {!user?.image ? (
                  <LoadingPhoto />
                ) : (
                  <Image
                    priority
                    src={user?.image || '/placeholder.svg'}
                    fill
                    alt={user?.name}
                    className="object-cover"
                  />
                )}
              </div>
              <div>
                <h2 className="text-white font-bold text-lg group-hover:text-white/90 transition-colors">
                  {user?.name || 'مرحباً بك'}
                </h2>
                <p className="text-white/70 text-sm">عرض الملف الشخصي</p>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="p-6">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button
                title={'تسجيل دخول'}
                style={' border text-white shadow-lg w-full py-3'}
                path="/login"
                icon={<FaSignOutAlt className="ml-2 text-white rotate-180" />}
              />
            </motion.div>
          </div>
        )}
        {/* Main Navigation */}
        {/* session?.status === 'authenticated' && */}
        {
          <div className="px-4 py-6">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-4"
            >
              {/* Navigation Items */}
              {navItems.map((item, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onHoverStart={() => setIsHovered(index)}
                  onHoverEnd={() => setIsHovered(null)}
                >
                  <Button
                    title={item.title}
                    style={` flex items-center justify-center bg-primary/10 hover:bg-primary/20 shadow-lg text-white border border-white/10 hover:border-white/30 transition-all duration-300 ${
                      isHovered === index ? 'pr-6' : 'pr-4'
                    }`}
                    path={item.path}
                    icon={item.icon}
                  />
                </motion.div>
              ))}

              {/* Admin Section */}
              {session?.status === 'authenticated' && user?.isAdmin === 1 && (
                <motion.div
                  variants={itemVariants}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Button
                    title={'المستخدمين'}
                    style={
                      'flex items-center justify-start bg-white/10 hover:bg-white/20 text-white border border-white/10 hover:border-white/30 transition-all duration-300 hover:bg-white/20'
                    }
                    path="/users"
                    icon={<FaUsers className="ml-2" />}
                  />
                </motion.div>
              )}
            </motion.div>
          </div>
        }
        {/* Garden Section */}
        {session?.status === 'authenticated' && userRecipeCount > 0 && (
          <motion.div
            className="px-4 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <h3 className="text-white font-bold mb-3 flex items-center">
                <FaAward className="mr-2 text-yellow-300" /> حديقتك
              </h3>
              <TheGarden />
            </div>
          </motion.div>
        )}
        {/* Categories Section */}
        <motion.div
          className="px-4 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
            <h3 className="text-white font-bold mb-3 flex items-center">
              <FaBookOpen className="mr-2" /> التصنيفات
            </h3>
            <Categories />
          </div>
        </motion.div>
        {/* Promotional Image */}
        {/* {session?.status === 'authenticated' && (
          <motion.div
            className="px-4 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <div className="relative w-full h-36 rounded-xl overflow-hidden border border-white/20 shadow-lg">
              <Image
                priority
                src={
                  'https://res.cloudinary.com/dh2xlutfu/image/upload/v1718716955/cooking/nasoh_and_bahiga_cn3e7h.png'
                }
                layout="fill"
                objectFit="contain"
                alt="photo"
                className="hover:scale-105 transition-transform duration-500"
              />
            </div>
          </motion.div>
        )} */}
      </motion.div>
    </div>
  );
}
