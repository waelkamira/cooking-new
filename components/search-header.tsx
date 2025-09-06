// 'use client';

// import { useEffect, useRef, useState } from 'react';
// import { motion, useScroll, useTransform } from 'framer-motion';
// import Link from 'next/link';
// import { Sparkles, Bell, Bookmark, Menu, Router } from 'lucide-react';
// import AnimatedSearchBar from './animated-search-bar';
// import VoiceSearchButton from './voice-search-button';
// import Button from './Button';
// import Image from 'next/image';
// import { useRouter } from 'next/navigation';
// import SideBarMenu from './SideBarMenu';
// import Stars from './stars/stars';
// import ShootingStar from './stars/shootingStar';

// export default function SearchHeader() {
//   const { scrollYProgress } = useScroll();
//   const headerOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 1]);
//   const headerBlur = useTransform(scrollYProgress, [0, 0.1], [0, 8]);
//   const handleVoiceSearchResult = (transcript: string) => {
//     console.log('Voice search result:', transcript);
//     // Here you would typically set the search input value
//   };
//   const router = useRouter();
//   const [animateStars, setAnimateStars] = useState(false);
//   const starsRef = useRef([]);
//   const [isMenuOpen, setIsMenuOpen] = useState(false);

//   // Generate random stars for background effect
//   // useEffect(() => {
//   //   starsRef.current = Array.from({ length: 50 }, () => ({
//   //     top: `${Math.random() * 100}%`,
//   //     left: `${Math.random() * 100}%`,
//   //     size: `${Math.random() * 2 + 1}px`,
//   //     delay: `${Math.random() * 5}s`,
//   //     duration: `${Math.random() * 3 + 2}s`,
//   //   }));
//   //   setAnimateStars(true);
//   // }, []);

//   return (
//     <motion.header
//       style={{
//         opacity: headerOpacity,
//         backdropFilter: `blur(${headerBlur.get()}px)`,
//       }}
//       className="sm:fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-gradient-to-br from-gray-500 to-gray-600 border-b border-white/20 overflow-hidden"
//     >
//       {/* Animated stars background */}
//       {/* {animateStars &&
//         starsRef.current.map((star, index) => (
//           <div
//             key={index}
//             className="hidden sm:block absolute rounded-full bg-white animate-twinkle"
//             style={{
//               top: star.top,
//               left: star.left,
//               width: star.size,
//               height: star.size,
//               '--twinkle-delay': star.delay,
//               '--twinkle-duration': star.duration,
//             }}
//           />
//         ))} */}
//       <Stars />
//       <ShootingStar />
//       <div className="container flex justify-between items-center px-1  text-black w-full ">
//         <div className="flex justify-center items-center gap-2 mr-12 sm:mr-16">
//           <Link href="/home" className="flex items-center gap-1 sm:gap-4">
//             <motion.div
//               className="flex flex-col md:flex-row justify-center items-center py-4 gap-4"
//               initial={{ y: -20, opacity: 0 }}
//               animate={{ y: 0, opacity: 1 }}
//               transition={{ duration: 0.5 }}
//             >
//               <div className="flex items-center">
//                 <motion.div
//                   className="relative size-12 sm:size-16 "
//                   whileHover={{ scale: 1.1, rotate: 10 }}
//                 >
//                   <Image
//                     src="/images/bahiga.png"
//                     alt="Logo"
//                     layout="fill"
//                     objectFit="contain"
//                     className="rounded-full "
//                   />
//                   {/* <ShootingStar /> */}

//                   <motion.div
//                     className="hidden sm:block absolute inset-0 rounded-full"
//                     animate={{
//                       boxShadow: [
//                         '0 0 0 0 rgb(205, 158, 252,0)',
//                         '0 0 0 18px rgb(205, 158, 252,0.1)',
//                         '0 0 0 0 rgb(205, 158, 252,0)',
//                       ],
//                     }}
//                     transition={{
//                       duration: 2,
//                       repeat: Number.POSITIVE_INFINITY,
//                     }}
//                   />
//                 </motion.div>
//               </div>
//             </motion.div>
//             <motion.span
//               className="hidden sm:block font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary text-nowrap font-sans"
//               whileHover={{ scale: 1.05 }}
//             >
//               بهيجة أشرق لبن{' '}
//             </motion.span>
//           </Link>
//           <div className="flex items-center gap-4 flex-grow ">
//             <AnimatedSearchBar />
//             {/* البحث عن طريق الصوت */}
//             {/* <VoiceSearchButton
//                   onResult={handleVoiceSearchResult}
//                   className="hidden sm:block ml-2"
//                 /> */}
//           </div>
//         </div>

