'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Star, Eye } from 'lucide-react';
import { Button } from './ui/button';
import {} from './lib/utils';

interface AnimeCardProps {
  title: string;
  image: string;
  type: 'Anime' | 'Manga';
  rating?: number;
}

export default function AnimeCard({
  title,
  image,
  type,
  rating,
}: AnimeCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  return (
    <motion.div
      className="relative group hover:cursor-pointer"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ y: -8 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      <div className="relative overflow-hidden rounded-xl aspect-[2/3]">
        <Image
          src={image || '/placeholder.svg'}
          alt={title}
          fill
          className={
            'object-cover w-full h-full transition-transform duration-500 ' +
              isHovered && ' scale-110'
          }
        />

        <AnimatePresence>
          {isHovered && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <h3 className="text-sm font-medium line-clamp-1">{title}</h3>
                <div className="flex justify-between items-center mt-2">
                  {rating && (
                    <div className="flex items-center">
                      <Star className="h-3 w-3 text-yellow-500 fill-yellow-500 mr-1" />
                      <span className="text-xs">{rating}</span>
                    </div>
                  )}
                  <span className="text-xs text-gray-300">{type}</span>
                </div>

                <div className="flex gap-2 mt-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-full rounded-lg bg-white/10 hover:bg-white/20 backdrop-blur-sm"
                  >
                    <Eye className="h-3 w-3 ml-1" />
                    <span className="text-xs">شاهد</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-lg bg-white/10 hover:bg-white/20 backdrop-blur-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsFavorited(!isFavorited);
                    }}
                  >
                    <Heart
                      className={
                        'h-3 w-3 ' + isFavorited
                          ? 'fill-red-600 text-red-600'
                          : 'text-white'
                      }
                    />
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="absolute top-3 right-2 ">
        <motion.div
          className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-r from-primary to-secondary text-white text-xs font-medium shadow-lg"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            type: 'spring',
            stiffness: 400,
            damping: 20,
            delay: 0.1,
          }}
        >
          {type === 'Anime' ? 'A' : 'M'}
        </motion.div>
      </div>
    </motion.div>
  );
}
