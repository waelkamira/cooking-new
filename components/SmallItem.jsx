'use client';

import { useContext, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';
import { useRouter, usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { IoMdClose } from 'react-icons/io';
import { FaHeart, FaRegHeart, FaUtensils, FaClock } from 'react-icons/fa';
import { SlLike } from 'react-icons/sl';
import { BiMessageRounded } from 'react-icons/bi';
import { inputsContext } from '../components/Context';
import LoadingPhoto from './LoadingPhoto';
import CustomToast from './CustomToast';
import Loading from './Loading';
import Button from './Button';

export default function SmallItem({ recipe, index, show = true, id = false }) {
  const [currentUser, setCurrentUser] = useState('');
  const [like, setLike] = useState(false);
  const [heart, setHeart] = useState(false);
  const [emoji, setEmoji] = useState(false);
  const [numberOfLikes, setNumberOfLikes] = useState(recipe?.likes || 0);
  const [numberOfHearts, setNumberOfHearts] = useState(recipe?.hearts || 0);
  const [numberOfEmojis, setNumberOfEmojis] = useState(recipe?.emojis || 0);
  const [isHovered, setIsHovered] = useState(false);
  const { dispatch } = useContext(inputsContext);
  const session = useSession();
  const router = useRouter();
  const path = usePathname();

  useEffect(() => {
    // Load user data from localStorage
    const loadUserFromLocalStorage = () => {
      if (typeof window !== 'undefined') {
        try {
          const storedUser = localStorage.getItem('CurrentUser');
          setCurrentUser(storedUser ? JSON.parse(storedUser) : null);
        } catch (error) {
          console.error('Error parsing CurrentUser from localStorage:', error);
        }
      }
    };

    loadUserFromLocalStorage();
    checkRecipeActionsStatus();
  }, [recipe?.id]);

  // Check Recipe Action Status (likes, hearts, emojis)
  async function checkRecipeActionsStatus() {
    try {
      const response = await fetch(`/api/actions?mealId=${recipe?.id}`);
      if (response.ok) {
        const json = await response.json();
        setLike(!!json[0]?.likes);
        setHeart(!!json[0]?.hearts);
        setEmoji(!!json[0]?.emojis);
      }
    } catch (error) {
      console.error('Error fetching action statuses:', error);
    }
  }

  // Update Recipe Action Numbers (PUT request)
  async function updateRecipeActionNumbers(mealId, actionType, newActionValue) {
    try {
      const response = await fetch(`/api/allCookingRecipes?id=${mealId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ actionType, newActionValue }),
      });

      if (!response.ok) {
        console.error(`Failed to update ${actionType} for meal ${mealId}`);
      }
    } catch (error) {
      console.error('Error updating recipe action numbers:', error);
    }
  }

  // Interaction Handler Function
  async function handleInteraction(
    mealId,
    actionType,
    setState,
    number,
    setNumber
  ) {
    if (session?.status !== 'authenticated') {
      toast.custom((t) => (
        <CustomToast t={t} message={'يجب عليك تسجيل الدخول أولا 😉'} />
      ));
      return;
    }

    const email = session.data.user.email;
    const currentState = number > 0;
    const actionValue = currentState ? 0 : 1;

    try {
      const response = await fetch(`/api/actions?email=${email}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mealId: mealId,
          actionType: actionType,
          actionValue: actionValue,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setState(!currentState);

        updateRecipeActionNumbers(mealId, actionType, result.newActionValue);

        const message = result.message;
        toast.custom((t) => (
          <CustomToast t={t} message={message} orangeEmoji="✔" emoji="😋" />
        ));

        setNumber(result.newActionValue);
      } else {
        console.error(`Failed to toggle ${actionType}`);
        toast.custom((t) => (
          <CustomToast t={t} message={'حدث خطأ ما'} emoji="😐" />
        ));
      }
    } catch (error) {
      console.error('Error in handleInteraction:', error);
      toast.custom((t) => (
        <CustomToast t={t} message={'حدث خطأ ما'} emoji="😐" />
      ));
    }
  }

  // Delete Post Function
  async function handleDeletePost(recipe) {
    const response = await fetch(
      `/api/allCookingRecipes?id=${recipe?.id}&isAdmin=${true}`,
      {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(recipe),
      }
    );

    if (response.ok) {
      toast.custom((t) => (
        <CustomToast
          t={t}
          message={'تم حذف هذا البوست بنجاح'}
          orangeEmoji="✔"
        />
      ));
      dispatch({ type: 'DELETE_RECIPE', payload: recipe });
      router.refresh();
    } else {
      toast.custom((t) => (
        <CustomToast t={t} message={'😐 حدث خطأ ما'} redEmoji="✖" />
      ));
    }
  }

  // Date formatting function
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return isNaN(date)
      ? 'Invalid date'
      : formatDistanceToNow(date, { addSuffix: true });
  };

  if (!recipe) return <Loading />;

  return (
    <Link href={`/recipes/${id ? recipe?.postId : recipe?.id}`}>
      <motion.div
        key={index}
        id="post1"
        className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 border-2  hover:border-primary "
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.1 }}
        dir="rtl"
      >
        {/* Recipe Image with Overlay */}
        <div className="relative h-64 overflow-hidden">
          <motion.div
            animate={{ scale: isHovered ? 1.05 : 1 }}
            transition={{ duration: 0.5 }}
            className="h-full w-full"
          >
            {recipe?.image ? (
              <Image
                // src={recipe.image || '/placeholder.jpg'}
                src={'/photo (15).png'}
                alt={recipe.mealName}
                layout="fill"
                objectFit="cover"
                className="transition-transform duration-500"
              />
            ) : (
              <LoadingPhoto />
            )}
          </motion.div>

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/30 to-transparent"></div>

          {/* Heart Button (Absolute Position) */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() =>
              handleInteraction(
                recipe.id,
                'hearts',
                setHeart,
                heart,
                setNumberOfHearts
              )
            }
            className="absolute top-4 left-4 h-10 w-10 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-sm shadow-lg"
          >
            {heart ? (
              <FaHeart className="h-5 w-5 text-primary" />
            ) : (
              <FaRegHeart className="h-5 w-5 text-white" />
            )}
          </motion.button>

          {/* Recipe Type Badge */}
          <div className="absolute top-4 right-4">
            <span className="px-3 py-1 text-sm font-medium text-white bg-gradient-to-r from-primary to-secondary rounded-full shadow-lg">
              وصفة شهية
            </span>
          </div>

          {/* Recipe Meta Info (Bottom of Image) */}
          <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
            <div className="flex items-center space-x-reverse space-x-3">
              <div className="flex items-center bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">
                <FaClock className="h-4 w-4 text-white ml-1" />
                <span className="text-xs font-medium text-white">٣٠ دقيقة</span>
              </div>
              <div className="flex items-center bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">
                <FaUtensils className="h-4 w-4 text-white ml-1" />
                <span className="text-xs font-medium text-white">٤ أشخاص</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recipe Content */}
        <div className="p-5">
          {/* Recipe Title */}
          <h2 className="text-gray-900 text-xl mb-3 line-clamp-1">
            {recipe.mealName}
          </h2>

          {/* Author Info */}
          <div className="flex items-center mb-4 border-t border-gray-100 pt-4">
            <div className="relative h-10 w-10 rounded-full overflow-hidden border-2 border-orange-100 ml-3">
              {recipe?.userImage ? (
                <Image
                  src={recipe.userImage || '/placeholder.svg'}
                  alt={recipe.userName}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-full"
                />
              ) : (
                <LoadingPhoto />
              )}
            </div>
            <div>
              <p className="font-medium text-gray-800">{recipe?.userName}</p>
              <p className="text-xs text-gray-500">
                {formatDate(recipe?.createdAt)}
              </p>
            </div>
          </div>

          {/* Recipe Ingredients */}
          <div className="mb-4">
            <div className="flex items-center mb-2 border-t border-gray-100 pt-4">
              <span className="h-5 w-5 rounded-full bg-orange-100 flex items-center justify-center ml-2">
                <FaUtensils className="h-3 w-3 text-primary" />
              </span>
              <h3 className="font-medium text-gray-800">المقادير:</h3>
            </div>
            <p className="text-gray-600 text-sm line-clamp-2 pr-7">
              {recipe?.ingredients}
            </p>
          </div>

          {/* Interaction Buttons */}
          {show && (
            <div className="flex items-center justify-between mt-4 border-t border-gray-100 pt-4">
              <button
                onClick={() =>
                  handleInteraction(
                    recipe.id,
                    'likes',
                    setLike,
                    like,
                    setNumberOfLikes
                  )
                }
                className={`flex items-center space-x-reverse space-x-1 px-3 py-1.5 rounded-full transition-colors ${
                  like
                    ? 'text-blue-500 bg-blue-50'
                    : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                <SlLike className="h-4 w-4" />
                <span className="text-sm font-medium">{numberOfLikes}</span>
              </button>

              <button
                onClick={() =>
                  handleInteraction(
                    recipe.id,
                    'hearts',
                    setHeart,
                    heart,
                    setNumberOfHearts
                  )
                }
                className={`flex items-center space-x-reverse space-x-1 px-3 py-1.5 rounded-full transition-colors ${
                  heart
                    ? 'text-primary bg-orange-50'
                    : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                <FaHeart className="h-4 w-4" />
                <span className="text-sm font-medium">{numberOfHearts}</span>
              </button>

              <button
                onClick={() =>
                  handleInteraction(
                    recipe.id,
                    'emojis',
                    setEmoji,
                    emoji,
                    setNumberOfEmojis
                  )
                }
                className={`flex items-center space-x-reverse space-x-1 px-3 py-1.5 rounded-full transition-colors ${
                  emoji
                    ? 'text-primary bg-orange-50'
                    : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                <span className="text-lg">🥝</span>
                <span className="text-sm font-medium">{numberOfEmojis}</span>
              </button>

              <div className="flex items-center space-x-reverse space-x-1 px-3 py-1.5 text-gray-500">
                <BiMessageRounded className="h-4 w-4" />
                <span className="text-sm font-medium">0</span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-4 flex justify-between items-center">
            <Button
              title={'عرض الوصفة'}
              path={`/recipes/${id ? recipe?.postId : recipe?.id}`}
              style={
                'px-5 py-2.5 bg-secondary shadow-xl shadow-white hover:shadow-xl hover:shadow-black/40 border-2 border-transparent hover:border-gray-500 text-white font-medium rounded-full transition-all duration-300 flex-grow text-center'
              }
            />

            {currentUser?.isAdmin === 1 && path === '/home' && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleDeletePost(recipe)}
                className="ml-2 p-2.5 bg-orange-100 text-primary rounded-full hover:bg-orange-200 focus:outline-none transition-colors duration-300"
              >
                <IoMdClose className="h-5 w-5" />
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

// return (
//   <Link href={`/recipes/${id ? recipe?.postId : recipe?.id}`}>
//     <motion.div
//       key={index}
//       id="post1"
//       className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 border-2 hover:border-primary"
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.3, delay: index * 0.1 }}
//       dir="rtl"
//     >
//       <div className="relative h-64 overflow-hidden">
//         <motion.div
//           animate={{ scale: isHovered ? 1.05 : 1 }}
//           transition={{ duration: 0.5 }}
//           className="h-full w-full"
//         >
//           {recipe?.image ? (
//             <Image
//               // src={recipe.image || '/placeholder.jpg'}
//               src={'/placeholder.jpg'}
//               alt={recipe.mealName}
//               layout="fill"
//               objectFit="cover"
//               className="transition-transform duration-500"
//             />
//           ) : (
//             <LoadingPhoto />
//           )}
//         </motion.div>
//         <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/30 to-transparent" />
//         <motion.button
//           whileTap={{ scale: 0.9 }}
//           onClick={(e) => {
//             e.stopPropagation;
//             handleInteraction(
//               recipe.id,
//               'hearts',
//               setHeart,
//               heart,
//               setNumberOfHearts
//             );
//           }}
//           className="absolute top-4 left-4 h-10 w-10 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-sm shadow-lg"
//         >
//           {heart ? (
//             <FaHeart className="h-5 w-5 text-primary" />
//           ) : (
//             <FaRegHeart className="h-5 w-5 text-white" />
//           )}
//         </motion.button>
//         <div className="absolute top-4 right-4">
//           <span className="px-3 py-1 text-sm font-medium bg-gradient-to-r from-primary to-secondary text-white rounded-full shadow-lg">
//             وصفة شهية
//           </span>
//         </div>
//       </div>

//       <div className="p-5">
//         <h2 className="text-gray-900 text-xl mb-3 line-clamp-1">
//           {recipe.mealName}
//         </h2>

//         <div className="flex items-center mb-4 border-t border-gray-100 pt-4">
//           <div className="relative h-10 w-10 rounded-full overflow-hidden border-2 border-orange-100 ml-3">
//             {recipe?.userImage ? (
//               <Image
//                 src={recipe.userImage}
//                 alt={recipe.userName}
//                 layout="fill"
//                 objectFit="cover"
//                 className="rounded-full"
//               />
//             ) : (
//               <LoadingPhoto />
//             )}
//           </div>
//           <div>
//             <p className="font-medium text-gray-800">{recipe?.userName}</p>
//             <p className="text-xs text-gray-500">
//               {formatDate(recipe?.createdAt)}
//             </p>
//           </div>
//         </div>

//         <div className="mb-4">
//           <div className="flex items-center mb-2 border-t border-gray-100 pt-4">
//             <span className="h-5 w-5 rounded-full bg-orange-100 flex items-center justify-center ml-2">
//               <FaUtensils className="h-3 w-3 text-primary" />
//             </span>
//             <h3 className="font-medium text-gray-800">المقادير:</h3>
//           </div>
//           <p className="text-gray-600 text-sm line-clamp-2 pr-7">
//             {recipe?.ingredients}
//           </p>
//         </div>

//         {show && (
//           <div
//             className="flex items-center justify-between mt-4 border-t border-gray-100 pt-4"
//             onClick={(e) => e.stopPropagation}
//           >
//             <button
//               onClick={() =>
//                 handleInteraction(
//                   recipe.id,
//                   'likes',
//                   setLike,
//                   like,
//                   setNumberOfLikes
//                 )
//               }
//               className={`flex items-center space-x-reverse space-x-1 px-3 py-1.5 rounded-full transition-colors ${
//                 like
//                   ? 'text-blue-500 bg-blue-50'
//                   : 'text-gray-500 hover:bg-gray-50'
//               }`}
//             >
//               <SlLike className="h-4 w-4" />
//               <span className="text-sm font-medium">{numberOfLikes}</span>
//             </button>

//             <button
//               onClick={() =>
//                 handleInteraction(
//                   recipe.id,
//                   'hearts',
//                   setHeart,
//                   heart,
//                   setNumberOfHearts
//                 )
//               }
//               className={`flex items-center space-x-reverse space-x-1 px-3 py-1.5 rounded-full transition-colors ${
//                 heart
//                   ? 'text-primary bg-orange-50'
//                   : 'text-gray-500 hover:bg-gray-50'
//               }`}
//             >
//               <FaHeart className="h-4 w-4" />
//               <span className="text-sm font-medium">{numberOfHearts}</span>
//             </button>

//             <button
//               onClick={() =>
//                 handleInteraction(
//                   recipe.id,
//                   'emojis',
//                   setEmoji,
//                   emoji,
//                   setNumberOfEmojis
//                 )
//               }
//               className={`flex items-center space-x-reverse space-x-1 px-3 py-1.5 rounded-full transition-colors ${
//                 emoji
//                   ? 'text-primary bg-orange-50'
//                   : 'text-gray-500 hover:bg-gray-50'
//               }`}
//             >
//               <span className="text-lg">🥝</span>
//               <span className="text-sm font-medium">{numberOfEmojis}</span>
//             </button>

//             <div className="flex items-center space-x-reverse space-x-1 px-3 py-1.5 text-gray-500">
//               <BiMessageRounded className="h-4 w-4" />
//               <span className="text-sm font-medium">0</span>
//             </div>
//           </div>
//         )}

// <div className="mt-4 flex justify-between items-center">
//   <Button
//     title={'عرض الوصفة'}
//     path={`/recipes/${id ? recipe?.postId : recipe?.id}`}
//     style={
//       ' px-5 py-2.5 bg-gradient-to-r from-primary to-secondary shadow-xl shadow-white hover:shadow-xl hover:shadow-black/40 border-2 border-transparent hover:border-gray-600 text-white font-medium rounded-full transition-all duration-300 flex-grow text-center'
//     }
//     icon={<FaUtensils />}
//   />

//   {currentUser?.isAdmin === 1 && path === '/home' && (
//     <motion.button
//       whileHover={{ scale: 1.05 }}
//       whileTap={{ scale: 0.95 }}
//       onClick={() => handleDeletePost(recipe)}
//       className="ml-2 p-2.5 bg-orange-100 text-primary rounded-full hover:bg-orange-200 focus:outline-none transition-colors duration-300"
//     >
//       <IoMdClose className="h-5 w-5" />
//     </motion.button>
//   )}
// </div>
//       </div>
//     </motion.div>
//   </Link>
// );
// }
