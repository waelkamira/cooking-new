'use client';
import Image from 'next/image';
import React from 'react';
import { motion } from 'framer-motion';

export default function CustomToast({
  t,
  message,
  emoji,
  orangeEmoji,
  redEmoji,
}) {
  const toastVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.9 },
    visible: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -20, scale: 0.9 },
  };

  return (
    <motion.div
      variants={toastVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="max-w-md w-full bg-white text-four shadow-xl rounded-xl pointer-events-auto flex-2 items-center justify-center p-4 mx-2 border-one"
    >
      <div className="flex justify-between items-center my-2">
        <div className="flex-1 w-full">
          <div className="flex justify-start items-center gap-3">
            <div className="relative w-12 h-12 sm:w-14 sm:h-14 flex-shrink-0 rounded-full overflow-hidden">
              <Image
                priority
                className="object-cover"
                src="/bahiga.png"
                alt="photo"
                fill
              />
            </div>
            <div className="ml-1">
              <h1 className="text-sm sm:text-base font-semibold">
                بهيجة اشرق لبن
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-2">
        <h1 className="text-center text-xs sm:text-sm font-medium leading-relaxed">
          <span className="text-secondary text-lg sm:text-xl font-bold">
            {orangeEmoji}
          </span>
          <span className="text-one text-lg sm:text-xl mx-1 font-bold">
            {redEmoji}
          </span>
          {message}
          <span className="text-secondary text-lg sm:text-xl mx-1 font-bold">
            {emoji}
          </span>
        </h1>
      </div>
    </motion.div>
  );
}
