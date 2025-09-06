'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Heart, Play, Clock } from 'lucide-react';

interface FeaturedAnimeProps {
  title: string;
  image: string;
  rating: number;
  episodes: number;
  genres: string[];
  isNew?: boolean;
}

export default function FeaturedAnime({
  title,
  image,
  rating,
  episodes,
  genres,
  isNew = false,
}: FeaturedAnimeProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  return (
    <motion.div
      className="relative overflow-hidden rounded-xl border border-white/40 shadow-xl h-full"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ y: -10 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <div className="relative aspect-[3/4]">
        <Image
          src={image || '/images/photo-5.png'}
          alt={title}
          width={300}
          height={400}
          className={`object-cover w-full h-full transition-transform duration-500 ${
            isHovered ? 'scale-110' : ''
          }`}
        />

        {isNew && (
          <div className="absolute top-3 left-3 ">
            <span className="inline-flex items-center rounded-full bg-gradient-to-r from-primary to-secondary px-2.5 py-0.5 text-xs font-semibold text-white">
              جديد
            </span>
          </div>
        )}

        <div className="absolute top-3 right-3 ">
          <motion.button
            className="h-8 w-8 rounded-full bg-black backdrop-blur-sm hover:bg-black/60 flex items-center justify-center"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsFavorited(!isFavorited)}
          >
            <Heart
              className={`h-4 w-4 ${
                isFavorited ? 'fill-red-600 text-red-600' : 'text-white'
              }`}
            />
          </motion.button>
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-[#12121A] to-transparent">
          <AnimatePresence>
            {isHovered && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <motion.button
                  className="rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 h-16 w-16 flex items-center justify-center"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Play className="h-6 w-6 text-white fill-white" />
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-medium text-lg mb-2">{title}</h3>
        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1" />
            <span className="text-sm">{rating}</span>
          </div>
          <div className="flex items-center text-gray-400">
            <Clock className="h-3 w-3 mr-1" />
            <span className="text-xs">{episodes} eps</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {genres.map((genre) => (
            <span
              key={genre}
              className="text-xs bg-white/5 px-2 py-1 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
            >
              {genre}
            </span>
          ))}
        </div>

        <AnimatePresence>
          {isHovered && (
            <motion.div
              className="mt-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
            >
              <button className="w-full p-6 hover:scale-105 transition-all ease-in-out duration-200 rounded-lg py-2 text-white font-medium shadow-lg border border-white/20">
                شاهد الأن
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
