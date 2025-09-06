'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {} from './lib/utils';

interface MagicButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function MagicButton({
  children,
  className,
  onClick,
}: MagicButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.button
      className={
        ('relative overflow-hidden rounded-full px-6 py-2.5 text-white font-medium',
        className)
      }
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-500 transition-all duration-300"></div>

      <AnimatedBorder isHovered={isHovered} />
      <AnimatedGlow isHovered={isHovered} />

      <span className="relative ">{children}</span>
    </motion.button>
  );
}

function AnimatedBorder({ isHovered }: { isHovered: boolean }) {
  return (
    <motion.div
      className="absolute inset-0 rounded-full"
      style={{
        border: '2px solid transparent',
        backgroundClip: 'padding-box',
        WebkitBackgroundClip: 'padding-box',
      }}
      animate={{
        backgroundImage: isHovered
          ? 'linear-gradient(to right, #EE9050, ##EE8034, #EE9050)'
          : 'linear-gradient(to right, #EE9050, ##EE8034, #EE9050)',
        backgroundPosition: isHovered ? '100% center' : '0% center',
      }}
      transition={{
        duration: 1.5,
        repeat: isHovered ? Infinity : 0,
        repeatType: 'reverse',
      }}
    />
  );
}

function AnimatedGlow({ isHovered }: { isHovered: boolean }) {
  return (
    <motion.div
      className="absolute inset-0 -"
      animate={{
        boxShadow: isHovered
          ? '0 0 20px 5px rgb(238, 128, 52), 0 0 40px 8px rgb(185, 144, 80)'
          : '0 0 20px 5px rgb(238, 128, 52), 0 0 40px 8px rgb(185, 144, 80)',
      }}
      transition={{ duration: 0.3 }}
    />
  );
}
