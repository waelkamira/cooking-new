'use client';
import Image from 'next/image';
import React, { useState } from 'react';
import CookingForm from '../../components/CookingForm';
import { useSession } from 'next-auth/react';
import Button from '../../components/Button';
import Link from 'next/link';
import SideBarMenu from '../../components/SideBarMenu';
import { TfiMenuAlt } from 'react-icons/tfi';
import UploadingAndDisplayingImage from '../../components/UploadingAndDisplayingImage';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaArrowLeft,
  FaClipboardList,
  FaImage,
  FaUtensils,
} from 'react-icons/fa';
import LogInPage from '../login/page';
import Logo from '../../components/photos/logo';

export default function NewRecipe() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const session = useSession();

  // Steps for the recipe creation process
  const steps = [
    { id: 1, title: 'تحميل الصورة', icon: <FaImage /> },
    { id: 2, title: 'إضافة التفاصيل', icon: <FaClipboardList /> },
  ];

  if (session?.status === 'unauthenticated') {
    // return <LogInPage />;
  }
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary to-secondary pb-12 text-white">
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
                className="bg-white/20 backdrop-blur-sm p-3 rounded-full  hover:bg-white/30 transition-colors"
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
              className="bg-white/20 backdrop-blur-sm p-3 rounded-full  hover:bg-white/30 transition-colors"
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
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center ">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl md:text-5xl font-bold mb-2 text-center"
            >
              <Link
                href="/newRecipe"
                className="block p-3 rounded-lg text-white"
              >
                إنشاء وصفة جديدة
              </Link>
            </motion.h1>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full"
            >
              <FaUtensils className="mr-2 text-orange-300" />
              <span className="/90">شارك وصفتك المفضلة مع الآخرين</span>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 -mt-16 relative z-30">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white text-black rounded-xl shadow-xl overflow-hidden"
        >
          {/* Steps indicator */}
          <div className="border-b">
            <div className="container mx-auto px-6 py-4">
              <div className="flex justify-between items-center">
                {steps.map((step, index) => (
                  <div
                    key={step.id}
                    className={`flex flex-col gap-2 sm:flex-1 items-center ${
                      index !== steps.length - 1 ? 'relative' : ''
                    }`}
                  >
                    <button
                      onClick={() => setActiveStep(step.id)}
                      className={`flex items-center justify-between w-full${
                        activeStep === step.id
                          ? 'text-primary'
                          : 'text-gray-400'
                      }`}
                    >
                      <div
                        className={`h-10 w-10 rounded-full flex items-center justify-center sm:mr-3 ${
                          activeStep === step.id
                            ? 'bg-orange-100 text-primary'
                            : activeStep === step.id
                            ? 'bg-orange-100 text-primary'
                            : 'bg-gray-100 text-gray-400'
                        }`}
                      >
                        {step.icon}
                      </div>
                      <span
                        className={`font-bold mx-2 text-[10px] lg:text-[14px] ${
                          activeStep === step.id
                            ? 'text-gray-800'
                            : 'text-gray-500'
                        }`}
                      >
                        {step.title}
                      </span>
                    </button>

                    <div className="flex-1 mx-1 sm:mx-4 w-full h-1">
                      <div
                        className={`h-1 ${
                          activeStep === step.id ? 'bg-primary' : 'bg-gray-200'
                        }`}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Content based on active step */}
          <div className="p-6">
            {activeStep === 1 ? (
              <div className="max-w-2xl mx-auto">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    تحميل صورة الوصفة
                  </h2>
                  <p className="text-gray-600">
                    قم بتحميل صورة جذابة لوصفتك لجذب المزيد من المشاهدات
                  </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-2 lg:p-8 mb-6">
                  <UploadingAndDisplayingImage />
                </div>

                <div className="flex justify-end">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveStep(2)}
                    className="bg-gradient-to-r from-primary to-secondary border text-white shadow-lg w-full py-3 my-2 sm:text-lg sm:p-2 text-sm p-1 px-2 text-nowrap bg-five select-none rounded-full max-h-12 hover:text-white hover:bg-white/20"
                  >
                    التالي: إضافة التفاصيل
                  </motion.button>
                </div>
              </div>
            ) : (
              <div>
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    تفاصيل الوصفة
                  </h2>
                  <p className="text-gray-600">
                    أضف جميع المعلومات المطلوبة لوصفتك
                  </p>
                </div>

                <CookingForm
                  setIsVisible={setIsVisible}
                  isVisible={isVisible}
                  cancel={false}
                />

                <div className="flex justify-between mt-6">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveStep(1)}
                    className="bg-gradient-to-r from-primary to-secondary border text-white shadow-lg w-full py-3 my-2 sm:text-lg sm:p-2 text-sm p-1 px-2 text-nowrap bg-five select-none rounded-full max-h-12 hover:text-white hover:bg-white/20"
                  >
                    العودة إلى تحميل الصورة{' '}
                  </motion.button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
