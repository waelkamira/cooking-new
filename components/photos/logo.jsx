'use client';
import Link from 'next/link';
import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function Logo() {
  return (
    <div className="absolute top-0 right-0 z-50 flex items-center justify-center">
      <Link href={'/home'} className="relative flex justify-end cursor-pointer">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          className={` hidden 2xl:block relative size-44 -bottom-40 border border-white/40 right-4 rounded-full bg-white/20`}
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
  );
}
