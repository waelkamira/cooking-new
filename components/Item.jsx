'use client';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns/formatDistanceToNow';
import {
  FaArrowLeft,
  FaListUl,
  FaClipboardList,
  FaLightbulb,
  FaVideo,
  FaHeart,
  FaBookmark,
  FaPrint,
  FaShare,
} from 'react-icons/fa';
import { TfiMenuAlt } from 'react-icons/tfi';
import SideBarMenu from './SideBarMenu';
import LoadingPhoto from './LoadingPhoto';
import LogInPage from '../app/login/page';
export default function Item({
  image,
  mealName,
  ingredients,
  theWay,
  advise,
  link,
  createdAt,
  userImage,
  userName,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('ingredients');
  const [isSaved, setIsSaved] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const session = useSession();

  // دالة للتحقق من صحة رابط الفيديو (يوتيوب أو تيك توك)
  const isValidVideoLink = (url) => {
    if (!url) return false;

    // تحقق من رابط يوتيوب
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
    if (youtubeRegex.test(url)) return true;

    // تحقق من رابط تيك توك
    const tiktokRegex = /^(https?:\/\/)?(www\.)?tiktok\.com\/.+/;
    if (tiktokRegex.test(url)) return true;

    return false;
  };

  // دالة لاستخراج رابط iframe من النص HTML
  const extractIframeSrc = (html) => {
    if (typeof document !== 'undefined') {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = html;
      const iframeElement = tempDiv.querySelector('iframe');
      return iframeElement ? iframeElement.getAttribute('src') : null;
    }
    return null;
  };

  // دالة لتنسيق التاريخ
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return isNaN(date)
      ? 'Invalid date'
      : formatDistanceToNow(date, { addSuffix: true });
  };

  // استخراج رابط الفيديو
  const iframeSrc = extractIframeSrc(link);
  const isValidLink = isValidVideoLink(iframeSrc || link);

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

  // Not authenticated view
  // if (session?.status === 'unauthenticated') {
  //   return <LogInPage />;
  // }

  // Authenticated view
  return (
    <div className="bg-gray-50 min-h-screen xl:w-3/4">
      {/* Header with background image */}
      <div className="relative h-64 md:h-80 w-full overflow-hidden">
        <div className="absolute inset-0 z-10"></div>
        <Image
          priority
          // src={image || '/photo (20).png'}
          src={'/photo (15).png'}
          layout="fill"
          objectFit="cover"
          alt={mealName || 'Recipe header'}
        />

        {/* Back button and menu */}
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

        {/* Recipe title and author info */}
        <div className="absolute bottom-0 left-0 right-0 z-40 p-6 bg-gradient-to-br from-black/80 to-transparent">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">
            {mealName}
          </h1>
          <div className="flex items-center">
            <div className="relative size-10 overflow-hidden rounded-full border-2 border-white/30">
              {!userImage ? (
                <LoadingPhoto />
              ) : (
                <Image
                  priority
                  src={userImage || '/placeholder.svg'}
                  fill
                  alt={userName || 'User'}
                />
              )}
            </div>
            <div className="ml-3">
              <h6 className="text-white font-medium">{userName}</h6>
              <p className="text-white/70 text-sm">{formatDate(createdAt)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 -mt-10 relative z-30">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Action buttons */}
          <div className="flex justify-between items-center p-4 border-b">
            <div className="flex space-x-4 space-x-reverse">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsLiked(!isLiked)}
                className={`flex items-center space-x-1 space-x-reverse px-3 py-2 rounded-full ${
                  isLiked
                    ? 'bg-orange-50 text-primary'
                    : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                }`}
              >
                <FaHeart className={`${isLiked ? 'fill-primary' : ''}`} />
                <span className="mr-1">{isLiked ? 'أعجبني' : 'إعجاب'}</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsSaved(!isSaved)}
                className={`flex items-center space-x-1 space-x-reverse px-3 py-2 rounded-full ${
                  isSaved
                    ? 'bg-blue-50 text-blue-500'
                    : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                }`}
              >
                <FaBookmark className={`${isSaved ? 'fill-blue-500' : ''}`} />
                <span className="mr-1">{isSaved ? 'تم الحفظ' : 'حفظ'}</span>
              </motion.button>
            </div>

            <div className="flex space-x-2 space-x-reverse">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 bg-gray-50 rounded-full text-gray-500 hover:bg-gray-100"
              >
                <FaPrint />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 bg-gray-50 rounded-full text-gray-500 hover:bg-gray-100"
              >
                <FaShare />
              </motion.button>
            </div>
          </div>

          {/* Recipe navigation */}
          <div className="flex overflow-x-auto border-b scrollbar-hide">
            <button
              onClick={() => setActiveSection('ingredients')}
              className={`px-6 py-4 font-medium flex items-center whitespace-nowrap ${
                activeSection === 'ingredients'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              <FaListUl className="ml-2" />
              المقادير
            </button>
            <button
              onClick={() => setActiveSection('method')}
              className={`px-6 py-4 font-medium flex items-center whitespace-nowrap ${
                activeSection === 'method'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              <FaClipboardList className="ml-2" />
              الطريقة
            </button>
            {advise && (
              <button
                onClick={() => setActiveSection('tips')}
                className={`px-6 py-4 font-medium flex items-center whitespace-nowrap ${
                  activeSection === 'tips'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                <FaLightbulb className="ml-2" />
                نصائح
              </button>
            )}
            {isValidLink && (
              <button
                onClick={() => setActiveSection('video')}
                className={`px-6 py-4 font-medium flex items-center whitespace-nowrap ${
                  activeSection === 'video'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                <FaVideo className="ml-2" />
                فيديو
              </button>
            )}
          </div>

          {/* Recipe content */}
          <div className="p-6">
            <AnimatePresence mode="wait">
              {activeSection === 'ingredients' && (
                <motion.div
                  key="ingredients"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <div className="flex items-center mb-4">
                    <div className="h-10 w-10 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                      <FaListUl className="text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      المقادير
                    </h2>
                  </div>

                  <div className="bg-orange-50 p-6 rounded-lg">
                    <pre className="text-lg whitespace-pre-wrap font-sans">
                      {ingredients}
                    </pre>
                  </div>

                  <div className="flex justify-end">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setActiveSection('method')}
                      className="flex items-center text-primary font-medium"
                    >
                      الطريقة
                      <FaClipboardList className="mr-2" />
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {activeSection === 'method' && (
                <motion.div
                  key="method"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <div className="flex items-center mb-4">
                    <div className="h-10 w-10 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                      <FaClipboardList className="text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      الطريقة
                    </h2>
                  </div>

                  <div className="bg-orange-50 p-6 rounded-lg">
                    <pre className="text-lg whitespace-pre-wrap font-sans">
                      {theWay}
                    </pre>
                  </div>

                  <div className="flex justify-between">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setActiveSection('ingredients')}
                      className="flex items-center text-primary font-medium"
                    >
                      <FaListUl className="ml-2" />
                      المقادير
                    </motion.button>

                    {advise && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setActiveSection('tips')}
                        className="flex items-center text-primary font-medium"
                      >
                        نصائح
                        <FaLightbulb className="mr-2" />
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              )}

              {activeSection === 'tips' && advise && (
                <motion.div
                  key="tips"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <div className="flex items-center mb-4">
                    <div className="h-10 w-10 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
                      <FaLightbulb className="text-yellow-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">نصائح</h2>
                  </div>

                  <div className="bg-yellow-50 p-6 rounded-lg">
                    <pre className="text-lg whitespace-pre-wrap font-sans">
                      {advise}
                    </pre>
                  </div>

                  <div className="flex justify-between">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setActiveSection('method')}
                      className="flex items-center text-primary font-medium"
                    >
                      <FaClipboardList className="ml-2" />
                      الطريقة
                    </motion.button>

                    {isValidLink && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setActiveSection('video')}
                        className="flex items-center text-primary font-medium"
                      >
                        فيديو
                        <FaVideo className="mr-2" />
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              )}

              {activeSection === 'video' && isValidLink && (
                <motion.div
                  key="video"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <div className="flex items-center mb-4">
                    <div className="h-10 w-10 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                      <FaVideo className="text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">فيديو</h2>
                  </div>

                  <div className="aspect-video w-full rounded-lg overflow-hidden shadow-lg">
                    <iframe
                      src={iframeSrc || link}
                      title="Video player"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                      allowFullScreen
                      referrerPolicy="strict-origin-when-cross-origin"
                      className="w-full h-full"
                    />
                  </div>

                  <div className="flex justify-start">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() =>
                        setActiveSection(advise ? 'tips' : 'method')
                      }
                      className="flex items-center text-primary font-medium"
                    >
                      {advise ? (
                        <>
                          <FaLightbulb className="ml-2" />
                          نصائح
                        </>
                      ) : (
                        <>
                          <FaClipboardList className="ml-2" />
                          الطريقة
                        </>
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Recipe footer */}
          <div className="bg-gray-50 p-3 md:p-6 border-t">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              {/* معلومات المستخدم والصورة */}
              <div className="flex items-center">
                <div className="relative size-10 md:size-12 overflow-hidden rounded-full border-2 border-white">
                  {!userImage ? (
                    <div>جاري التحميل</div> // Placeholder or loading component
                  ) : (
                    <Image
                      priority
                      src={userImage || '/placeholder.svg'}
                      fill
                      alt={userName || 'User'}
                      style={{ objectFit: 'cover' }} // Ensure image covers the area
                    />
                  )}
                </div>
                <div className="ml-3">
                  <h6 className="font-medium text-sm md:text-base">
                    {userName}
                  </h6>
                  <p className="text-gray-500 text-xs md:text-sm">
                    {formatDate(createdAt)}
                  </p>
                </div>
              </div>

              {/* زر عرض المزيد */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-primary hover:bg-secondary text-white px-3 py-1.5 md:px-4 md:py-2 rounded-full font-medium text-xs md:text-sm whitespace-nowrap"
              >
                عرض المزيد من وصفات {userName?.split(' ')[0]}
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
