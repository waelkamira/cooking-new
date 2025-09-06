'use client';
import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

export default function Stars() {
  const [animateStars, setAnimateStars] = useState(false);
  const starsRef = useRef([]);

  // // Generate random stars for background effect
  // useEffect(() => {
  //   starsRef.current = Array.from({ length: 50 }, () => ({
  //     top: `${Math.random() * 100}%`,
  //     left: `${Math.random() * 100}%`,
  //     size: `${Math.random() * 2 + 1}px`,
  //     delay: `${Math.random() * 5}s`,
  //     duration: `${Math.random() * 3 + 2}s`,
  //   }));
  //   setAnimateStars(true);
  // }, []);
  // توليد النجوم للخلفية
  useEffect(() => {
    starsRef.current = Array.from({ length: 50 }, () => ({
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: `${Math.random() * 2 + 1}px`,
      delay: `${Math.random() * 5}s`,
      duration: `${Math.random() * 3 + 2}s`,
    }));
    setAnimateStars(true);
  }, []);
  return (
    <div>
      {/* Animated stars background */}
      {/* {animateStars &&
        starsRef.current.map((star, index) => (
          <div
            key={index}
            className="hidden sm:block absolute rounded-full bg-white animate-twinkle"
            style={{
              top: star.top,
              left: star.left,
              width: star.size,
              height: star.size,
              '--twinkle-delay': star.delay,
              '--twinkle-duration': star.duration,
            }}
          />
        ))} */}

      {animateStars &&
        starsRef.current.map((star, index) => (
          <motion.div
            key={index}
            className="hidden sm:block absolute rounded-full bg-white/80 shadow-lg"
            style={{
              top: star.top,
              left: star.left,
              width: star.size,
              height: star.size,
              boxShadow: `0 0 ${
                Number.parseInt(star.size) * 3
              }px rgba(255, 255, 255, 0.8)`,
            }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.4, 1, 0.4],
              // rotate: [0, 360],
            }}
            transition={{
              duration: Number.parseFloat(star.duration),
              delay: Number.parseFloat(star.delay),
              repeat: Number.POSITIVE_INFINITY,
              ease: 'easeInOut',
            }}
          />
        ))}
    </div>
  );
}
