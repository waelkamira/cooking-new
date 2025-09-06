'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import LoadingPhoto from './LoadingPhoto';
import ShootingStar from './stars/shootingStar';

const AnimatedLogo = ({ path }) => {
  const PLANET_IMAGES = {
    arabicMoviesPlanet: '/images/Movie.png',
    sportPlanet: '/images/Sport.png',
    bonbonaPlanet: '/images/Bonbona.png',
    kidsSongsPlanet: '/images/hidi.png',
    adventuresPlanet: '/images/Adventure.png',
    actionPlanet: '/images/Action.png',
    zomurodaPlanet: '/images/Zumoroda.png',
    spacetoonSongsPlanet: '/images/Spacetoon_logo.png',

    englishCartoonPlanet: '/images/hipo.png',
    englishMoviesPlanet: '/images/house.png',
    englishSongsPlanet: '/images/absi.png',

    turkishCartoonPlanet: '/images/watermelon.png',
    turkishMoviesPlanet: '/images/picatcu.png',
    turkishSongsPlanet: '/images/fish.png',

    default: '/images/bahiga.png',
  };

  const getLogoImage = () => {
    for (const [key, value] of Object.entries(PLANET_IMAGES)) {
      if (path.includes(key)) return value;
    }
    return PLANET_IMAGES.default;
  };

  return (
    <div className="relative flex justify-center items-center overflow-hidden w-full min-h-72">
      {/* Background with stars */}
      <div className="absolute inset-0 w-full ">
        {/* Static tiny stars in background */}
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 3}px`,
              height: `${Math.random() * 3}px`,
              opacity: Math.random() * 0.7 + 0.3,
            }}
          />
        ))}

        <ShootingStar />
      </div>

      {/* Main logo container */}
      {getLogoImage() ? (
        <motion.div
          className="relative h-48 w-56 my-4 z-[1999]"
          animate={{
            y: [0, -12, 0],
            rotate: [0, 8, 0, -8, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: 'reverse',
          }}
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-200 to-white blur-xl animate-pulse"></div>

          <Image
            src={getLogoImage() || '/placeholder.svg'}
            fill
            alt="Spacetoon Logo"
            className="drop-shadow-[0_0_25px_rgba(255,255,255,0.7)] object-contain relative z-10"
            priority
          />
        </motion.div>
      ) : (
        <LoadingPhoto />
      )}

      <style jsx>{`
        @keyframes twinkle {
          0%,
          100% {
            opacity: 0.3;
            transform: scale(0.8) rotate(0deg);
          }
          50% {
            opacity: 1;
            transform: scale(1.3) rotate(180deg);
          }
        }

        /* Improved shooting star animation with better trajectory */
        @keyframes shoot {
          0% {
            transform: translateX(0) translateY(0) rotate(var(--angle, 30deg));
            opacity: 0;
          }
          5% {
            opacity: 1;
          }
          95% {
            opacity: 1;
          }
          100% {
            transform: translateX(120vw) translateY(60vh)
              rotate(var(--angle, 30deg));
            opacity: 0;
          }
        }

        .animate-twinkle {
          animation: twinkle 3s ease-in-out infinite;
        }

        /* Enhanced shooting star styling with better glow effects */
        .shooting-star {
          position: absolute;
          width: 120px;
          height: 3px;
          transform-origin: left center;
          animation: shoot var(--duration, 2s) linear forwards;
          z-index: 30;
        }

        .star-head {
          position: absolute;
          right: -2px;
          top: 50%;
          transform: translateY(-50%);
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: #ffffff;
          box-shadow: 0 0 10px 2px rgba(255, 255, 255, 0.9),
            0 0 20px 4px rgba(135, 206, 250, 0.6),
            0 0 30px 6px rgba(255, 255, 255, 0.3);
        }

        .star-tail {
          position: absolute;
          left: 0;
          top: 0;
          height: 100%;
          width: 100%;
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.3) 20%,
            rgba(135, 206, 250, 0.8) 60%,
            rgba(255, 255, 255, 1) 100%
          );
          border-radius: 2px;
        }

        .sparkle-svg {
          filter: drop-shadow(0 0 6px currentColor);
        }
      `}</style>
    </div>
  );
};

export default AnimatedLogo;