//         {/* the moon */}
//         <motion.div
//           className="hidden sm:flex flex-col md:flex-row justify-center items-center gap-4"
//           initial={{ y: -20, opacity: 0 }}
//           animate={{ y: 0, opacity: 1 }}
//           transition={{ duration: 0.5 }}
//         >
//           {' '}
//           <div className="flex items-center">
//             <motion.div
//               className="relative size-12 sm:size-16 sm:mr-4 "
//               whileHover={{ scale: 1.1, rotate: 10 }}
//               animate={{
//                 y: [0, -12, 0],
//                 rotate: [0, 360],
//                 scale: [1, 1.07, 1],
//               }}
//               transition={{
//                 duration: 100,
//                 repeat: Number.POSITIVE_INFINITY,
//               }}
//             >
//               <ShootingStar />

//               <Image
//                 src="/images/moon.png"
//                 alt="Logo"
//                 layout="fill"
//                 objectFit="contain"
//                 className="rounded-full"
//               />

//               <div className="absolute inset-0 rounded-full bg-gradient-to-r from-secondary to-white  blur-xl animate-pulse"></div>
//             </motion.div>
//           </div>
//         </motion.div>
//         {/* tabs */}
//         <div className="hidden xl:flex justify-between items-center w-fit gap-2 z-0 ">
//           <div className="flex items-center gap-6 text-black hover:text-primary mx-2">
//             <NavLink href="/zomurodaPlanet" label="زمردة" />
//             <NavLink href="/adventuresPlanet" label="مغامرات" />
//             <NavLink href="/actionPlanet" label="أكشن" />
//             <NavLink href="/sportPlanet" label="رياضة" />
//             <NavLink href="/bonbonaPlanet" label="بون بونة" />
//             <NavLink href="/arabicMoviesPlanet" label="أفلام" />
//           </div>
//           <div className="hidden md:flex items-center gap-4">
//             <motion.button
//               className="relative text-white hover:bg-white/10 h-10 w-10 rounded-full flex items-center justify-center transition-colors"
//               whileHover={{ scale: 1.1 }}
//               whileTap={{ scale: 0.95 }}
//             >
//               <Bell className="h-5 w-5" />
//               <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px]">
//                 3
//               </span>
//             </motion.button>

//             <motion.button
//               className="text-white hover:bg-white/10 h-10 w-10 rounded-full flex items-center justify-center transition-colors"
//               whileHover={{ scale: 1.1 }}
//               whileTap={{ scale: 0.95 }}
//             >
//               <Bookmark className="h-5 w-5" />
//             </motion.button>

//             <Button
//               path={'/login'}
//               title={'تسجيل الدخول'}
//               style={
//                 'border border-white/20 text-white hover:bg-white/10 rounded-full px-6 py-2.5 font-medium text-nowrap'
//               }
//             />
//           </div>
//         </div>
//       </div>
//     </motion.header>
//   );
// }

// function NavLink({ href, label }: { href: string; label: string }) {
//   return (
//     <Link href={href} className="group relative">
//       <span className="text-gray-300 hover:text-white transition-colors">
//         {label}
//       </span>
//       <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-secondary transition-all duration-300 group-hover:w-full"></span>
//     </Link>
//   );
// }
'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { Sparkles, Bell, Bookmark, Menu, Router } from 'lucide-react';
import AnimatedSearchBar from './animated-search-bar';
import VoiceSearchButton from './voice-search-button';
import Button from './Button';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import SideBarMenu from './SideBarMenu';
import Stars from './stars/stars';
import ShootingStar from './stars/shootingStar';
import { FaCloud } from 'react-icons/fa';

