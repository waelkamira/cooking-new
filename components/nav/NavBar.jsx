'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Image from 'next/image';
import {
  FaCanadianMapleLeaf,
  FaFileContract,
  FaHeart,
  FaHome,
  FaPlus,
  FaQuestion,
  FaUtensils,
} from 'react-icons/fa';
import { TbTargetArrow } from 'react-icons/tb';
import { MdOutlineMapsHomeWork } from 'react-icons/md';
import { IoIosContacts } from 'react-icons/io';
import { usePathname } from 'next/navigation';
import { RiProfileFill } from 'react-icons/ri';
const mainButtons = [
  {
    title: 'الرئيسية',
    path: '/home',
    icon: <FaHome />,
  },
  {
    title: 'بروفايل',
    path: '/profile',
    icon: <RiProfileFill />,
  },
  {
    title: 'إنشاء وصفة',
    path: '/newRecipe',
    icon: <FaPlus />,
  },
  {
    title: 'وصفاتي',
    path: '/myRecipes',
    icon: <FaUtensils />,
  },
  {
    title: 'المفضلة',
    path: '/favoritePosts',
    icon: <FaHeart />,
  },
  {
    title: 'شو أطبخ اليوم',
    path: '/whatToCookToday',
    icon: <FaQuestion />,
  },
  {
    title: 'اتصل بنا',
    path: '/contactUs',
    icon: <FaFileContract />,
  },
];
export default function FirstNavBar() {
  const path = usePathname();

  return (
    <>
      {path.includes('/home') && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
          className="fixed top-0 right-0 hidden bg-gradient-to-r from-secondary to-primary xl:flex xl:flex-col xl:justify-start w-full z-[1000] shadow-lg "
        >
          {/* شريط التنقل الرئيسي */}
          <div className="relative flex justify-center items-center w-full px-4 py-2">
            {/* الشعار الجانبي */}
            <div className="absolute top-0 right-0 flex items-center justify-center">
              <Link
                href={'/home'}
                className="relative flex justify-end cursor-pointer"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  className="hidden 2xl:block relative size-44 top-4 right-4 rounded-full border-4 bg-primary"
                >
                  <Image
                    src="/photo (28)4.png"
                    alt="luxury_logo"
                    fill
                    className="object-contain drop-shadow-xl"
                  />
                </motion.div>
              </Link>
            </div>
            {/* الأزرار الجانبية */}
            <ul className="flex justify-evenly gap-8 items-center h-20 w-full 2xl:w-[60%]">
              {mainButtons?.map((button) => (
                <li
                  key={button?.title}
                  className="relative flex justify-center w-full"
                >
                  <Link
                    href={button?.path}
                    className="relative flex items-center justify-center gap-1 w-full text-white text-lg transition-all duration-300 ease-in-out group hover:scale-105"
                  >
                    {/* أيقونة الزر */}
                    <span className="mb-2 text-white text-xl rounded-full p-1.5 bg-white/20">
                      {button?.icon}
                    </span>

                    {/* نص الزر */}
                    <span className="relative text-center text-white text-nowrap">
                      {button?.title}
                    </span>
                    {/* خط أسفل الزر - تصميم جديد */}
                    <span className="absolute inset-x-0 bottom-0 h-[2px] bg-transparent group-hover:bg-gradient-to-r group-hover:from-white group-hover:via-white group-hover:to-white transition-transform duration-500">
                      <motion.span
                        className="absolute inset-0 bg-primary"
                        initial={{ scaleX: 0, originX: 0.5 }}
                        whileHover={{
                          scaleX: 1,
                          opacity: [0, 1, 0],
                          originX: 0.5,
                          transition: {
                            duration: 0.6,
                            ease: [0.43, 0.13, 0.23, 0.96],
                          },
                        }}
                      />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      )}
    </>
  );
}
