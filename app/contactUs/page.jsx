'use client';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import React, { useContext, useEffect, useState } from 'react';
import { inputsContext } from '../../components/Context';
import toast from 'react-hot-toast';
import Link from 'next/link';
import CustomToast from '../../components/CustomToast';
import SideBarMenu from '../../components/SideBarMenu';
import { TfiMenuAlt } from 'react-icons/tfi';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowLeft, FaUtensils } from 'react-icons/fa6';
import { FaCalendarDays, FaFacebookF } from 'react-icons/fa6';
import { FiLinkedin } from 'react-icons/fi';
import { TbBrandGmail } from 'react-icons/tb';
import {
  MdOutlineAddLocationAlt,
  MdOutlineAlternateEmail,
} from 'react-icons/md';
import { useRouter } from 'next/navigation';
import LoadingPhoto from '../../components/LoadingPhoto';
import Logo from '../../components/photos/logo';
export default function Profile() {
  const session = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const { profile_image, dispatch } = useContext(inputsContext);
  const [newUserName, setNewUserName] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const newName = JSON.parse(localStorage.getItem('CurrentUser'));
      setNewUserName(newName?.name);
    }
    editProfileImageAndUserName();
  }, [profile_image?.image]);

  async function editProfileImageAndUserName() {
    if (profile_image?.image || newUserName) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('image', JSON.stringify(profile_image?.image));
      }
      const response = await fetch('/api/user', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: session?.data?.user?.email,
          image: profile_image?.image,
          name: newUserName,
        }),
      });
      if (response.ok) {
        toast.custom((t) => (
          <CustomToast t={t} message={'تم التعديل بنجاح '} orangeEmoji={'✔'} />
        ));
        dispatch({ type: 'PROFILE_IMAGE', payload: profile_image?.image });
        if (typeof window !== 'undefined') {
          const newName = JSON.parse(localStorage.getItem('CurrentUser'));
          setNewUserName(newName?.name);
        }
      } else {
        toast.custom((t) => (
          <CustomToast t={t} message={'حدث حطأ ما حاول مرة أخرى 😐'} />
        ));
      }
    }
  }
  const router = useRouter();

  //   مصفوفة معلومات الاتصال
  const contactInfo = [
    {
      icon: <MdOutlineAddLocationAlt className="text-lg select-none" />,
      text: 'سوريا - دمشق',
      link: null,
    },
    {
      icon: <FaFacebookF className="text-lg select-none " />,
      text: 'facebook',
      link: 'https:www.facebook.com/WaelKhamira/',
    },
    {
      icon: <FiLinkedin className="text-lg select-none " />,
      text: 'linkedin',
      link: 'https:www.linkedin.com/in/wael-kamira-476200130/',
    },
    {
      icon: <TbBrandGmail className="text-lg select-none " />,
      text: 'gmail',
      link: '/contactUs/byEmail',
    },
    {
      icon: <MdOutlineAlternateEmail className="text-lg select-none " />,
      text: 'hotmail',
      link: '/contactUs/byEmail',
    },
  ];

  //   مصفوفة ساعات العمل
  const workingHours = [
    { day: 'الجمعة', hours: '09:00 - 18:00' },
    { day: 'السبت', hours: '09:00 - 18:00' },
    { day: 'الأحد', hours: '09:00 - 18:00' },
    { day: 'الإثنين', hours: '09:00 - 18:00' },
    { day: 'الثلاثاء', hours: '09:00 - 18:00' },
    { day: 'الأربعاء', hours: '09:00 - 18:00' },
    { day: 'الخميس', hours: '09:00 - 18:00' },
  ];

  const image = '/photo (28)1.png';
  if (session?.status === 'unauthenticated') {
    // return <LogInPage />;
  }
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary to-secondary pb-12">
      {/* Header */}
      <div className="relative">
        {/* الشعار الجانبي */}
        <Logo />

        {/* Background image with overlay */}
        <div className="relative h-[250px] w-full overflow-hidden">
          <div className="absolute inset-0 bg-black/40 z-10"></div>
          <Image
            priority
            src="/Pizza_Menu1.png"
            layout="fill"
            objectFit="cover"
            alt="New Recipe"
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
              <Link
                href="/newRecipe"
                className="block p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 font-mono"
              >
                موقع طبخات بهيجة{' '}
              </Link>
            </motion.h1>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full"
            >
              <FaUtensils className="mr-2 text-primary" />
              <span className="text-white/90">
                شارك وصفتك المفضلة مع الآخرين
              </span>
            </motion.div>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto py-8 px-4 md:px-6 lg:px-8"
        هوامش
        محسنة
      >
        <div className="bg-white dark:bg-gray-800 shadow-lg overflow-hidden rounded-xl">
          <main className="flex flex-col justify-center items-center sm:pb-16 w-full rounded-b">
            <div className="flex flex-col justify-center items-center w-full xl:w-[90%] 2xl:w-[70%] h-full sm:px-16 pt-2 overflow-y-auto z-10 px-2">
              <div className="flex flex-col justify-between items-center w-full h-full mt-2 cursor-pointer">
                {/* قسم البطاقات */}
                <div className="flex flex-col md:flex-row justify-center items-center w-full p-4 gap-6">
                  <div className="flex flex-col justify-center items-center w-full p-4 gap-6">
                    <h1 className="text-center text-2xl w-full select-none my-4 font-bold">
                      <div
                        onClick={() => router.push('/home')}
                        className={`relative w-full h-[200px] overflow-visible`}
                      >
                        {!image && <LoadingPhoto />}
                        {Image && (
                          <Image
                            src={image}
                            layout="fill"
                            objectFit="contain"
                            alt={'image'}
                            priority={false}
                            className="p-4"
                          />
                        )}
                      </div>
                    </h1>
                  </div>
                </div>
                {/* قسم وصف الموقع */}
                <div className="p-2 h-full rounded text-gray-600  xl:border  border-gray-300/50 shadow-md">
                  <h1 className="text-center text-2xl w-full select-none my-4 font-bold font-mono">
                    موقع طبخات بهيجة
                  </h1>
                  <div className="text-start w-full select-none my-2 text-sm xl:text-lg leading-loose p-4 ">
                    موقع طبخات بهيجة هو منصة شاملة للبيع والتأجير لكل من
                    العقارات والسيارات وجميع أشكال السلع بمختلف أنواعها يوفر
                    الموقع تجربة مستخدم سلسة وممتعة مع تصميم جذاب وسهل
                    الاستخدام. سواء كنت تبحث عن منزل جديد، شقة للإيجار، أو سيارة
                    حديثة، فإن موقع طبخات بهيجة يقدم لك كل ما تحتاجه في مكان
                    واحد.
                    <h1 className=" w-full text-center my-4">- - - -</h1>
                    يوفر موقع طبخات بهيجة إمكانية التواصل المباشر بين البائعين
                    والمشترين أو المستأجرين والملاك. يمكن للمستخدمين الاتصال
                    بالبائعين مباشرة عبر الهاتف لطرح أي أسئلة أو استفسارات.
                    <h1 className=" w-full text-center my-4">- - - -</h1>
                    يحتوي موقع طبخات بهيجة على قسم خاص للمساعدة والدعم الفني
                    لضمان حل أي استفسارات أو مشاكل قد تواجهها أثناء استخدام
                    الموقع.
                    <h1 className=" w-full text-center my-4">- - - -</h1>
                    تصميم موقع طبخات بهيجة يركز على توفير تجربة تصفح سلسة
                    وسريعة. يتم تحميل صفحات الموقع بسرعة عالية، مما يقلل من وقت
                    الانتظار ويحسن رضا المستخدمين.
                    <h1 className=" w-full text-center my-4">- - - -</h1>
                    في النهاية، موقع طبخات بهيجة هو وجهة مثالية لكل من يبحث عن
                    خدمات البيع .والتأجير للعقارات والسيارات ,و بيع المنتجات
                    بمختلف أنواعها
                  </div>
                </div>
                {/* قسم معلومات الاتصال */}
                <div className="w-full h-full text-gray-600">
                  {/* قسم معلومات الاتصال */}
                  <div className="p-2 h-full rounded my-2 xl:border border-gray-300/50 shadow-md">
                    <h1 className="text-center text-2xl w-full select-none my-4 font-bold">
                      معلومات الإتصال
                    </h1>
                    <ul className="flex flex-col justify-start gap-4 items-start h-full w-full p-4">
                      {contactInfo.map((info, index) =>
                        info.link ? (
                          <a
                            key={index}
                            href={info.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between gap-2 w-full hover:bg-white border border-white rounded-[5px] hover:border-secondary hover:bg-opacity-20 hover:scale-[101%] hover:cursor-pointer px-4 py-2 transition-all duration-300"
                          >
                            <div className="flex gap-2 items-center ">
                              <span className="text-secondary">
                                {info.icon}
                              </span>
                              <span className="text-md sm:text-lg select-none text-nowrap">
                                {info.text}
                              </span>
                            </div>
                          </a>
                        ) : (
                          <div
                            key={index}
                            onClick={() => router.push(info.internalLink)}
                            className="flex items-center justify-between gap-2 w-full hover:bg-white hover:bg-opacity-20 rounded-lg hover:scale-[101%] hover:cursor-pointer px-4 py-2 transition-all duration-300"
                          >
                            <div className="flex gap-2 items-center ">
                              <span className="text-secondary">
                                {info.icon}
                              </span>
                              <span className="text-md sm:text-lg select-none text-nowrap">
                                {info.text}
                              </span>
                            </div>
                          </div>
                        )
                      )}
                    </ul>
                  </div>

                  {/* قسم ساعات العمل */}
                  <div className="p-2 h-full rounded my-2 xl:border border-gray-300/50 shadow-md">
                    <h1 className="text-center text-2xl w-full select-none my-4 font-bold">
                      ساعات العمل
                    </h1>
                    <ul className="flex flex-col justify-start gap-4 items-start h-full w-full p-4">
                      {workingHours.map((work, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between gap-2 w-full border border-white rounded-[5px] hover:border-secondary hover:bg-white hover:bg-opacity-20 hover:scale-[101%] hover:cursor-pointer px-4 py-2 transition-all duration-300"
                        >
                          <div className="flex gap-2 items-center ">
                            <FaCalendarDays className="text-lg select-none  text-secondary" />
                            <span className="text-md sm:text-lg select-none text-nowrap">
                              {work.day}
                            </span>
                          </div>
                          <span className="text-nowrap">{work.hours}</span>
                        </div>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </motion.div>
    </div>
  );
}
