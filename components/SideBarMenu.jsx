'use client';
import { signOut, useSession } from 'next-auth/react';
import { useState } from 'react';
import CurrentUser from '../components/CurrentUser';
import Image from 'next/image';
import Link from 'next/link';
import Button from './Button';
import LoadingPhoto from './LoadingPhoto';
import { motion } from 'framer-motion';
import {
  FaUtensils,
  FaHeart,
  FaAward,
  FaUsers,
  FaSignOutAlt,
  FaQuestion,
  FaPlus,
  FaTimes,
  FaHome,
  FaDoorClosed,
  FaClosedCaptioning,
} from 'react-icons/fa';
import { usePathname } from 'next/navigation';
import { HomeIcon } from 'lucide-react';
import { RiProfileFill } from 'react-icons/ri';
import { IoIosContacts } from 'react-icons/io';

export default function SideBarMenu({ setIsOpen }) {
  const session = useSession();
  const user = CurrentUser();
  const [isHovered, setIsHovered] = useState(null);
  const pathName = usePathname();
  // Navigation items
  const navItems = [
    {
      title: 'الرئيسية',
      path: '/home',
      icon: <FaHome className="ml-2" />,
    },
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
    {
      title: 'بروفايل',
      path: '/profile',
      icon: <RiProfileFill className="ml-2" />,
    },
    {
      title: 'اتصل بنا',
      path: '/contactUs',
      icon: <IoIosContacts className="ml-2" />,
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
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <motion.div
      className={
        (pathName.includes('favoritePosts')
          ? 'bg-gradient-to-b from-[#b653f8] to-[#54326B] '
          : pathName.includes('myRecipes')
          ? 'bg-gradient-to-b from-[#CBDB74] to-[#6D7B45]'
          : pathName.includes('whatToCookToday')
          ? 'bg-gradient-to-b from-[#ff6e30] to-[#121A2F]'
          : pathName.includes('profile')
          ? 'bg-gradient-to-b from-[#fa6159] to-[#643077]'
          : // ? 'bg-gradient-to-b from-[#ff0000] to-[#aa1d1d]'
            'bg-gradient-to-b from-[#FAA662] to-[#FF5733]') +
        ` p-5 w-full max-w-xs h-full rounded-lg shadow-xl overflow-auto`
      }
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header with close button */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-white font-bold text-xl">القائمة</h2>
        <motion.button
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(false)}
          className="p-2 bg-white/20 rounded-full text-white hover:bg-white/30 transition-colors"
        >
          <FaTimes className="h-5 w-5" />
        </motion.button>
      </div>
      {/* User Profile Section */}

      <Link href={'/profile?username'}>
        <motion.div
          className="flex items-center gap-3 p-3 mb-6 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="relative size-12 overflow-hidden rounded-full border-2 border-white/20">
            {!user?.image ? (
              <LoadingPhoto />
            ) : (
              <Image
                priority
                src={user?.image || '/placeholder.svg'}
                fill
                alt={session?.data?.user?.name}
                className="object-cover"
              />
            )}
          </div>
          <div>
            <h3 className="text-white font-medium text-sm line-clamp-1">
              {session?.data?.user?.name}
            </h3>
            <p className="text-white/70 text-xs">الملف الشخصي</p>
          </div>
        </motion.div>
      </Link>

      {/* Login Button for Unauthenticated Users */}
      <motion.div
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="mb-4"
      >
        <Button
          title={'تسجيل الدخول'}
          path={'/login'}
          style={' border border-white'}
          icon={<FaSignOutAlt className="ml-2 text-white rotate-180" />}
        />
      </motion.div>
      {/* Admin Section */}
      {user?.isAdmin === 0 && (
        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="mb-4"
        >
          <Button
            title={'المستخدمين'}
            path={'/users'}
            style={' border border-white '}
            icon={<FaUsers className="ml-2" />}
          />
        </motion.div>
      )}
      {/* Navigation Items */}
      {/* session?.status === 'authenticated' && */}
      {
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-2 mb-6"
        >
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
                title={item?.title}
                path={item?.path}
                style={` border border-white/30  ${
                  isHovered === index ? 'pr-5' : 'pr-3'
                }`}
                icon={item?.icon}
              />
            </motion.div>
          ))}

          {/* Sign Out Button */}
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="mt-4"
          >
            <Button
              title={'تسجيل الخروج'}
              path={'/'}
              onClick={() => signOut()}
              style={' border border-white'}
              icon={<FaSignOutAlt className="ml-2 text-white" />}
            />
          </motion.div>
        </motion.div>
      }
      {/* Close Button (Bottom) */}
      <motion.div
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="mt-4"
      >
        <Button
          title={'إغلاق'}
          onClick={() => setIsOpen(false)}
          style={' border border-white'}
          icon={<FaDoorClosed className="ml-2 text-white" />}
        />
      </motion.div>
    </motion.div>
  );
}