export default function SearchHeader() {
  const { scrollYProgress } = useScroll();
  const headerOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 1]);
  const headerBlur = useTransform(scrollYProgress, [0, 0.1], [0, 8]);

  const handleVoiceSearchResult = (transcript: string) => {
    console.log('Voice search result:', transcript);
    // Here you would typically set the search input value
  };

  return (
    <motion.header
      style={{
        opacity: headerOpacity,
        backdropFilter: `blur(${headerBlur.get()}px)`,
      }}
      className="sm:fixed top-0 left-0 right-0 z-50 transition-all duration-300 w-full bg-gradient-to-br from-gray-400 to-gray-600 border-white/20 overflow-hidden"
    >
      <Stars />
      <ShootingStar />
      <div className=" flex justify-between items-center  text-black w-full ">
        <div className="flex justify-center items-center gap-2 mr-12 sm:mr-24">
          <Link href="/home" className="flex items-center gap-1 sm:gap-4">
            <motion.div
              className="flex flex-col md:flex-row justify-center items-center py-4 gap-4"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center">
                <motion.div
                  className="relative size-12 sm:size-16 "
                  whileHover={{ scale: 1.1, rotate: 10 }}
                >
                  <Image
                    src="/images/bahiga.png"
                    alt="Logo"
                    layout="fill"
                    objectFit="contain"
                    className="rounded-full "
                  />
                  <motion.div
                    className="hidden sm:block absolute inset-0 rounded-full"
                    animate={{
                      boxShadow: [
                        '0 0 0 0 rgb(205, 158, 252,0)',
                        '0 0 0 18px rgb(205, 158, 252,0.1)',
                        '0 0 0 0 rgb(205, 158, 252,0)',
                      ],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                    }}
                  />
                </motion.div>
              </div>
            </motion.div>
            <motion.span
              className="hidden sm:block font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary text-nowrap font-sans"
              whileHover={{ scale: 1.05 }}
            >
              بهيجة أشرق لبن{' '}
            </motion.span>
          </Link>
          <div className="flex items-center gap-4 flex-grow ">
            <AnimatedSearchBar />
          </div>
        </div>

        {/* the moon with clouds */}
        <motion.div
          className="hidden sm:flex flex-col md:flex-row justify-center items-center"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* cloud 1 */}
          <motion.div
            className="z-[1999]"
            animate={{
              x: [100, 0, -100],
              opacity: [0, 1, 0],
              scale: [1, 1.07, 1],
            }}
            transition={{
              duration: 25,
              delay: 2,
              repeat: Number.POSITIVE_INFINITY,
            }}
          >
            <FaCloud className="absolute -top-12 bottom-0 mx-auto right-0 left-0 my-auto text-white w-16 h-8 z-[1999]" />{' '}
          </motion.div>
          {/* cloud 2 */}
          <motion.div
            className="z-[1999]"
            animate={{
              x: [-100, 0, 100],
              opacity: [0, 1, 0],
              scale: [1, 1.07, 1],
            }}
            transition={{
              duration: 30,
              repeat: Number.POSITIVE_INFINITY,
            }}
          >
            <FaCloud className="absolute top-4 bottom-0 mx-auto right-0 left-0 my-auto text-white w-28 h-16 z-[1999]" />{' '}
          </motion.div>
          <div className="flex items-center">
            <motion.div
              className="relative size-12 sm:size-16 sm:mr-4 "
              whileHover={{ scale: 1.1, rotate: 10 }}
              animate={{
                y: [0, -12, 0],
                rotate: [0, 360],
                scale: [1, 1.07, 1],
              }}
              transition={{
                duration: 100,
                repeat: Number.POSITIVE_INFINITY,
              }}
            >
              <ShootingStar />

              {/* First Cloud */}
              <motion.div
                className="absolute top-1/4 -left-4 w-12 h-6 bg-white rounded-full filter blur-sm z-50"
                initial={{ opacity: 0, x: -20 }}
                animate={{
                  opacity: [0, 0.8, 0],
                  x: [-20, 40, 60],
                }}
                transition={{
                  duration: 15,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatDelay: 5,
                  times: [0, 0.5, 1],
                }}
              />
              {/* Second Cloud */}
              <motion.div
                className="absolute bottom-0 right-0 top-0 left-0 mx-auto my-auto w-10 h-5 bg-white/70 rounded-full filter blur-sm z-50"
                initial={{ opacity: 0, x: 20 }}
                animate={{
                  opacity: [0, 1, 0],
                  x: [20, -30, -50],
                }}
                transition={{
                  duration: 12,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatDelay: 8,
                  times: [0, 0.5, 1],
                  delay: 4,
                }}
              />

              <Image
                src="/images/moon.png"
                alt="Logo"
                layout="fill"
                objectFit="contain"
                className="rounded-full z-10 relative"
              />

              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-secondary to-white  blur-xl animate-pulse"></div>
            </motion.div>
          </div>
        </motion.div>

        {/* tabs */}
        <div className="hidden xl:flex justify-between items-center w-fit gap-2 z-0 ">
          <div className="flex items-center gap-6 text-black hover:text-primary mx-2">
            <NavLink href="/home" label="الرئيسية" />
            <NavLink href="/zomurodaPlanet" label="زمردة" />
            <NavLink href="/adventuresPlanet" label="مغامرات" />
            <NavLink href="/actionPlanet" label="أكشن" />
            <NavLink href="/sportPlanet" label="رياضة" />
            <NavLink href="/bonbonaPlanet" label="بون بونة" />
            <NavLink href="/arabicMoviesPlanet" label="أفلام" />
          </div>
          <div className="hidden md:flex items-center gap-4">
            <motion.button
              className="relative text-white hover:bg-white/10 h-10 w-10 rounded-full flex items-center justify-center transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px]">
                3
              </span>
            </motion.button>

            <motion.button
              className="text-white hover:bg-white/10 h-10 w-10 rounded-full flex items-center justify-center transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Bookmark className="h-5 w-5" />
            </motion.button>

            <Button
              path={'/login'}
              title={'تسجيل الدخول'}
              style={
                'border border-white/20 text-white hover:bg-white/10 rounded-full px-6 py-2.5 font-medium text-nowrap'
              }
            />
          </div>
        </div>
      </div>
    </motion.header>
  );
}

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="group relative">
      <span className="text-gray-300 hover:text-white transition-colors">
        {label}
      </span>
      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-secondary transition-all duration-300 group-hover:w-full"></span>
    </Link>
  );
}
